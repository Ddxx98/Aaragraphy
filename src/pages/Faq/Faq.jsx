import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import styles from "./Faq.module.css";
import { getFromDB } from "../../utils/fbApi";

const STATIC_FAQS = [
    {
        id: "static-1",
        question: "What is Aaragraphy?",
        answer: "Aaragraphy is a boutique photography studio specializing in capturing the essence of life's most meaningful moments, from intimate weddings to high-profile corporate events."
    },
    {
        id: "static-2",
        question: "How do I book a session?",
        answer: "You can book a session by navigating to our Contact page and filling out the inquiry form. We'll get back to you within 24-48 hours to discuss your vision and availability."
    },
    {
        id: "static-3",
        question: "What is the typical turnaround time for photos?",
        answer: "For portrait sessions, you can expect your gallery within 2 weeks. For weddings and larger events, the standard turnaround is 4-6 weeks, with a 'sneak peek' delivered within a few days."
    },
    {
        id: "static-4",
        question: "Do you travel for shoots?",
        answer: "Yes! While we are based in Dublin, we love traveling for destination weddings and unique projects. Travel fees may apply depending on the location."
    }
];

const Faq = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState(null);

    useEffect(() => {
        const loadFaqs = async () => {
            try {
                const data = await getFromDB('faq');
                if (data && ((Array.isArray(data) && data.length > 0) || (typeof data === 'object' && Object.keys(data).length > 0))) {
                    const normalized = (Array.isArray(data)
                        ? data
                        : Object.entries(data).map(([id, val]) => ({ ...val, id: val.id || id }))
                    );
                    setFaqs(normalized);
                } else {
                    setFaqs(STATIC_FAQS);
                }
            } catch (error) {
                console.error("Failed to load FAQs:", error);
                setFaqs(STATIC_FAQS);
            } finally {
                setLoading(false);
            }
        };
        loadFaqs();
    }, []);

    const toggleAccordion = (id) => {
        setOpenId(openId === id ? null : id);
    };

    const onContactClick = () => {
        window.location.href = "/contact";
    }

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p>Loading FAQs...</p>
            </div>
        );
    }

    return (
        <section className={styles.section}>
            <div className={styles.pageContainer}>
                <h2 className={styles.title}>FAQ's</h2>

                <div className={styles.accordionContainer}>
                    {faqs.length > 0 ? (
                        faqs.map((faq) => (
                            <div
                                key={faq.id}
                                className={`${styles.faqItem} ${openId === faq.id ? styles.open : ""}`}
                                onClick={() => toggleAccordion(faq.id)}
                            >
                                <div className={styles.questionRow}>
                                    <h3 className={styles.question}>{faq.question}</h3>
                                    <div className={styles.iconWrapper}>
                                        {openId === faq.id ? <X size={20} /> : <Plus size={20} />}
                                    </div>
                                </div>

                                <div className={`${styles.answerWrapper} ${openId === faq.id ? styles.answerOpen : ""}`}>
                                    <div className={styles.divider}></div>
                                    <p className={styles.answer}>{faq.answer}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className={styles.noFaqs}>No FAQs available at the moment.</p>
                    )}
                </div>

                {/* Integrated CTA */}
                <div className={styles.ctaWrapper}>
                    <h3 className={styles.ctaTitle}>
                        Let's start the <br></br> Conversation
                    </h3>
                    <button
                        className={styles.ctaButton}
                        onClick={onContactClick}
                    >
                        CONTACT
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Faq;
