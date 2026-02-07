import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BlogDetails.module.css';
import { fetchFromWP, getFeaturedImage, getACF, getImageUrl } from '../../utils/wpApi';
import { getFromDB } from '../../utils/fbApi';

import coupleFallback from '../../assets/couple.jpg';
import heroFallback from '../../assets/hero.jpg';
import captureFallback from '../../assets/capture.jpg';
import serviceFallback from '../../assets/couple.jpg';
import profileFallback from '../../assets/profile.jpg';
import weddingCeremonyFallback from '../../assets/wedding_ceremony.png';
import bridePortraitFallback from '../../assets/bride_portrait.png';
import ringsDetailFallback from '../../assets/rings_detail.png';

const STATIC_BLOG_DATA = {
    title: "A Beautiful Wedding Story",
    author: "Aniketh Russel & Arunima David",
    category: "Wedding",
    date: "2024-10-12",
    location: "South India, Bangalore",
    mainImage: coupleFallback,
    intro: "A good photographer, who actually made our time special and captured the important candid moments which we ourselves didn't expect looks this great when we look back. Every moment captured tells a unique story of love and celebration.",
    section1: {
        title: "The Beginning",
        text: "Every story has a beginning, and this one was filled with laughter and joy. The atmosphere was electric, and every guest could feel the love in the air. We focused on capturing the raw emotions and the small details that made the day truly special.",
        images: [heroFallback, captureFallback]
    },
    section2: {
        title: "The Ceremony",
        text: "The ceremony was a beautiful blend of tradition and modern elegance. The vows were heartfelt, and there wasn't a dry eye in the house. It was a privilege to be part of such an intimate and significant moment in their lives.",
        images: [serviceFallback, coupleFallback, profileFallback]
    },
    gallery: [
        { src: weddingCeremonyFallback, size: "large" },
        { src: bridePortraitFallback, size: "medium" },
        { src: ringsDetailFallback, size: "medium" }
    ]
};

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blogData, setBlogData] = useState(STATIC_BLOG_DATA);
    const [postIds, setPostIds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPostData = async () => {
            setLoading(true);
            try {
                // Firebase Fetching
                const firebaseData = await getFromDB(`posts/${id}`);
                const allPosts = await getFromDB('posts');

                if (allPosts) {
                    const ids = Array.isArray(allPosts)
                        ? allPosts.map(p => p.id)
                        : Object.keys(allPosts);
                    setPostIds(ids.map(Number));
                }

                if (firebaseData) {
                    setBlogData({
                        title: firebaseData.title || STATIC_BLOG_DATA.title,
                        author: firebaseData.author || STATIC_BLOG_DATA.author,
                        groom: firebaseData.groom || "",
                        bride: firebaseData.bride || "",
                        category: firebaseData.category || STATIC_BLOG_DATA.category,
                        date: firebaseData.date || STATIC_BLOG_DATA.date,
                        location: firebaseData.location || STATIC_BLOG_DATA.location,
                        mainImage: firebaseData.mainImage || STATIC_BLOG_DATA.mainImage,
                        intro: firebaseData.intro || STATIC_BLOG_DATA.intro,
                        section1: firebaseData.section1 || STATIC_BLOG_DATA.section1,
                        section2: firebaseData.section2 || STATIC_BLOG_DATA.section2,
                        gallery: firebaseData.gallery || STATIC_BLOG_DATA.gallery
                    });
                } else {
                    /* Commented out WordPress Dynamic Fetching
                    const post = await fetchFromWP(`/posts/${id}`, { _embed: 1 });

                    if (post) {
                        const acf = getACF(post);
                        const wpPosts = await fetchFromWP('/posts', { _fields: 'id' });
                        setPostIds(wpPosts.map(p => p.id));

                        const formattedData = {
                            title: post.title.rendered,
                            author: acf.author_name || STATIC_BLOG_DATA.author,
                            category: post.categories_names?.[0] || STATIC_BLOG_DATA.category,
                            date: acf.event_date || post.date.split('T')[0],
                            location: acf.location || STATIC_BLOG_DATA.location,
                            mainImage: getImageUrl(getFeaturedImage(post), STATIC_BLOG_DATA.mainImage),
                            intro: post.excerpt.rendered.replace(/<[^>]*>?/gm, ''),
                            section1: {
                                title: acf.section1_title || STATIC_BLOG_DATA.section1.title,
                                text: acf.section1_text || "",
                                images: acf.section1_images?.map(img => getImageUrl(img, "")) || []
                            },
                            section2: {
                                title: acf.section2_title || STATIC_BLOG_DATA.section2.title,
                                text: acf.section2_text || "",
                                images: acf.section2_images?.map(img => getImageUrl(img, "")) || []
                            },
                            gallery: acf.gallery_images?.map(img => ({
                                src: getImageUrl(img.url, ""),
                                size: img.size || "medium"
                            })) || []
                        };

                        setBlogData(formattedData);
                    } else {
                        setBlogData(STATIC_BLOG_DATA);
                    }
                    */
                    setBlogData(STATIC_BLOG_DATA);
                }
            } catch (error) {
                console.error("Failed to load blog details from Firebase, using static fallback:", error);
                setBlogData(STATIC_BLOG_DATA);
            } finally {
                setLoading(false);
            }
        };

        loadPostData();
    }, [id]);

    // Navigation logic
    const currentIndex = postIds.indexOf(Number(id));
    const prevId = currentIndex > 0 ? postIds[currentIndex - 1] : null;
    const nextId = currentIndex < postIds.length - 1 ? postIds[currentIndex + 1] : null;

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>Loading story details...</div>;
    }

    if (!blogData) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>Story not found.</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                {/* Navigation Bar */}
                <nav className={styles.navigation}>
                    <button onClick={() => navigate(-1)} className={styles.backButton}>
                        <span className={styles.arrowLeft}>←</span>
                    </button>

                    <div className={styles.navRight}>
                        <button
                            onClick={() => prevId && navigate(`/blog/${prevId}`)}
                            className={`${styles.navCircle} ${!prevId ? styles.disabled : ''}`}
                            disabled={!prevId}
                        >
                            <span className={styles.arrowLeft}>←</span>
                        </button>
                        <button
                            onClick={() => nextId && navigate(`/blog/${nextId}`)}
                            className={`${styles.navCircle} ${!nextId ? styles.disabled : ''}`}
                            disabled={!nextId}
                        >
                            <span className={styles.arrowRight}>→</span>
                        </button>
                    </div>
                </nav>

                {/* Header */}
                <header className={styles.header}>
                    <h1 className={styles.title}>{blogData.title}</h1>
                    <div className={styles.meta}>
                        {(blogData.groom || blogData.bride) && (
                            <div className={styles.namesRow} style={{ marginBottom: '10px', fontSize: '1.2em', fontStyle: 'italic' }}>
                                {blogData.groom} {blogData.groom && blogData.bride && '&'} {blogData.bride}
                            </div>
                        )}
                        <span className={styles.author}>{blogData.author}</span>
                        <span className={styles.category}>{blogData.category}</span>
                        <p className={styles.date}>Date: <span>{blogData.date}</span></p>
                        <p className={styles.location}>Location: <span>{blogData.location}</span></p>
                    </div>
                </header>

                {/* Main Image */}
                <div className={styles.mainImageWrapper}>
                    <h2 className={styles.sectionTitle}>Introduction</h2>
                    <img src={blogData.mainImage} alt={blogData.title} className={styles.mainImage} />
                    <p className={styles.text}>{blogData.intro}</p>
                </div>


                {/* Section 1 */}
                {blogData.section1.text && (
                    <div className={styles.contentBlock}>
                        <h2 className={styles.sectionTitle}>{blogData.section1.title}</h2>
                        <div className={styles.twoColGrid}>
                            {blogData.section1.images.map((img, index) => (
                                <div key={index} className={styles.gridImageWrapper}>
                                    <img src={img} alt={`Section 1 - ${index}`} className={styles.gridImage} />
                                </div>
                            ))}
                        </div>
                        <p className={styles.text}>{blogData.section1.text}</p>
                    </div>
                )}

                {/* Section 2 */}
                {blogData.section2.text && (
                    <div className={styles.contentBlock}>
                        <h2 className={styles.sectionTitle}>{blogData.section2.title}</h2>
                        <div className={styles.threeColGrid}>
                            {blogData.section2.images.map((img, index) => (
                                <div key={index} className={styles.gridImageWrapper}>
                                    <img src={img} alt={`Section 2 - ${index}`} className={styles.gridImage} />
                                </div>
                            ))}
                        </div>
                        <p className={styles.text}>{blogData.section2.text}</p>
                    </div>
                )}

                {/* Bottom Gallery */}
                {blogData.gallery.length > 0 && (
                    <div className={styles.galleryGrid}>
                        {blogData.gallery.map((item, index) => (
                            <div key={index} className={`${styles.galleryItem} ${styles[item.size]}`}>
                                <img src={item.src} alt={`Gallery ${index}`} className={styles.gridImage} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom Navigation */}
                <div className={styles.bottomNav}>
                    <span className={styles.bottomNavText}>Other Stories</span>
                    <div className={styles.navRight}>
                        <button
                            onClick={() => prevId && navigate(`/blog/${prevId}`)}
                            className={`${styles.navCircle} ${!prevId ? styles.disabled : ''}`}
                            disabled={!prevId}
                        >
                            <span className={styles.arrowLeft}>←</span>
                        </button>
                        <button
                            onClick={() => nextId && navigate(`/blog/${nextId}`)}
                            className={`${styles.navCircle} ${!nextId ? styles.disabled : ''}`}
                            disabled={!nextId}
                        >
                            <span className={styles.arrowRight}>→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
