import React, { useState, useEffect, useRef } from "react";
import styles from "./Instagram.module.css";
import { getFromDB } from "../../utils/fbApi";
import { Instagram as InstagramIcon, ChevronLeft, ChevronRight } from "lucide-react";

const Instagram = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        const loadInstagramFeed = async () => {
            try {
                const data = await getFromDB('instagram');
                if (data) {
                    const normalized = Array.isArray(data)
                        ? data
                        : Object.values(data);

                    // Generate image URLs from links if they are direct IG links
                    const feedWithImages = normalized.map(item => {
                        if (!item.link) return item;

                        // Clean the link (remove query params)
                        const cleanLink = item.link.split('?')[0];
                        // Ensure it ends with /
                        const baseLink = cleanLink.endsWith('/') ? cleanLink : `${cleanLink}/`;

                        return {
                            ...item,
                            image: item.image || `${baseLink}media/?size=l`
                        };
                    });

                    setPosts(feedWithImages);
                }
            } catch (error) {
                console.error("Failed to load Instagram feed:", error);
            } finally {
                setLoading(false);
            }
        };
        loadInstagramFeed();
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = current.clientWidth * 0.8;
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (loading) return <div className={styles.loading}>Loading Feed...</div>;
    if (posts.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <InstagramIcon className={styles.icon} />
                    <h2 className={styles.title}>On Instagram</h2>
                </div>
                <p className={styles.handle}>@aaragraphy.ie</p>

                <div className={styles.controls}>
                    <button onClick={() => scroll('left')} className={styles.controlBtn} aria-label="Scroll Left">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={() => scroll('right')} className={styles.controlBtn} aria-label="Scroll Right">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div className={styles.carouselContainer} ref={scrollRef}>
                {posts.map((post, index) => (
                    <a
                        key={post.id || index}
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.postCard}
                    >
                        <div className={styles.imageWrapper}>
                            <img src={post.image} alt="Instagram Post" className={styles.image} />
                            <div className={styles.overlay}>
                                <InstagramIcon className={styles.overlayIcon} />
                                <span>View on Instagram</span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default Instagram;
