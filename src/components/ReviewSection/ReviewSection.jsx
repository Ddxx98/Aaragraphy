import React, { useState, useEffect, useRef } from "react";
import styles from "./ReviewSection.module.css";
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
    date: "14-10-2025",
  },
  {
    id: "r2",
    image: coupleFallback,
    text: "The attention to detail and ability to stay invisible while capturing the most intimate moments was truly remarkable. We couldn't be happier with our wedding gallery!",
    authorLine: "Bride's Sister",
    groom: "Rahul",
    bride: "Priya",
    date: "20-11-2025",
  },
  {
    id: "r3",
    image: coupleFallback,
    text: "Every single frame tells a story. The composition and lighting are just breathtaking. It felt like reliving our special day all over again when we saw the photos.",
    authorLine: "Groom's Mother",
    groom: "James",
    bride: "Sarah",
    date: "05-12-2025",
  },
  {
    id: "r4",
    image: coupleFallback,
    text: "Professional, creative, and such a joy to work with. They made everyone feel so comfortable in front of the camera, and the results speak for themselves. Simply stunning!",
    authorLine: "Best Friend",
    groom: "Vikram",
    bride: "Anjali",
    date: "12-01-2026",
  }
];

const ReviewSection = () => {
  const [reviews, setReviews] = useState(STATIC_REVIEWS);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const firebaseData = await getFromDB('reviews');
        if (firebaseData) {
          const reviewsArray = Array.isArray(firebaseData)
            ? firebaseData
            : Object.entries(firebaseData).map(([id, val]) => ({ id, ...val }));

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

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth;

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Loading love from people...</div>;
  }

  if (reviews.length === 0) return null;

  return (
    <section className={styles.section}>
      <p className={styles.subTitle}>What people says about us?</p>
      <h2 className={styles.title}>Love Notes From Our Clients</h2>

      {reviews.length > 3 && (
        <div className={styles.controls}>
          <button className={styles.circleButton} onClick={() => scroll('left')} aria-label="Previous">
            ←
          </button>
          <button className={styles.circleButton} onClick={() => scroll('right')} aria-label="Next">
            →
          </button>
        </div>
      )}

      <div className={styles.grid} ref={scrollRef}>
        {reviews.map((item) => (
          item && (
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
                <p className={styles.authorLine}>by {item.authorLine}</p>
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
