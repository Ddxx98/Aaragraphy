import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecentSection.module.css";
import coupleFallback from "../../assets/couple.jpg";
import { fetchFromWP, getImageUrl, getACF, getFeaturedImage } from "../../utils/wpApi";
import { getFromDB } from "../../utils/fbApi";

const STATIC_ITEMS = [
  {
    id: "engagement",
    title: "Engagement",
    groom: "Aniketh Russel",
    bride: "Arunima David",
    date: "2024-10-12",
    image: coupleFallback
  },
  {
    id: "wedding",
    title: "Wedding",
    groom: "Aniketh Russel",
    bride: "Arunima David",
    date: "2024-10-12",
    image: coupleFallback
  }
];

const RecentSection = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(STATIC_ITEMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentPosts = async () => {
      try {
        // Firebase Fetching - Use 'posts' instead of 'recent_work'
        const firebaseData = await getFromDB('posts');
        if (firebaseData) {
          const postsArray = Array.isArray(firebaseData)
            ? firebaseData
            : Object.entries(firebaseData).map(([id, val]) => ({ id, ...val }));

          // Sort by date (descending) and take first 2
          const sorted = postsArray.sort((a, b) => new Date(b.date) - new Date(a.date));
          const recents = sorted.slice(0, 2).map(post => ({
            id: post.id,
            title: post.title,
            groom: post.groom,
            bride: post.bride,
            date: post.date,
            image: post.mainImage || coupleFallback
          }));

          setItems(recents.length > 0 ? recents : STATIC_ITEMS);
        } else {
          setItems(STATIC_ITEMS);
        }
      } catch (error) {
        console.error("Failed to load recent posts from Firebase:", error);
        setItems(STATIC_ITEMS);
      } finally {
        setLoading(false);
      }
    };

    loadRecentPosts();
  }, []);

  const handleBlogClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const handleKeyDown = (e, postId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleBlogClick(postId);
    }
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Loading recent captures...</div>;
  }

  return (
    <section className={styles.section}>
      <p className={styles.subTitle}>A Glimpse Into Our Signature Work</p>
      <h2 className={styles.title}>Recent Highlights</h2>

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
