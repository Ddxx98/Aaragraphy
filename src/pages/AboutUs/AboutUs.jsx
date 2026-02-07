import React, { useState, useEffect } from "react";
import styles from "./AboutUs.module.css";
import meImageFallback from "../../assets/profile.jpg";
import { fetchFromWP, getImageUrl, getACF } from "../../utils/wpApi";
import { getFromDB } from "../../utils/fbApi";

const STATIC_ABOUT_DATA = {
    myStory: "I’m originally from India and currently based in Dublin. By profession, I work in tech but photography has been a quiet constant in my life since college. What began as curiosity slowly became a way of seeing the world more clearly. Over the years, between code, deadlines, and relocations, the camera stayed with me. Eventually, it stopped being just a hobby and became something I wanted to take seriously. Photography, for me, isn’t a career switch, it’s a return to something I always carried with me.",
    whyPhotography: "Photography lets me slow down in a world that’s always rushing. It helps me notice small, honest moments, expressions, light, pauses that often go unseen. I’m drawn to stories that feel real rather than staged, and images that age well over time. Coming from a tech background, I value intention and clarity, but photography gives me something different: emotion, instinct, and presence. It’s how I connect with people, places, and moments that matter beyond the frame.",
    values: "I believe good photography starts with trust and patience. I value authenticity over perfection, simplicity over excess, and stories over trends. I approach every shoot with respect for the people, their time, and their moments. My goal is to create images that feel natural, personal, and lasting. Whether it’s a portrait or a fleeting moment, I aim to document it as it truly felt—not just how it looked.",
    portrait: meImageFallback
};

const AboutUs = () => {
    const [aboutData, setAboutData] = useState(STATIC_ABOUT_DATA);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAboutData = async () => {
            try {
                // Firebase Fetching
                const firebaseData = await getFromDB('about');
                if (firebaseData) {
                    setAboutData({
                        myStory: firebaseData.myStory || STATIC_ABOUT_DATA.myStory,
                        whyPhotography: firebaseData.whyPhotography || STATIC_ABOUT_DATA.whyPhotography,
                        values: firebaseData.values || STATIC_ABOUT_DATA.values,
                        portrait: firebaseData.portrait || STATIC_ABOUT_DATA.portrait
                    });
                }

                /* Commented out WordPress Dynamic Fetching
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
                */
            } catch (error) {
                console.error("Failed to load dynamic about data from Firebase:", error);
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
