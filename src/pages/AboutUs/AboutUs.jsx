import React from "react";
import styles from "./AboutUs.module.css";
import meImage from "../../assets/profile.jpg";

const AboutUs = () => {
    const onContactClick = () => {
        window.location.href = "/contact";
    }

    return (
        <section className={styles.section} id="about">
            <h2 className={styles.heading}>About me</h2>

            <div className={styles.blocksWrapper}>
                {/* My Story */}
                <article className={`${styles.block} ${styles.blockStory}`}>
                    <h3 className={styles.blockTitle}>My Story</h3>
                    <p className={styles.blockText}>
                        A good photographer, who actually made our time special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.A good photographer, who actually made our
                        <br></br>
                        time special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.A good photographer, who actually made our time special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.
                    </p>
                </article>

                {/* Why Photography */}
                <article className={`${styles.block} ${styles.blockWhy}`}>
                    <h3 className={styles.blockTitle}>Why Photography</h3>
                    <p className={styles.blockText}>
                        A good photographer, who actually made our time special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.A good photographer, who actually made our
                        <br></br>
                        time special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.A good photographer, who actually made our time special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.
                    </p>
                </article>

                {/* Values */}
                <article className={`${styles.block} ${styles.blockValues}`}>
                    <h3 className={styles.blockTitle}>Values</h3>
                    <p className={styles.blockText}>
                        A good photographer, who actually made our time special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.A good photographer, who actually made our
                        <br></br>
                        time special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.A good photographer, who actually made our time special and captured the important candid moments which we ourselve sdidn’t expected looks this great when we look back.
                    </p>
                </article>
            </div>

            {/* Me section with portrait */}
            <div className={styles.meWrapper}>
                <div className={styles.meText}>Me</div>
                <div className={styles.meImageWrapper}>
                    <img src={meImage} alt="Photographer portrait" className={styles.meImage} />
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
