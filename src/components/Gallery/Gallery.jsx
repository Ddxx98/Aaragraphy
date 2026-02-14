import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Gallery.module.css";
import { fetchFromWP, getImageUrl } from "../../utils/wpApi";
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
    const navigate = useNavigate();
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fallbackImages = [
        { id: 'f1', src: fallbackImg1, alt: 'Gallery Fallback 1' },
        { id: 'f2', src: fallbackImg2, alt: 'Gallery Fallback 2' },
        { id: 'f3', src: fallbackImg3, alt: 'Gallery Fallback 3' },
        { id: 'f4', src: fallbackImg4, alt: 'Gallery Fallback 4' },
        { id: 'f5', src: fallbackImg5, alt: 'Gallery Fallback 5' },
        { id: 'f6', src: fallbackImg6, alt: 'Gallery Fallback 6' },
        { id: 'f7', src: fallbackImg7, alt: 'Gallery Fallback 7' },
        { id: 'f8', src: fallbackImg8, alt: 'Gallery Fallback 8' },
        { id: 'f9', src: fallbackImg9, alt: 'Gallery Fallback 9' },
    ];

    useEffect(() => {
        const loadGallery = async () => {
            try {
                // Firebase Fetching
                const firebaseData = await getFromDB('gallery');
                if (firebaseData && Array.isArray(firebaseData)) {
                    setGalleryImages(firebaseData);
                } else {
                    /* Commented out WordPress Dynamic Fetching
                    const data = await fetchFromWP('/media', {
                        per_page: 9,
                        media_type: 'image'
                    });

                    let images = [];
                    if (data && data.length > 0) {
                        images = data.map(item => ({
                            id: item.id,
                            src: getImageUrl(item.source_url, fallbackImages[0].src),
                            alt: item.alt_text || item.title.rendered
                        }));
                    }

                    if (images.length < 9) {
                        const remainingCount = 9 - images.length;
                        const padding = fallbackImages.slice(images.length, 9);
                        images = [...images, ...padding];
                    }

                    setGalleryImages(images);
                    */
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
            <p className={styles.subTitle}>Want to see some more magic?</p>
            <h2 className={styles.title}>Our Gallery</h2>

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
                    onClick={() => navigate('/blog')}
                >
                    VIEW ALL
                </button>
            )}
        </section>
    );
};

export default Gallery;
