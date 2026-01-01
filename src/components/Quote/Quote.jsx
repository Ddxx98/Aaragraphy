import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Quote.module.css";

const Quote = () => {
    const navigate = useNavigate();
  return (
    <section className={styles.section}>

      <div className={styles.mainLayout}>
        <div className={styles.grid}>
          <div className={styles.gridCell}>Moments</div>
          <div className={styles.gridCell}>stored</div>
          <div className={styles.gridCell}>intensionally</div>

          <div className={styles.gridCell}>become</div>
          <div className={`${styles.gridCell} ${styles.contactCell}`} onClick={() => navigate('/contact')}>contact</div>
          <div className={styles.gridCell}>memories.</div>

          <div className={styles.gridCell}>Let&apos;s</div>
          <div className={styles.gridCell}>Store</div>
          <div className={styles.gridCell}>Yours.</div>
        </div>
      </div>

      <div className={styles.tagsBar}>
        <span className={styles.tagsTitle}>Tags</span>
        <p className={styles.tagsText}>
          Photography, Films,  Cinematic Films, Wedding Photography, Best Photographer, Travel Photography, Photography, Films,  Cinematic Films, Wedding Photography, Best Photographer, Travel Photography, Photography, Films,  Cinematic Films, Wedding Photography, Best Photographer, Travel Photography,Photography, Films,  Cinematic Films, Wedding Photography, Best Photographer, Travel Photography, and other tags for SEO
        </p>
      </div>
    </section>
  );
};

export default Quote;
