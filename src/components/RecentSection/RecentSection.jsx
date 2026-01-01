import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecentSection.module.css";
import Couple from "../../assets/couple.jpg";

const RecentSection = () => {
    const navigate = useNavigate();
    const items = [
        {
            id: "engagement",
            title: "Engagement Shoots",
            coupleNames: "John and Jane",
            date: "2023-06-15",
            image: Couple,
        },
        {
            id: "wedding",
            title: "Wedding Shoots",
            coupleNames: "John and Jane",
            date: "2023-06-15",
            image: Couple,
        },
    ];

  return (
    <section className={styles.section}>
      <p className={styles.subTitle}>You are here to check our work right?</p>
      <h2 className={styles.title}>Recent captures</h2>

      <div className={styles.grid}>
        {items.map((item) => (
          <article key={item.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img
                src={item.image}
                alt={item.title}
                className={styles.image}
              />
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardTitleRow}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <span className={styles.arrow}>&rarr;</span>
              </div>

              <p className={styles.names}>
                {item.coupleNames}
              </p>

              <p className={styles.dateRow}>
                <span className={styles.dateLabel}>Date:</span>{" "}
                <span className={styles.dateValue}>{item.date}</span>
              </p>
            </div>
          </article>
        ))}
      </div>

      <button
        className={styles.viewAll}
        type="button"
        onClick={() => navigate('/blog')}
      >
        VIEW ALL
      </button>
    </section>
  );
};

export default RecentSection;
