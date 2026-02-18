import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Service.module.css";
import { getFromDB } from "../../utils/fbApi";

// Static Fallbacks
import weddingImg from "../../assets/service/wedding.jpg";
import ceremoniesImg from "../../assets/service/ceremonies.jpg";
import corporateImg from "../../assets/service/corporate.jpg";
import travelImg from "../../assets/service/travel.jpg";
import casualImg from "../../assets/service/casual.jpg";
import babyImg from "../../assets/service/baby.jpg";

const STATIC_SERVICES = [
    { id: "wedding", label: "Wedding", image: weddingImg, description: "Your life's most important decision on our lens" },
    { id: "ceremonies", label: "Ceremonies", image: ceremoniesImg, description: "Your life's most important decision on our lens" },
    { id: "corporate", label: "Corporate Events", image: corporateImg, description: "Your life's most important decision on our lens" },
    { id: "travel", label: "Travel", image: travelImg, description: "Your life's most important decision on our lens" },
    { id: "casual", label: "Casual Shoot", image: casualImg, description: "Your life's most important decision on our lens" },
    { id: "baby", label: "Baby Shoot", image: babyImg, description: "Your life's most important decision on our lens" },
];

const Service = () => {
    const navigate = useNavigate();
    const [activeId, setActiveId] = useState("wedding");
    const [isTouch, setIsTouch] = useState(false);
    const [services, setServices] = useState(STATIC_SERVICES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const firebaseData = await getFromDB('serviceList');
                if (firebaseData) {
                    const normalized = (Array.isArray(firebaseData)
                        ? firebaseData
                        : Object.entries(firebaseData).map(([id, val]) => ({ ...val, id: val.id || id }))
                    ).map(s => ({
                        ...s,
                        id: s.service_id || s.id, // Support both slug and timestamp ID
                        description: s.description || "Your life's most important decision on our lens"
                    }));
                    setServices(normalized);
                }
            } catch (error) {
                console.error("Failed to load services from Firebase:", error);
            } finally {
                setLoading(false);
            }
        };

        loadServices();

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
            <p className={styles.subTitle}>Ready to plan your Big Day?</p>
            <h2 className={styles.title}>Let’s connect and create something amazing together!</h2>

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
                                    {service.description}
                                </p>
                                <button
                                    className={styles.contactBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate('/contact');
                                    }}
                                >
                                    Let's Go
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button
                className={styles.mainContactBtn}
                onClick={() => navigate('/faq')}
            >
                FAQ
            </button>
        </section>
    );
};

export default Service;
