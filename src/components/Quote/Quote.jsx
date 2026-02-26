import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Quote.module.css";
import { getFromDB } from "../../utils/fbApi";

const Quote = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState("Dublin Photographer, Professional Photographer Dublin, Ireland Wedding Photographer, Dublin Wedding Photography, Event Photographer Dublin, Portrait Photographer Dublin, Engagement Photographer Ireland, Elopement Photographer Dublin, Travel Photographer Ireland, Corporate Event Photographer Dublin, Luxury Photography Dublin, Cinematic Wedding Photography Ireland, Creative Portrait Photography Dublin, Affordable Photographer Dublin, Destination Wedding Photographer Ireland");

  useEffect(() => {
    const loadQuoteData = async () => {
      try {
        const data = await getFromDB('quote');
        if (data && data.tags) {
          setTags(data.tags);
        }
      } catch (error) {
        console.error("Failed to load quote data:", error);
      }
    };
    loadQuoteData();
  }, []);

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
          {tags}
        </p>
      </div>
    </section>
  );
};

export default Quote;
