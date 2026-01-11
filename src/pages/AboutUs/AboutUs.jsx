import React, { useState, useEffect } from "react";
import styles from "./AboutUs.module.css";
import meImageFallback from "../../assets/profile.jpg";
import { fetchFromWP, getImageUrl, getACF } from "../../utils/wpApi";

const STATIC_ABOUT_DATA = {
    myStory: "A good photographer, who actually made our time special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.A good photographer, who actually made our\ntime special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.A good photographer, who actually made our time special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.",
    whyPhotography: "A good photographer, who actually made our time special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.A good photographer, who actually made our\ntime special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.A good photographer, who actually made our time special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.",
    values: "A good photographer, who actually made our time special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.A good photographer, who actually made our\ntime special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.A good photographer, who actually made our time special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.",
    portrait: meImageFallback
};

const AboutUs = () => {
    const [aboutData, setAboutData] = useState(STATIC_ABOUT_DATA);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAboutData = async () => {
            try {
                const pages = await fetchFromWP('/pages', { slug: 'about' });
                if (pages && pages.length > 0) {
                    const acf = getACF(pages[0]);
                    setAboutData({
                        myStory: acf.my_story && acf.my_story.trim() !== "" ? acf.my_story : STATIC_ABOUT_DATA.myStory,
                        whyPhotography: acf.why_photography && acf.why_photography.trim() !== "" ? acf.why_photography : STATIC_ABOUT_DATA.whyPhotography,
                        values: acf.values && acf.values.trim() !== "" ? acf.values : STATIC_ABOUT_DATA.values,
                        portrait: getImageUrl(acf.portrait, STATIC_ABOUT_DATA.portrait)
                    });
                }
            } catch (error) {
                console.error("Failed to load dynamic about data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAboutData();
    }, []);

    const onContactClick = () => {
        window.location.href = "/contact";
    }

    if (loading) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>Loading about me...</div>;
    }

    return (
        <section className={styles.section} id="about">
            <h2 className={styles.heading}>About me</h2>

            <div className={styles.blocksWrapper}>
                {/* My Story */}
                <article className={`${styles.block} ${styles.blockStory}`}>
                    <h3 className={styles.blockTitle}>My Story</h3>
                    <p className={styles.blockText}>
                        {aboutData.myStory}
                    </p>
                </article>

                {/* Why Photography */}
                <article className={`${styles.block} ${styles.blockWhy}`}>
                    <h3 className={styles.blockTitle}>Why Photography</h3>
                    <p className={styles.blockText}>
                        {aboutData.whyPhotography}
                    </p>
                </article>

                {/* Values */}
                <article className={`${styles.block} ${styles.blockValues}`}>
                    <h3 className={styles.blockTitle}>Values</h3>
                    <p className={styles.blockText}>
                        {aboutData.values}
                    </p>
                </article>
            </div>

            {/* Me section with portrait */}
            <div className={styles.meWrapper}>
                <div className={styles.meText}>Me</div>
                <div className={styles.meImageWrapper}>
                    <img src={aboutData.portrait} alt="Photographer portrait" className={styles.meImage} />
                </div>
            </div>

            {/* Integrated CTA */}
            <div className={styles.ctaWrapper}>
                <h3 className={styles.ctaTitle}>
                    Let's start the <br></br> Conversation
                </h3>
                <button
                    className={styles.ctaButton}
                    onClick={onContactClick}
                >
                    CONTACT
                </button>
            </div>
        </section>
    );
};

export default AboutUs;
