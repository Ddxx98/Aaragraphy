import React from "react";
import styles from "./CapturedHero.module.css";
import CaptureHero from "../../assets/capture.jpg";

const CapturedHero = () => {
  return (
    <section
      className={styles.hero}
      style={{
        backgroundImage: `url(${CaptureHero})`,
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
