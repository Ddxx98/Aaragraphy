import React, { useState, useEffect } from "react";
import styles from "./Hero.module.css";
import backgroundImageFallback from "../../assets/hero.jpg";
import { fetchFromWP, getImageUrl, getACF } from "../../utils/wpApi";
import { getFromDB } from "../../utils/fbApi";

const Hero = () => {
  const [heroImage, setHeroImage] = useState(backgroundImageFallback);

  useEffect(() => {
    const loadHeroData = async () => {
      try {
        // Firebase Fetching
        const firebaseData = await getFromDB('hero');
        if (firebaseData && firebaseData.image) {
          setHeroImage(firebaseData.image);
        }

        /* Commented out WordPress Dynamic Fetching
        const pages = await fetchFromWP('/pages', { slug: 'home' });
        if (pages.length > 0) {
          const acf = getACF(pages[0]);
          setHeroImage(getImageUrl(acf.hero_background, backgroundImageFallback));
        }
        */
      } catch (error) {
        console.error("Failed to load dynamic hero image from Firebase:", error);
      }
    };

    loadHeroData();
  }, []);

  return (
    <section
      className={styles.hero}
      style={{
        backgroundImage: `linear-gradient(
          rgba(0,0,0,0.2),
          rgba(0,0,0,0.2)
        ), url(${heroImage})`,
      }}
    >
      {/* Top Left: Circular Badge */}
      <div className={styles.badge}>
        <svg viewBox="0 0 100 100" width="100" height="100" className={styles.badgeSvg}>
          <path
            id="circlePath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            fill="none"
          />
          <text className={styles.badgeText}>
            <textPath href="#circlePath" startOffset="0%">
              Capturing moments that matter •
            </textPath>
          </text>
        </svg>
      </div>

      {/* Top Right: Camera Settings */}
      <div className={styles.topRight}>
        <p>1/160 | 1/250 | 1/500</p>
        <p>Unscripted</p>
        <p>f/1.8 | ISO 100</p>
        <p>Captured</p>
      </div>

      {/* Bottom Left: Location Info */}
      <div className={styles.bottomLeft}>
        <p>Since 2024</p>
        <p>Based in Dublin</p>
      </div>

      {/* Bottom Right: Curated Work Note */}
      <div className={styles.bottomRight}>
        <p>Images shown are a curated</p>
        <p>selection of past work</p>
      </div>

      {/* Bottom: Marquee */}
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeInner}>
          <div className={styles.marqueeContent}>
            <span>Photographing Life As It Happens&nbsp;&nbsp;•&nbsp;&nbsp;</span>
            <span>Photographing Life As It Happens&nbsp;&nbsp;•&nbsp;&nbsp;</span>
          </div>
          <div className={styles.marqueeContent}>
            <span>Photographing Life As It Happens&nbsp;&nbsp;•&nbsp;&nbsp;</span>
            <span>Photographing Life As It Happens&nbsp;&nbsp;•&nbsp;&nbsp;</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
