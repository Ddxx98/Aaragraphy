import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Service.module.css";
import weddingImg from "../../assets/service/wedding.jpg";
import ceremoniesImg from "../../assets/service/ceremonies.jpg";
import corporateImg from "../../assets/service/corporate.jpg";
import travelImg from "../../assets/service/travel.jpg";
import casualImg from "../../assets/service/casual.jpg";
import babyImg from "../../assets/service/baby.jpg";

const services = [
    { id: "wedding", label: "Wedding", image: weddingImg },
    { id: "ceremonies", label: "Ceremonies", image: ceremoniesImg },
    { id: "corporate", label: "Corporate Events", image: corporateImg },
    { id: "travel", label: "Travel", image: travelImg },
    { id: "casual", label: "Casual Shoot", image: casualImg },
    { id: "baby", label: "Baby Shoot", image: babyImg },
];

const Service = () => {
    const navigate = useNavigate();
    const [activeId, setActiveId] = useState("wedding");
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(hover: none)");
        setIsTouch(mq.matches);
        const handler = (e) => setIsTouch(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    const handleClick = (id) => {
        if (!isTouch) return;
        if (id === "other") return;
        setActiveId((prev) => (prev === id ? "" : id));
    };

    const handleEnter = (id) => {
        if (isTouch) return;
        if (id === "other") return;
        setActiveId(id);
    };

    return (
        <section className={styles.section}>
            <p className={styles.subTitle}>What services we offer?</p>
            <h2 className={styles.title}>We Capture these for you</h2>

            <div className={styles.servicesList}>
                {services.map((service) => (
                    <div
                        key={service.id}
                        className={`${styles.serviceItem} ${activeId === service.id ? styles.active : ""}`}
                        onClick={() => handleClick(service.id)}
                        onMouseEnter={() => handleEnter(service.id)}
                        style={
                            activeId === service.id
                                ? {
                                    backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${service.image})`,
                                }
                                : {}
                        }
                    >
                        <h3 className={styles.serviceLabel}>{service.label}</h3>
                        {activeId === service.id && (
                            <div className={styles.activeContent}>
                                <p className={styles.description}>
                                    Your life&apos;s most important decision on our lens
                                </p>
                                <button
                                    className={styles.contactBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate('/contact');
                                    }}
                                >
                                    CONTACT
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button
                className={styles.mainContactBtn}
                onClick={() => navigate('/contact')}
            >
                CONTACT
            </button>
        </section>
    );
};

export default Service;
