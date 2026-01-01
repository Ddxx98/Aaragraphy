import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Gallery.module.css";
import HeroImage from "../../assets/hero.jpg";
import ServiceImage from "../../assets/service.jpg";
import CoupleImage from "../../assets/couple.jpg";
import Couple2Image from "../../assets/couple 2.jpg";
import CaptureImage from "../../assets/capture.jpg";

const Gallery = () => {
    const navigate = useNavigate();
    const galleryImages = [
        { id: 1, src: HeroImage, alt: "Wedding moment 1" },
        { id: 2, src: ServiceImage, alt: "Wedding moment 2" },
        { id: 3, src: CoupleImage, alt: "Wedding moment 3" },
        { id: 4, src: Couple2Image, alt: "Wedding moment 4" },
        { id: 5, src: CaptureImage, alt: "Wedding moment 5" },
        { id: 6, src: HeroImage, alt: "Wedding moment 6" },
        { id: 7, src: ServiceImage, alt: "Wedding moment 7" },
        { id: 8, src: CoupleImage, alt: "Wedding moment 8" },
        { id: 9, src: Couple2Image, alt: "Wedding moment 9" },
    ];

    return (
        <section className={styles.section}>
            <p className={styles.subTitle}>Want to see some more magic?</p>
            <h2 className={styles.title}>Our Gallery</h2>

            <div className={styles.grid}>
                {galleryImages.map((image, index) => (
                    <div key={image.id || index} className={styles.imageWrapper}>
                        <img
                            src={image.src}
                            alt={image.alt || `Gallery image ${index + 1}`}
                            className={styles.image}
                        />
                    </div>
                ))}
            </div>

            <button
                className={styles.viewAll}
                type="button"
                onClick={() => navigate('/blog')}
            >
                VIEW ALL
            </button>
        </section>
    );
};

export default Gallery;
