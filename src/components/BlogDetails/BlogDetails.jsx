import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BlogDetails.module.css';
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
    title: "A Timeless Celebration",
    author: "Aaragraphy",
    groom: "Aniketh Russel",
    bride: "Arunima David",
    category: "Wedding",
    date: "2024-10-12",
    location: "Luttrellstown Castle, Dublin",
    mainImage: heroFallback,
    intro: "A beautiful day filled with love and laughter. Capturing the essence of a perfect wedding in one of Dublin's most iconic venues.",
    section1: {
        title: "The Morning Moments",
        text: "The preparation was full of nervous excitement and beautiful details.",
        images: [weddingCeremonyFallback, bridePortraitFallback]
    },
    section2: {
        title: "Grand Reception",
        text: "A night to remember with family and friends.",
        images: [ringsDetailFallback, coupleFallback, captureFallback]
    },
    gallery: [
        { src: weddingCeremonyFallback, size: 'large' },
        { src: bridePortraitFallback, size: 'small' },
        { src: ringsDetailFallback, size: 'small' }
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
                // Fetch all posts to find the specific one and handle navigation IDs
                const allPosts = await getFromDB('posts');

                if (allPosts) {
                    const postsArray = Array.isArray(allPosts)
                        ? allPosts
                        : Object.entries(allPosts).map(([fid, val]) => ({ ...val, id: fid }));

                    // Update all post IDs for navigation logic
                    const ids = postsArray.map(p => p.id);
                    setPostIds(ids);

                    // Find the specific post by ID
                    const foundPost = postsArray.find(p => String(p.id) === String(id));

                    if (foundPost) {
                        setBlogData({
                            title: foundPost?.title || STATIC_BLOG_DATA.title,
                            author: foundPost?.author || STATIC_BLOG_DATA.author,
                            groom: foundPost?.groom || STATIC_BLOG_DATA.groom,
                            bride: foundPost?.bride || STATIC_BLOG_DATA.bride,
                            category: foundPost?.category || STATIC_BLOG_DATA.category,
                            date: foundPost?.date || STATIC_BLOG_DATA.date,
                            location: foundPost?.location || STATIC_BLOG_DATA.location,
                            mainImage: foundPost?.mainImage || STATIC_BLOG_DATA.mainImage,
                            intro: foundPost?.intro || STATIC_BLOG_DATA.intro,
                            section1: foundPost?.section1 || STATIC_BLOG_DATA.section1,
                            section2: foundPost?.section2 || STATIC_BLOG_DATA.section2,
                            gallery: foundPost?.gallery || STATIC_BLOG_DATA.gallery
                        });
                    } else {
                        setBlogData(STATIC_BLOG_DATA);
                    }
                } else {
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

    // Navigation logic - use String comparison for safety
    const currentIndex = postIds.findIndex(pid => String(pid) === String(id));
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
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '32px' }}>Story not found</h2>
                <button onClick={() => navigate('/blog')} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>Back to Blog</button>
            </div>
        );
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
