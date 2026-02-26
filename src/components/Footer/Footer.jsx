import React, { useState, useEffect } from "react";
import styles from "./Footer.module.css";
import CameraIcon from "../../assets/camera.png";
import { ArrowUpRight } from "lucide-react";
import { getFromDB } from "../../utils/fbApi";

const Footer = () => {
    const [year, setYear] = useState("2025");

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const settings = await getFromDB('settings');
                if (settings && settings.copyrightYear) {
                    setYear(settings.copyrightYear);
                }
            } catch (error) {
                console.error("Failed to load footer settings:", error);
            }
        };
        loadSettings();
    }, []);

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.topRow}>
                    <div className={styles.leftCol}>
                        <h3 className={styles.tagline}>Explore, Engage, Connect</h3>
                        <div className={styles.socialLinks}>
                            <a href="https://www.instagram.com/aaragraphy.ie" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                Instagram <ArrowUpRight size={18} className={styles.arrow} />
                            </a>
                            <a href="https://pin.it/O6Y3O4Pqh" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                Pinterest <ArrowUpRight size={18} className={styles.arrow} />
                            </a>
                        </div>
                    </div>
                    <div className={styles.rightCol}>
                        <img src={CameraIcon} alt="Aarography" className={styles.cameraIcon} />
                    </div>
                </div>

                <div className={styles.bottomRow}>
                    <p className={styles.copyright}>
                        All Images, videos and content is copyrighted @Aaragraphy C {year}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
