import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import menu from "../../assets/menu.svg";
import close from "../../assets/close.svg";


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const getLinkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.activeLink}` : styles.link;

  const getMobileLinkClass = ({ isActive }) =>
    isActive ? `${styles.linkMobile} ${styles.activeLinkMobile}` : styles.linkMobile;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.logo}>
          Aaragraphy
        </NavLink>

        {/* Desktop nav */}
        <nav className={styles.navDesktop}>
          <NavLink to="/" className={getLinkClass}>
            Explore
          </NavLink>
          <NavLink to="/about" className={getLinkClass}>
            About
          </NavLink>
          <NavLink to="/blog" className={getLinkClass}>
            Portfolio
          </NavLink>
          <NavLink to="/faq" className={getLinkClass}>
            FAQs
          </NavLink>
          <NavLink to="/contact" className={getLinkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Mobile hamburger */}
        <button
          className={`${styles.menuButton} ${isOpen ? styles.menuButtonOpen : ""}`}
          onClick={handleToggle}
          aria-label="Toggle navigation"
        >
          <img src={menu} className={styles.menuIcon} alt="Menu" />
        </button>
      </div>

      {/* Mobile full-screen menu */}
      <div
        className={`${styles.mobileOverlay} ${isOpen ? styles.mobileOverlayOpen : ""}`}
      >
        <div className={styles.overlayHeader}>
          <div className={styles.logoOverlay}>Aaragraphy</div>
          <button
            className={`${styles.menuButton} ${styles.menuButtonOverlay} ${isOpen ? styles.menuButtonOpen : ""}`}
            onClick={handleToggle}
            aria-label="Close navigation"
          >
            <img src={close} className={styles.menuIcon} alt="Close" />
          </button>
        </div>

        <nav className={styles.navMobile}>
          <NavLink
            to="/"
            className={getMobileLinkClass}
            onClick={handleToggle}
          >
            Explore
          </NavLink>
          <NavLink
            to="/blog"
            className={getMobileLinkClass}
            onClick={handleToggle}
          >
            Portfolio
          </NavLink>
          <NavLink
            to="/about"
            className={getMobileLinkClass}
            onClick={handleToggle}
          >
            About
          </NavLink>
          <NavLink
            to="/faq"
            className={getMobileLinkClass}
            onClick={handleToggle}
          >
            FAQs
          </NavLink>
          <NavLink
            to="/contact"
            className={getMobileLinkClass}
            onClick={handleToggle}
          >
            Contact
          </NavLink>
        </nav>

        <div className={styles.socialsBlock}>
          <div className={styles.socialsTitle}>Socials</div>
          <a href="https://www.instagram.com/aaragraphy.ie" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            Instagram
          </a>
          <a href="https://pin.it/O6Y3O4Pqh" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            Pinterest
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
