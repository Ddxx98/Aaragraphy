"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Gallery.module.css";
import { fetchFromWP, getImageUrl, resolveImagePath } from "../../utils/wpApi";
import { getFromDB } from "../../utils/fbApi";
import fallbackImg1 from "../../assets/hero.jpg";
import fallbackImg2 from "../../assets/capture.jpg";
import fallbackImg3 from "../../assets/couple.jpg";
import fallbackImg4 from "../../assets/couple.jpg";
import fallbackImg5 from "../../assets/couple 2.jpg";
import fallbackImg6 from "../../assets/profile.jpg";
import fallbackImg7 from "../../assets/wedding_ceremony.png";
import fallbackImg8 from "../../assets/bride_portrait.png";
import fallbackImg9 from "../../assets/rings_detail.png";

const Gallery = ({ viewAll, limited }) => {
    const router = useRouter();
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fallbackImages = [
        { id: 'f1', src: fallbackImg1.src, alt: 'Gallery Fallback 1' },
        { id: 'f2', src: fallbackImg2.src, alt: 'Gallery Fallback 2' },
        { id: 'f3', src: fallbackImg3.src, alt: 'Gallery Fallback 3' },
        { id: 'f4', src: fallbackImg4.src, alt: 'Gallery Fallback 4' },
        { id: 'f5', src: fallbackImg5.src, alt: 'Gallery Fallback 5' },
        { id: 'f6', src: fallbackImg6.src, alt: 'Gallery Fallback 6' },
        { id: 'f7', src: fallbackImg7.src, alt: 'Gallery Fallback 7' },
        { id: 'f8', src: fallbackImg8.src, alt: 'Gallery Fallback 8' },
        { id: 'f9', src: fallbackImg9.src, alt: 'Gallery Fallback 9' },
    ];

    useEffect(() => {
        const loadGallery = async () => {
            try {
                // Firebase Fetching
                const firebaseData = await getFromDB('gallery');
                if (firebaseData && Array.isArray(firebaseData)) {
                    const resolvedGallery = firebaseData.map(img => ({
                        ...img,
                        src: resolveImagePath(img.src, fallbackImg1.src)
                    }));
                    setGalleryImages(resolvedGallery);
                } else {
                    setGalleryImages(fallbackImages);
                }
            } catch (error) {
                console.error("Failed to load gallery images from Firebase:", error);
                setGalleryImages(fallbackImages);
            } finally {
                setLoading(false);
            }
        };

        loadGallery();
    }, []);

    if (loading) {
        return <div style={{ padding: '60px', textAlign: 'center' }}>Loading gallery...</div>;
    }

    // Determine which images to display
    const displayedImages = limited ? galleryImages.slice(0, 9) : galleryImages;

    return (
        <section className={styles.section}>
            <p className={styles.subTitle}>Curious to See More?</p>
            <h2 className={styles.title}>Explore Our Signature Work</h2>

            <div className={styles.grid}>
                {displayedImages.map((image, index) => (
                    <div key={image.id || index} className={styles.imageWrapper}>
                        <img
                          src={image.src}
                          alt={image.alt || `Gallery image ${index + 1}`}
                          className={styles.image}
                        />
                    </div>
                ))}
            </div>

            {viewAll && (
                <button
                    className={styles.viewAll}
                    type="button"
                    onClick={() => router.push('/blog')}
                >
                    VIEW ALL
                </button>
            )}
        </section>
    );
};

export default Gallery;
