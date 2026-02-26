import React, { useState, useEffect } from 'react';
import Blog from '../../components/Blog/Blog';
import Gallery from '../../components/Gallery/Gallery';
import ReviewSection from '../../components/ReviewSection/ReviewSection';
import { getFromDB } from '../../utils/fbApi';
import blogFallback from "../../assets/couple.jpg";

const STATIC_POSTS = [
    {
        id: "engagement",
        image: blogFallback,
        title: "Engagement Story",
        groom: "Aniketh Russel",
        bride: "Arunima David",
        date: "2024-10-12",
        category: "Wedding"
    },
    {
        id: "wedding",
        image: blogFallback,
        title: "Wedding Story",
        groom: "Aniketh Russel",
        bride: "Arunima David",
        date: "2024-10-12",
        category: "Wedding"
    }
];

const Blogs = () => {
    const [blogPosts, setBlogPosts] = useState(STATIC_POSTS);
    const [categories, setCategories] = useState(["All"]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState("Blog");

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // 1. Fetch Posts
                const postsData = await getFromDB('posts');
                if (postsData) {
                    const postsArray = (Array.isArray(postsData)
                        ? postsData
                        : Object.entries(postsData).map(([id, val]) => ({ id, ...val }))
                    ).map(post => ({
                        ...post,
                        image: post.mainImage || post.image || blogFallback
                    }));
                    setBlogPosts(postsArray);
                } else {
                    setBlogPosts(STATIC_POSTS);
                }

                // 2. Fetch Service Labels for Categories
                const servicesData = await getFromDB('serviceList');
                if (servicesData) {
                    const labels = Array.isArray(servicesData)
                        ? servicesData.map(s => s.label)
                        : Object.values(servicesData).map(s => s.label);

                    const uniqueLabels = ["All", ...new Set(labels.filter(l => l))];
                    setCategories(uniqueLabels);
                } else {
                    setCategories(["All", "Wedding", "Corporate", "Travel", "Baby Shower"]);
                }

            } catch (error) {
                console.error("Failed to load blog data from Firebase:", error);
                setBlogPosts(STATIC_POSTS);
                setCategories(["All", "Wedding", "Corporate", "Travel", "Baby Shower"]);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    if (loading) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>Loading stories...</div>;
    }

    return (
        <div>
            <Blog
                posts={blogPosts}
                categories={categories}
                activeView={activeView}
                setActiveView={setActiveView}
            />
            {activeView === "Gallery" && (
                <Gallery viewAll={false} limited={false} />
            )}
            <ReviewSection limited={false} />
        </div>
    );
};

export default Blogs;
