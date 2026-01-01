import React from "react";
import styles from "./Section.module.css";

import AboutPhotographer from "../AboutPhotographer/AboutPhotographer";
import CapturedHero from "../CaptureHero/CapturedHero";
import Quote from "../Quote/Quote";

const Section = () => {
    return (
        <div>
            <AboutPhotographer />
            <div className={styles.container}>
                <CapturedHero />
            </div>
            <Quote />
        </div>
    );
};

export default Section;
