import React, { useState, useEffect } from "react";
import emailjs from '@emailjs/browser';
import styles from "./Contact.module.css";
import { getFromDB } from '../../utils/fbApi';

const ContactSection = ({ selectedPackage, packageNames = [] }) => {
    const [eventTypes, setEventTypes] = useState([
        { id: "wedding", label: "Wedding" },
        { id: "engagement", label: "Engagement" },
        { id: "corporate", label: "Corporate Events" },
        { id: "baby", label: "Baby Shower" }
    ]);

    const [dynamicPackages, setDynamicPackages] = useState(packageNames);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        servicePackage: "",
        fromDD: "",
        fromMM: "",
        fromYYYY: "",
        location: "",
        message: "",
    });

    const [status, setStatus] = useState("idle"); // idle, submitting, success, error
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch dynamic event types and service packages from Firebase
    useEffect(() => {
        const loadFormData = async () => {
            try {
                // Load Event Types
                const eventData = await getFromDB('serviceList');
                if (eventData) {
                    const normalized = Array.isArray(eventData)
                        ? eventData
                        : Object.entries(eventData).map(([id, val]) => ({ ...val, id: val.id || id }));

                    const types = normalized.map(s => ({
                        id: s.service_id || s.id,
                        label: s.label
                    }));
                    setEventTypes(types);
                }

                // Load Service Packages
                const packageData = await getFromDB('services');
                if (packageData && packageData.packages) {
                    const titles = packageData.packages.map(p => p.title).filter(title => title);
                    setDynamicPackages(titles);
                }
            } catch (error) {
                console.error("Failed to load dynamic fields for contact form:", error);
            }
        };
        loadFormData();
    }, []);

    // Update form when selectedPackage prop changes
    useEffect(() => {
        if (selectedPackage) {
            setFormData(prev => ({
                ...prev,
                servicePackage: selectedPackage
            }));
        }
    }, [selectedPackage]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("submitting");
        setErrorMessage("");

        try {
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            // Map formData to template parameters
            const templateParams = {
                name: formData.name,       // Matches {{name}} in your template
                email: formData.email,     // Matches {{email}} in your template
                message: formData.message, // Matches {{message}} in your template
                title: `Inquiry: ${formData.eventType || 'General'}`, // Matches {{title}} in your subject
                phone: formData.phone,
                event_type: formData.eventType,
                service_package: formData.servicePackage,
                event_date: `${formData.fromDD}/${formData.fromMM}/${formData.fromYYYY}`,
                location: formData.location,
            };

            const response = await emailjs.send(
                serviceId,
                templateId,
                templateParams,
                publicKey
            );

            if (response.status === 200) {
                setStatus("success");
                setFormData({
                    name: "", email: "", phone: "", eventType: "", servicePackage: "",
                    fromDD: "", fromMM: "", fromYYYY: "",
                    location: "", message: ""
                });
            } else {
                throw new Error("Failed to send message. Please try again later.");
            }
        } catch (error) {
            console.error("EmailJS submission error:", error);
            setStatus("error");
            setErrorMessage(error.text || error.message || "Failed to send message.");
        }
    };

    return (
        <section className={styles.section} id="contact">
            <div className={styles.container}>
                <h2 className={styles.title}>Contact here</h2>

                {/* Form Card */}
                <div className={styles.OverlayCard}>
                    <div className={styles.Formcard}>
                        {status === "success" ? (
                            <div className={styles.successMessage}>
                                <h3>Thank You!</h3>
                                <p>Your message has been sent successfully. We'll get back to you soon.</p>
                                <button
                                    onClick={() => setStatus("idle")}
                                    className={styles.submitButton}
                                    style={{ marginTop: '20px' }}
                                >
                                    SEND ANOTHER MESSAGE
                                </button>
                            </div>
                        ) : (
                            <form className={styles.form} onSubmit={handleSubmit}>
                                {status === "error" && (
                                    <div className={styles.errorMessage}>
                                        {errorMessage}
                                    </div>
                                )}

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        className={styles.input}
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        disabled={status === "submitting"}
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Ex: Email@gmail.com"
                                        className={styles.input}
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={status === "submitting"}
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Phone number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="+353 9999999999"
                                        className={styles.input}
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={status === "submitting"}
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Category</label>
                                    <select
                                        name="eventType"
                                        className={styles.select}
                                        value={formData.eventType}
                                        onChange={handleChange}
                                        disabled={status === "submitting"}
                                    >
                                        <option value="">Select</option>
                                        {eventTypes.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {type.label}
                                            </option>
                                        ))}
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Collection</label>
                                    <select
                                        name="servicePackage"
                                        className={styles.select}
                                        value={formData.servicePackage}
                                        onChange={handleChange}
                                        disabled={status === "submitting"}
                                    >
                                        <option value="">Select</option>
                                        {dynamicPackages.map((name, index) => (
                                            <option key={index} value={name}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date Section - From */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Date</label>
                                    <div className={styles.dateSplitRow}>
                                        <select
                                            name="fromDD"
                                            className={styles.dateSelect}
                                            value={formData.fromDD}
                                            onChange={handleChange}
                                            disabled={status === "submitting"}
                                        >
                                            <option value="">DD</option>
                                            {Array.from({ length: 31 }, (_, i) => (
                                                <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                                    {String(i + 1).padStart(2, '0')}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            name="fromMM"
                                            className={styles.dateSelectMonth}
                                            value={formData.fromMM}
                                            onChange={handleChange}
                                            disabled={status === "submitting"}
                                        >
                                            <option value="">Month</option>
                                            {[
                                                "January", "February", "March", "April", "May", "June",
                                                "July", "August", "September", "October", "November", "December"
                                            ].map((month, index) => (
                                                <option key={index} value={month}>
                                                    {month}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            name="fromYYYY"
                                            className={styles.dateSelectYear}
                                            value={formData.fromYYYY}
                                            onChange={handleChange}
                                            disabled={status === "submitting"}
                                        >
                                            <option value="">YYYY</option>
                                            {Array.from({ length: 6 }, (_, i) => {
                                                const year = new Date().getFullYear() + i;
                                                return (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Location (Within Ireland)</label>
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="Location"
                                        className={styles.input}
                                        value={formData.location}
                                        onChange={handleChange}
                                        disabled={status === "submitting"}
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>What’s on your mind?</label>
                                    <textarea
                                        name="message"
                                        placeholder="Tell me more"
                                        className={styles.textarea}
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        disabled={status === "submitting"}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={status === "submitting"}
                                >
                                    {status === "submitting" ? "SENDING..." : "SUBMIT"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Email Info Card - Separate Section */}
                <div className={styles.Emailcard}>
                    <div className={styles.emailInfo}>
                        <h3>Questions? We’re always listening!</h3>
                        <a
                            href="mailto:aaragraphy@gmail.com"
                            className={styles.emailAddress}
                            aria-label="Send an email to aaragraphy@gmail.com"
                        >
                            aaragraphy@gmail.com
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
