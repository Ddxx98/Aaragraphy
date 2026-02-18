import React, { useState, useEffect } from "react";
import styles from "./AboutPhotographer.module.css";
import { fetchFromWP, getACF } from "../../utils/wpApi";
import { getFromDB } from "../../utils/fbApi";

const STATIC_DATA = {
    heroTitle: (
        <>
            WE DON'T JUST
            <br />
            <span>CAPTURE</span>
            <br />
            MOMENTS,
            <br />
            <span>WE LIVE THEM</span>
            <br />
            WITH YOU!
        </>
    ),
    heroMobileTitle: (
        <>
            WE DON'T JUST CAPTURE<br></br> MOMENTS, <br></br>
            WE LIVE THEM WITH YOU!
        </>
    ),
    testimonialText: `A good photographer, who actually made our time special and captured the important candid moments which we ourselves didn't expect looks this great when we look back.`
};

const AboutPhotographer = () => {
    const [data, setData] = useState({
        heroTitle: "",
        heroMobileTitle: "",
        testimonialText: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const firebaseData = await getFromDB('about_photographer');
                if (firebaseData) {
                    setData({
                        heroTitle: firebaseData.heroTitle || "",
                        heroMobileTitle: firebaseData.heroMobileTitle || "",
                        testimonial1: firebaseData.testimonial1 || "",
                        testimonial2: firebaseData.testimonial2 || "",
                        testimonial3: firebaseData.testimonial3 || ""
                    });
                }
            } catch (error) {
                console.error("Failed to load dynamic about photographer data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--bg-green-unified)', color: 'white' }}>Loading...</div>;
    }

    // Helper to render title with fallback
    const renderTitle = (title, fallback) => {
        if (!title) return fallback;
        return <div dangerouslySetInnerHTML={{ __html: title }} />;
    };

    return (
        <section className={styles.section}>
            {/* Left: Hero text */}
            <div className={styles.heroColumn}>
                <h1 className={styles.heroTitle}>
                    {renderTitle(data.heroTitle, STATIC_DATA.heroTitle)}
                </h1>
            </div>

            <div className={styles.heroMobileColumn}>
                <h1 className={styles.heroTitle}>
                    {renderTitle(data.heroMobileTitle, STATIC_DATA.heroMobileTitle)}
                </h1>
            </div>

            {/* Right: Scrolling testimonial */}
            <div className={styles.testimonialColumn}>
                <div className={styles.testimonialWrapper}>
                    <p className={styles.testimonialText}>
                        {data.testimonial1 || STATIC_DATA.testimonialText}
                    </p>
                    <p className={styles.testimonialText}>
                        {data.testimonial2 || STATIC_DATA.testimonialText}
                    </p>
                    <p className={styles.testimonialText}>
                        {data.testimonial3 || STATIC_DATA.testimonialText}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutPhotographer;
