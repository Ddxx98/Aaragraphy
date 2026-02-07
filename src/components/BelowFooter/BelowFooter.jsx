import React from "react";
import styles from "./BelowFooter.module.css";

const BelowFooter = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <span className={styles.word}>Create</span>
        <span className={styles.word}>Capture</span>
        <span className={styles.word}>Cherish</span>
      </div>
    </div>
  );
};

export default BelowFooter;
