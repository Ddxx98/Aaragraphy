import React, { useState, useEffect } from 'react';
import Blog from '../../components/Blog/Blog';
import Gallery from '../../components/Gallery/Gallery';
import ReviewSection from '../../components/ReviewSection/ReviewSection';
import { fetchFromWP, getImageUrl, getACF, getFeaturedImage } from "../../utils/wpApi";
import { getFromDB } from "../../utils/fbApi";
import blogFallback from "../../assets/couple.jpg";

const STATIC_POSTS = [
    {
        id: "engagement",
        image: blogFallback,
        title: "Engagement",
        groom: "Aniketh Russel",
        bride: "Arunima David",
        date: "2024-10-12",
        category: "Wedding"
    },
    {
        id: "wedding",
        image: blogFallback,
        title: "Wedding",
        groom: "Aniketh Russel",
        bride: "Arunima David",
        date: "2024-10-12",
        category: "Wedding"
    }
];

const Blogs = () => {
    const [blogPosts, setBlogPosts] = useState(STATIC_POSTS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                // Firebase Fetching
                const firebaseData = await getFromDB('posts');
                if (firebaseData) {
                    const postsArray = Array.isArray(firebaseData)
                        ? firebaseData
                        : Object.entries(firebaseData).map(([id, val]) => ({ id, ...val }));
                    setBlogPosts(postsArray);
                } else {
                    /* Commented out WordPress Dynamic Fetching
                    const data = await fetchFromWP('/posts', { _embed: 1 });

                    if (data && data.length > 0) {
                        const formattedPosts = data.map(post => {
                            const acf = getACF(post);
                            return {
                                id: post.id,
                                image: getImageUrl(getFeaturedImage(post), STATIC_POSTS[0].image),
                                title: post.title.rendered,
                                groom: acf.groom_name || "Groom",
                                bride: acf.bride_name || "Bride",
                                date: acf.event_date || post.date.split('T')[0],
                                category: post.categories_names?.[0] || "Wedding"
                            };
                        });
                        setBlogPosts(formattedPosts);
                    }
                    */
                    setBlogPosts(STATIC_POSTS);
                }
            } catch (error) {
                console.error("Failed to load blog posts from Firebase:", error);
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
            <Blog posts={blogPosts} />
            <Gallery viewAll={false} />
            <ReviewSection />
        </div>
    );
};

export default Blogs;
