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
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState("Blog");

    useEffect(() => {
        const loadPosts = async () => {
            try {
                // Firebase Fetching
                const firebaseData = await getFromDB('posts');
                if (firebaseData) {
                    const postsArray = (Array.isArray(firebaseData)
                        ? firebaseData
                        : Object.entries(firebaseData).map(([id, val]) => ({ id, ...val }))
                    ).map(post => ({
                        ...post,
                        image: post.mainImage || post.image || blogFallback
                    }));
                    setBlogPosts(postsArray);
                } else {
                    setBlogPosts(STATIC_POSTS);
                }
            } catch (error) {
                console.error("Failed to load blog posts from Firebase, using static fallback:", error);
                setBlogPosts(STATIC_POSTS);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, []);

    if (loading) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>Loading stories...</div>;
    }

    return (
        <div>
            <Blog
                posts={blogPosts}
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
