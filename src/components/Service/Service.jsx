import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ServiceImageFallback from "../../assets/service.jpg";
import styles from "./Service.module.css";
import { fetchFromWP, getImageUrl, getACF } from "../../utils/wpApi";

const services = [
    { id: "engagement", label: "Engagement shoots" },
    { id: "wedding", label: "Wedding" },
    { id: "corporate", label: "Corporate Events" },
    { id: "baby", label: "Baby Shower" },
    { id: "travel", label: "Travel" },
    { id: "other", label: "Other Things If Any" },
];

const Service = () => {
    const navigate = useNavigate();
    const [activeId, setActiveId] = useState("wedding");
    const [isTouch, setIsTouch] = useState(false);
    const [dynamicImages, setDynamicImages] = useState({});

    useEffect(() => {
        const loadServiceData = async () => {
            try {
                const pages = await fetchFromWP('/pages', { slug: 'home' });
                if (pages.length > 0) {
                    const acf = getACF(pages[0]);
                    setDynamicImages({
                        engagement: getImageUrl(acf.service_engagement_image, ServiceImageFallback),
                        wedding: getImageUrl(acf.service_wedding_image, ServiceImageFallback),
                        corporate: getImageUrl(acf.service_corporate_image, ServiceImageFallback),
                        baby: getImageUrl(acf.service_baby_image, ServiceImageFallback),
                        travel: getImageUrl(acf.service_travel_image, ServiceImageFallback),
                        other: getImageUrl(acf.service_other_image, ServiceImageFallback),
                        default: ServiceImageFallback
                    });
                }
            } catch (error) {
                console.error("Failed to load dynamic service images:", error);
                setDynamicImages({ default: ServiceImageFallback });
            }
        };

        loadServiceData();

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
                                    backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${dynamicImages[service.id] || dynamicImages.default || ServiceImageFallback})`,
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
