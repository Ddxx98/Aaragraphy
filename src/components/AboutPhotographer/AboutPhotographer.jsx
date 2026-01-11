import React, { useState, useEffect } from "react";
import styles from "./AboutPhotographer.module.css";
import { fetchFromWP, getACF } from "../../utils/wpApi";

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
    const [data, setData] = useState(STATIC_DATA);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const pages = await fetchFromWP('/pages', { slug: 'home' });
                if (pages && pages.length > 0) {
                    const acf = getACF(pages[0]);
                    setData({
                        heroTitle: acf.about_hero_title ? (
                            <div dangerouslySetInnerHTML={{ __html: acf.about_hero_title }} />
                        ) : STATIC_DATA.heroTitle,
                        heroMobileTitle: acf.about_hero_mobile_title ? (
                            <div dangerouslySetInnerHTML={{ __html: acf.about_hero_mobile_title }} />
                        ) : STATIC_DATA.heroMobileTitle,
                        testimonialText: acf.about_testimonial_text || STATIC_DATA.testimonialText
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
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <section className={styles.section}>
            {/* Left: Hero text */}
            <div className={styles.heroColumn}>
                <h1 className={styles.heroTitle}>
                    {data.heroTitle}
                </h1>
            </div>

            <div className={styles.heroMobileColumn}>
                <h1 className={styles.heroTitle}>
                    {data.heroMobileTitle}
                </h1>
            </div>

            {/* Right: Scrolling testimonial */}
            <div className={styles.testimonialColumn}>
                <div className={styles.testimonialWrapper}>
                    <p className={styles.testimonialText}>{data.testimonialText}</p>
                    <p className={styles.testimonialText}>{data.testimonialText}</p>
                    <p className={styles.testimonialText}>{data.testimonialText}</p>
                </div>
            </div>
        </section>
    );
};

export default AboutPhotographer;
