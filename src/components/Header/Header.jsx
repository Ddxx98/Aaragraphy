"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import menu from "../../assets/menu.svg";
import close from "../../assets/close.svg";
import logo from "../../assets/logo/logo1.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleToggle = () => setIsOpen((prev) => !prev);

  const getLinkClass = (path) =>
    pathname === path ? `${styles.link} ${styles.activeLink}` : styles.link;

  const getMobileLinkClass = (path) =>
    pathname === path ? `${styles.linkMobile} ${styles.activeLinkMobile}` : styles.linkMobile;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <img src={logo.src} alt="Logo" />
        </Link>

        {/* Desktop nav */}
        <nav className={styles.navDesktop}>
          <Link href="/" className={getLinkClass("/")}>
            Explore
          </Link>
          <Link href="/about" className={getLinkClass("/about")}>
            About
          </Link>
          <Link href="/blog" className={getLinkClass("/blog")}>
            Portfolio
          </Link>
          <Link href="/faq" className={getLinkClass("/faq")}>
            FAQs
          </Link>
          <Link href="/contact" className={getLinkClass("/contact")}>
            Contact
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className={`${styles.menuButton} ${isOpen ? styles.menuButtonOpen : ""}`}
          onClick={handleToggle}
          aria-label="Toggle navigation"
        >
          <img src={menu.src} className={styles.menuIcon} alt="Menu" />
        </button>
      </div>

      {/* Mobile full-screen menu */}
      <div
        className={`${styles.mobileOverlay} ${isOpen ? styles.mobileOverlayOpen : ""}`}
      >
        <div className={styles.overlayHeader}>
          <Link href="/" className={styles.logoOverlay} onClick={handleToggle}>
            <img src={logo.src} alt="Logo" />
          </Link>
          <button
            className={`${styles.menuButton} ${styles.menuButtonOverlay} ${isOpen ? styles.menuButtonOpen : ""}`}
            onClick={handleToggle}
            aria-label="Close navigation"
          >
            <img src={close.src} className={styles.menuIcon} alt="Close" />
          </button>
        </div>

        <nav className={styles.navMobile}>
          <Link
            href="/"
            className={getMobileLinkClass("/")}
            onClick={handleToggle}
          >
            Explore
          </Link>
          <Link
            href="/blog"
            className={getMobileLinkClass("/blog")}
            onClick={handleToggle}
          >
            Portfolio
          </Link>
          <Link
            href="/about"
            className={getMobileLinkClass("/about")}
            onClick={handleToggle}
          >
            About
          </Link>
          <Link
            href="/faq"
            className={getMobileLinkClass("/faq")}
            onClick={handleToggle}
          >
            FAQs
          </Link>
          <Link
            href="/contact"
            className={getMobileLinkClass("/contact")}
            onClick={handleToggle}
          >
            Contact
          </Link>
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
