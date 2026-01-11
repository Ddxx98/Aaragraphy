import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecentSection.module.css";
import coupleFallback from "../../assets/couple.jpg";

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
        // Fetch latest 2 posts with embedded media and ACF fields
        const data = await fetchFromWP('/posts', {
          per_page: 2,
          _embed: 1
        });

        if (data && data.length > 0) {
          const formattedItems = data.map(post => {
            const acf = getACF(post);
            return {
              id: post.id,
              title: post.title.rendered,
              groom: acf.groom_name || "Groom",
              bride: acf.bride_name || "Bride",
              date: acf.event_date || post.date.split('T')[0],
              image: getImageUrl(getFeaturedImage(post), STATIC_ITEMS[0].image)
            };
          });
          setItems(formattedItems);
        }
      } catch (error) {
        console.error("Failed to load recent posts:", error);
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
