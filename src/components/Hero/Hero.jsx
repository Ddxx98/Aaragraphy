import React from "react";
import styles from "./Hero.module.css";
import backgroundImage from "../../assets/hero.jpg";

const Hero = () => {
  return (
    <section
      className={styles.hero}
      style={{
        backgroundImage: `linear-gradient(
          rgba(0,0,0,0.2),
          rgba(0,0,0,0.2)
        ), url(${backgroundImage})`,
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
        <p>1/250 | 1/500 | 1/160</p>
        <p>Unscripted</p>
        <p>f/1.8 | ISO 600</p>
        <p>Captured</p>
      </div>

      {/* Bottom Left: Location Info */}
      <div className={styles.bottomLeft}>
        <p>Since 2020</p>
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
            <span>Every photograph is a memory deciding how it will be remembered&nbsp;&nbsp;•&nbsp;&nbsp;</span>
            <span>Every photograph is a memory deciding how it will be remembered&nbsp;&nbsp;•&nbsp;&nbsp;</span>
          </div>
          <div className={styles.marqueeContent}>
            <span>Every photograph is a memory deciding how it will be remembered&nbsp;&nbsp;•&nbsp;&nbsp;</span>
            <span>Every photograph is a memory deciding how it will be remembered&nbsp;&nbsp;•&nbsp;&nbsp;</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
