import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecentSection.module.css";
import Couple from "../../assets/couple.jpg";

const RecentSection = () => {
  const navigate = useNavigate();
  const items = [
    {
      id: 1,
      title: "Engagement Shoots",
      groom: "John",
      bride: "Jane",
      date: "2023-06-15",
      image: Couple,
    },
    {
      id: 2,
      title: "Wedding Shoots",
      groom: "John",
      bride: "Jane",
      date: "2023-06-15",
      image: Couple,
    },
  ];

  const handleBlogClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const handleKeyDown = (e, postId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleBlogClick(postId);
    }
  };

  return (
    <section className={styles.section}>
      <p className={styles.subTitle}>You are here to check our work right?</p>
      <h2 className={styles.title}>Recent captures</h2>

      <div className={styles.grid}>
        {items.map((item) => (
          <article
            key={item.id}
            className={styles.card}
            onClick={() => handleBlogClick(item.id)}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            role="button"
            tabIndex={0}
            aria-label={`Read ${item.title}`}
          >
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
                {item.groom} <span className={styles.weds}>&</span> {item.bride}
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
