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

const ReviewSection = ({ limited }) => {
  const [reviews, setReviews] = useState(STATIC_REVIEWS);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        // Firebase Fetching - Use 'reviews' collection from dashboard
        const firebaseData = await getFromDB('reviews');
        if (firebaseData) {
          const reviewsArray = Array.isArray(firebaseData)
            ? firebaseData
            : Object.entries(firebaseData).map(([id, val]) => ({ id, ...val }));

          // Sort by ID (usually timestamp) descending to show newest first
          const sorted = reviewsArray.sort((a, b) => b.id - a.id);

          const mappedReviews = sorted.map(rev => ({
            id: rev.id,
            image: rev.image || coupleFallback,
            text: rev.text || "A wonderful experience.",
            authorLine: rev.authorLine || "Happy Client",
            groom: rev.groom || "",
            bride: rev.bride || "",
            date: rev.date || ""
          }));

          setReviews(mappedReviews.length > 0 ? mappedReviews : STATIC_REVIEWS);
        } else {
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

  // Handle limiting
  const displayedReviews = limited ? reviews.slice(0, 2) : reviews;

  const prev = () =>
    setIndex((prevIndex) =>
      prevIndex === 0 ? displayedReviews.length - 1 : prevIndex - 1
    );

  const next = () =>
    setIndex((prevIndex) =>
      prevIndex === displayedReviews.length - 1 ? 0 : prevIndex + 1
    );

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Loading love from people...</div>;
  }

  if (displayedReviews.length === 0) return null;

  // For carousel/limited view
  const current = displayedReviews[index];
  const nextIdx = (index + 1) % displayedReviews.length;
  const second = displayedReviews[nextIdx];

  // Which items to actually render in the grid
  const itemsToRender = limited ? [current, second] : displayedReviews;

  return (
    <section className={`${styles.section} ${limited ? styles.limited : ''}`}>
      <p className={styles.subTitle}>What people says about us?</p>
      <h2 className={styles.title}>Love Notes From Our Clients</h2>

      {/* Only show controls in limited/carousel mode if there's what to slide - 
          actually user said "show only 2", so if limited, controls are less useful 
          unless we want to cycle them. Let's hide them if not limited to keep grid clean. */}
      {limited && displayedReviews.length > 1 && (
        <div className={styles.controls}>
          <button className={styles.circleButton} onClick={prev} type="button">
            ←
          </button>
          <button className={styles.circleButton} onClick={next} type="button">
            →
          </button>
        </div>
      )}

      <div className={styles.grid}>
        {itemsToRender.map((item, i) => (
          item && (
            <article key={item.id + (limited ? i : '')} className={styles.card} style={!limited ? { marginBottom: '40px' } : {}}>
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
          )
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;
