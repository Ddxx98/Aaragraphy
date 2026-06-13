"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./AboutUs.module.css";
import meImageFallback from "../../assets/profile.jpg";
import { fetchFromWP, getImageUrl, getACF, resolveImagePath } from "../../utils/wpApi";
import { getFromDB } from "../../utils/fbApi";

const STATIC_ABOUT_DATA = {
    myStory: "We are originally from India and currently based in Dublin. By profession, we work in tech but photography has been a quiet constant in our lives since college. What began as curiosity slowly became a way of seeing the world more clearly. Over the years, between code, deadlines, and relocations, the camera stayed with us. Eventually, it stopped being just a hobby and became something we wanted to take seriously. Photography, for us, isn’t a career switch, it’s a return to something we always carried with us.",
    whyPhotography: "Photography lets us slow down in a world that’s always rushing. It helps us notice small, honest moments, expressions, light, pauses that often go unseen. We’re drawn to stories that feel real rather than staged, and images that age well over time. Coming from a tech background, we value intention and clarity, but photography gives us something different: emotion, instinct, and presence. It’s how we connect with people, places, and moments that matter beyond the frame.",
    values: "We believe good photography starts with trust and patience. We value authenticity over perfection, simplicity over excess, and stories over trends. We approach every shoot with respect for the people, their time, and their moments. Our goal is to create images that feel natural, personal, and lasting. Whether it’s a portrait or a fleeting moment, we aim to document it as it truly felt—not just how it looked.",
    portrait: meImageFallback.src
};

const AboutUs = () => {
    const router = useRouter();
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
                        portrait: resolveImagePath(firebaseData.portrait || STATIC_ABOUT_DATA.portrait, meImageFallback.src)
                    });
                }
            } catch (error) {
                console.error("Failed to load dynamic about data from Firebase:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAboutData();
    }, []);

    const onContactClick = () => {
        router.push("/contact");
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
                <div className={styles.meText}>
                    <h3 className={styles.teamTitle}>Our team</h3>
                    <p className={styles.teamMember}>Photographer</p>
                    <p className={styles.teamMember}>Editor</p>
                    <p className={styles.teamMember}>Lightman</p>
                    <p className={styles.teamMember}>Camera assistant</p>
                </div>
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
