import React from "react";
import styles from "./AboutPhotographer.module.css";

const testimonialText = `A good photographer, who actually made our time special and captured the important candid moments which we ourselves didn't expect looks this great when we look back.`;

const AboutPhotographer = () => {
    return (
        <section className={styles.section}>
            {/* Left: Hero text */}
            <div className={styles.heroColumn}>
                <h1 className={styles.heroTitle}>
                    WE DON'T JUST
                    <br />
                    <span>CAPTURE</span>
                    <br />
                    MOMENTS,
                    <br />
                    <span>WE LIVE THEM</span>
                    <br />
                    WITH YOU!
                </h1>
            </div>

            {/* Right: Scrolling testimonial */}
            <div className={styles.testimonialColumn}>
                <div className={styles.testimonialWrapper}>
                    <p className={styles.testimonialText}>{testimonialText}</p>
                    <p className={styles.testimonialText}>{testimonialText}</p>
                    <p className={styles.testimonialText}>{testimonialText}</p>
                </div>
            </div>
        </section>
    );
};

export default AboutPhotographer;
