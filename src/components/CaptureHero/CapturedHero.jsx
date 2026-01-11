import React, { useState, useEffect } from "react";
import styles from "./CapturedHero.module.css";
import backgroundImageFallback from "../../assets/capture.jpg";
import { fetchFromWP, getImageUrl, getACF } from "../../utils/wpApi";

const CapturedHero = () => {
  const [heroImage, setHeroImage] = useState(backgroundImageFallback);

  useEffect(() => {
    const loadHeroData = async () => {
      try {
        // Attempt to fetch 'home' page for section data
        const pages = await fetchFromWP('/pages', { slug: 'home' });
        if (pages.length > 0) {
          const acf = getACF(pages[0]);
          setHeroImage(getImageUrl(acf.captured_hero_background, backgroundImageFallback));
        }
      } catch (error) {
        console.error("Failed to load dynamic captured hero image:", error);
      }
    };

    loadHeroData();
  }, []);

  return (
    <section
      className={styles.hero}
      style={{
        backgroundImage: `url(${heroImage})`,
        filter: "grayscale(100%)",
      }}
    >
      <div className={styles.overlay}>
        <h1 className={styles.title}>
          <span className={styles.titleLine1}>Captured Real</span>
        </h1>
      </div>
    </section>
  );
};

export default CapturedHero;
