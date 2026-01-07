import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BlogDetails.module.css';

// Mock data dictionary
const blogPosts = {
    1: {
        title: "Memoir of Nature",
        author: "Aniketh Russel & Arunima David",
        category: "Wedding",
        date: "14 Oct 2025",
        location: "South India, Bangalore",
        mainImage: "/images/blog-1.jpg",
        intro: "A good photographer, who actually made our time special and captured the important candid moments which we ourselves didn’t expect look this great when we look back. A good photographer, who actually made our time special and captured the important candid moments.",
        section1: {
            title: "The Beginning",
            text: "A good photographer, who actually made our time special and captured the important candid moments which we ourselves didn’t expect look this great when we look back. A good photographer, who actually made our time special and captured the important candid moments.",
            images: ["/images/blog-2.jpg", "/images/blog-3.jpg"]
        },
        section2: {
            title: "The Ceremony",
            text: "A good photographer, who actually made our time special and captured the important candid moments which we ourselves didn’t expect look this great when we look back. A good photographer, who actually made our time special and captured the important candid moments.",
            images: ["/images/blog-4.jpg", "/images/blog-5.jpg", "/images/blog-6.jpg"]
        },
        gallery: [
            { src: "/images/blog-1.jpg", size: "large" },
            { src: "/images/blog-2.jpg", size: "medium" },
            { src: "/images/blog-3.jpg", size: "medium" },
            { src: "/images/blog-4.jpg", size: "large" },
            { src: "/images/blog-5.jpg", size: "medium" },
            { src: "/images/blog-6.jpg", size: "medium" },
        ]
    },
    2: {
        title: "Urban Symphony",
        author: "John Doe & Jane Smith",
        category: "Corporate",
        date: "20 Nov 2025",
        location: "Mumbai, India",
        mainImage: "/images/blog-2.jpg",
        intro: "Capturing the essence of corporate life in the bustling city of Mumbai. A symphony of lights, people, and architecture coming together.",
        section1: {
            title: "The Office",
            text: "Modern architecture meets functional design. We focused on the interplay of light and shadow in the corporate environment.",
            images: ["/images/blog-1.jpg", "/images/blog-3.jpg"]
        },
        section2: {
            title: "The Event",
            text: "Networking and celebration. Capturing candid moments of connection and collaboration.",
            images: ["/images/blog-4.jpg", "/images/blog-5.jpg", "/images/blog-6.jpg"]
        },
        gallery: [
            { src: "/images/blog-2.jpg", size: "large" },
            { src: "/images/blog-1.jpg", size: "medium" },
            { src: "/images/blog-3.jpg", size: "medium" },
            { src: "/images/blog-5.jpg", size: "large" },
            { src: "/images/blog-4.jpg", size: "medium" },
            { src: "/images/blog-6.jpg", size: "medium" },
        ]
    },
    3: {
        title: "Mountain Echoes",
        author: "Alice & Bob",
        category: "Travel",
        date: "05 Dec 2025",
        location: "Manali, Himachal Pradesh",
        mainImage: "/images/blog-3.jpg",
        intro: "The mountains are calling and we must go. A journey through the serene landscapes of the Himalayas.",
        section1: {
            title: "The Trek",
            text: "Every step was a discovery. The crisp air and the breathtaking views made the difficult climb worth it.",
            images: ["/images/blog-1.jpg", "/images/blog-2.jpg"]
        },
        section2: {
            title: "The Summit",
            text: "Standing at the top, looking down at the world below. A moment of peace and reflection.",
            images: ["/images/blog-4.jpg", "/images/blog-5.jpg", "/images/blog-6.jpg"]
        },
        gallery: [
            { src: "/images/blog-3.jpg", size: "large" },
            { src: "/images/blog-1.jpg", size: "medium" },
            { src: "/images/blog-2.jpg", size: "medium" },
            { src: "/images/blog-6.jpg", size: "large" },
            { src: "/images/blog-4.jpg", size: "medium" },
            { src: "/images/blog-5.jpg", size: "medium" },
        ]
    }
};

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Get data for the specific ID, or fallback to the first one
    const blogData = blogPosts[id] || blogPosts[1];

    // Navigation logic
    const postIds = Object.keys(blogPosts).map(Number);
    const currentIndex = postIds.indexOf(Number(id));

    const prevId = currentIndex > 0 ? postIds[currentIndex - 1] : null;
    const nextId = currentIndex < postIds.length - 1 ? postIds[currentIndex + 1] : null;

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]); // Re-scroll when ID changes

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
                        <span className={styles.author}>{blogData.author}</span>
                        <span className={styles.category}>{blogData.category}</span>
                        <p className={styles.date}>Date: <span>{blogData.date}</span></p>
                        <p className={styles.location}>Location: <span>{blogData.location}</span></p>
                    </div>
                </header>

                {/* Main Image */}
                <div className={styles.mainImageWrapper}>
                    <img src={blogData.mainImage} alt={blogData.title} className={styles.mainImage} />
                </div>

                {/* Intro Text */}
                <p className={styles.text}>{blogData.intro}</p>

                {/* Section 1 */}
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

                {/* Section 2 */}
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

                {/* Bottom Gallery */}
                <div className={styles.galleryGrid}>
                    {blogData.gallery.map((item, index) => (
                        <div key={index} className={`${styles.galleryItem} ${styles[item.size]}`}>
                            <img src={item.src} alt={`Gallery ${index}`} className={styles.gridImage} />
                        </div>
                    ))}
                </div>

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
