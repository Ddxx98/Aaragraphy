import React, { useState } from "react";
import styles from "./ReviewSection.module.css";
import Couple from "../../assets/couple 2.jpg";

const reviews = [
  {
    id: 1,
    image: Couple, // you replace
    text: "A good photographer, who actually made our time special and captured the important candid moments which we ourselves didn’t expect looks this great when we look back.",
    authorLine: "by Vicky Kaushal – Bride's Brother",
    coupleLine: "Aniketh Russel Weds Arunima David",
    date: "14-10-2025",
  },
  {
    id: 2,
    image: Couple,
    text: "They blended into the crowd and still managed to frame every precious second of the day. Looking at the photos feels like reliving the wedding all over again.",
    authorLine: "by Rahul Menon – Best Man",
    coupleLine: "Aarav Nair Weds Diya Sharma",
    date: "02-02-2026",
  },
  {
    id: 3,
    image: Couple,
    text: "Every frame feels cinematic yet honest. Our families still keep talking about how beautifully the emotions were captured.",
    authorLine: "by Sneha Rao – Bride",
    coupleLine: "Rohit Rao Weds Sneha Kulkarni",
    date: "24-08-2025",
  },
];

const ReviewSection = () => {
  const [index, setIndex] = useState(0);

  const prev = () =>
    setIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );

  const next = () =>
    setIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );

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
                alt={item.coupleLine}
                className={styles.image}
              />
            </div>

            <div className={styles.body}>
              <p className={styles.text}>{item.text}</p>
              <p className={styles.authorLine}>{item.authorLine}</p>
              <p className={styles.coupleLine}>{item.coupleLine}</p>
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
