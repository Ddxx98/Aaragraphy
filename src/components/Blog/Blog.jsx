import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Blog.module.css";
import ArrowDropdown from "../../assets/arrow_drop_down.svg";

const Blog = ({ posts = [] }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeView, setActiveView] = useState("Blog");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const categories = ["All", "Wedding", "Corporate", "Travel", "Baby Shower"];
  const views = ["Blog", "Gallery"];

  const filteredPosts = posts.filter((post) => {
    if (activeCategory === "All") return true;
    return post.category === activeCategory;
  });

  const handleBlogClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const handleKeyDown = (e, postId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleBlogClick(postId);
    }
  };

  const toggleCategoryDropdown = () => setIsCategoryOpen(!isCategoryOpen);
  const toggleViewDropdown = () => setIsViewOpen(!isViewOpen);

  const selectCategory = (cat) => {
    setActiveCategory(cat);
    setIsCategoryOpen(false);
  };

  const selectView = (view) => {
    setActiveView(view);
    setIsViewOpen(false);
  };

  return (
    <section className={styles.section}>
      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <span className={styles.filterText}>You’re viewing</span>

        {/* Desktop Categories */}
        <div className={styles.desktopCategories}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterButton} ${activeCategory === cat ? styles.activeFilter : ""
                }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mobile Category Dropdown */}
        <div className={styles.mobileDropdownWrapper}>
          <button
            className={styles.dropdownTrigger}
            onClick={toggleCategoryDropdown}
          >
            {activeCategory} <img src={ArrowDropdown} alt="Dropdown Arrow" className={styles.arrow} />
          </button>
          {isCategoryOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownHeader}>{activeCategory}</div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={styles.dropdownItem}
                  onClick={() => selectCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className={styles.filterText}>work in the</span>

        {/* Desktop Views */}
        <div className={styles.desktopViews}>
          {views.map((view) => (
            <button
              key={view}
              className={`${styles.filterButton} ${activeView === view ? styles.activeFilter : ""
                }`}
              onClick={() => setActiveView(view)}
            >
              {view}
            </button>
          ))}
        </div>

        {/* Mobile View Dropdown */}
        <div className={styles.mobileDropdownWrapper}>
          <button
            className={styles.dropdownTrigger}
            onClick={toggleViewDropdown}
          >
            {activeView} <img src={ArrowDropdown} alt="Dropdown Arrow" className={styles.arrow} />
          </button>
          {isViewOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownHeader}>{activeView}</div>
              {views.map((view) => (
                <button
                  key={view}
                  className={styles.dropdownItem}
                  onClick={() => selectView(view)}
                >
                  {view}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className={styles.card}
            onClick={() => handleBlogClick(post.id)}
            onKeyDown={(e) => handleKeyDown(e, post.id)}
            role="button"
            tabIndex={0}
            aria-label={`Read ${post.title}`}
          >
            <div className={styles.imageWrapper}>
              <img
                src={post.image}
                alt={post.title}
                className={styles.image}
              />
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardTitleRow}>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <span className={styles.arrow}>&rarr;</span>
              </div>

              <p className={styles.names}>
                {post.groom} <span className={styles.weds}>&</span> {post.bride}
              </p>

              <p className={styles.dateRow}>
                <span className={styles.dateLabel}>Date:</span>{" "}
                <span className={styles.dateValue}>{post.date}</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Blog;
