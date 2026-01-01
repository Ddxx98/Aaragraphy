import React from "react";
import styles from "./BelowFooter.module.css";

const BelowFooter = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <span className={styles.word}>Love</span>
        <span className={styles.word}>Life</span>
        <span className={styles.word}>Laugh</span>
      </div>
    </div>
  );
};

export default BelowFooter;
