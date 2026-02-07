import React, { useState, useEffect } from "react";
import styles from "./ReviewSection.module.css";
import { fetchFromWP, getFeaturedImage, getACF, getImageUrl } from "../../utils/wpApi";
import { getFromDB } from "../../utils/fbApi";
import coupleFallback from "../../assets/couple.jpg";

const STATIC_REVIEWS = [
  {
    id: "r1",
    image: coupleFallback,
    text: "A good photographer, who actually made our time special and captured the important candid moments which we ourselves didn't expect looks this great when we look back.",
    authorLine: "Happy Client",
    groom: "Aniketh Russel",
    bride: "Arunima David",
    date: "2024-10-12",
  }
];

const ReviewSection = () => {
  const [reviews, setReviews] = useState(STATIC_REVIEWS);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        // Firebase Fetching
        const firebaseData = await getFromDB('reviews');
        if (firebaseData && Array.isArray(firebaseData)) {
          setReviews(firebaseData);
        } else {
          /* Commented out WordPress Dynamic Fetching
          const data = await fetchFromWP('/reviews', { _embed: 1 });
  
          if (data && data.length > 0) {
            const formattedReviews = data.map(review => {
              const acf = getACF(review);
              return {
                id: review.id,
                image: getImageUrl(getFeaturedImage(review), STATIC_REVIEWS[0].image),
                text: review.content.rendered.replace(/<[^>]*>?/gm, ''), // Strip HTML tags
                authorLine: acf.author_line || "Happy Client",
                groom: acf.groom_name || "Groom",
                bride: acf.bride_name || "Bride",
                date: acf.event_date || review.date.split('T')[0],
              };
            });
            setReviews(formattedReviews);
          }
          */
          setReviews(STATIC_REVIEWS);
        }
      } catch (error) {
        console.error("Failed to load reviews from Firebase:", error);
        setReviews(STATIC_REVIEWS);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const prev = () =>
    setIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );

  const next = () =>
    setIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Loading love from people...</div>;
  }

  if (reviews.length === 0) return null;

  // current and next review for desktop two‑card layout
  const current = reviews[index];
  const nextIdx = (index + 1) % reviews.length;
  const second = reviews[nextIdx];

  return (
    <section className={styles.section}>
      <p className={styles.subTitle}>What people says about us?</p>
      <h2 className={styles.title}>Love from people</h2>

      <div className={styles.controls}>
        <button className={styles.circleButton} onClick={prev} type="button">
          ←
        </button>
        <button className={styles.circleButton} onClick={next} type="button">
          →
        </button>
      </div>

      {/* desktop: two cards; mobile: only the first one shown via CSS */}
      <div className={styles.grid}>
        {[current, second].map((item, i) => (
          <article key={item.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img
                src={item.image}
                alt={`${item.groom} & ${item.bride}`}
                className={styles.image}
              />
            </div>

            <div className={styles.body}>
              <p className={styles.text}>{item.text}</p>
              <p className={styles.authorLine}>{item.authorLine}</p>
              <p className={styles.coupleLine}>{item.groom} <span className={styles.weds}>Weds</span> {item.bride}</p>
              <p className={styles.dateLine}>
                <span className={styles.dateLabel}>Date:</span> {item.date}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;
