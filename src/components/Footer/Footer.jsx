import React from "react";
import styles from "./Footer.module.css";
import CameraIcon from "../../assets/camera.png"

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.topRow}>
                    <div className={styles.leftCol}>
                        <h3 className={styles.tagline}>Explore, Engage, Connect</h3>
                        <div className={styles.socialLinks}>
                            <a href="#" className={styles.socialLink}>Instagram</a>
                            <a href="#" className={styles.socialLink}>X (Prev Twitter)</a>
                            <a href="#" className={styles.socialLink}>Youtube</a>
                        </div>
                    </div>
                    <div className={styles.rightCol}>
                        <img src={CameraIcon} alt="Aarography" className={styles.cameraIcon} />
                    </div>
                </div>

                <div className={styles.bottomRow}>
                    <p className={styles.copyright}>
                        All Images, videos and content is copyrighted @Aarography C 2025
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
