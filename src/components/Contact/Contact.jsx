import React, { useState } from "react";
import styles from "./Contact.module.css";

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        days: "",
        fromDD: "",
        fromMM: "",
        fromYYYY: "",
        toDD: "",
        toMM: "",
        toYYYY: "",
        location: "",
        message: "",
    });

    const [status, setStatus] = useState("idle"); // idle, submitting, success, error
    const [errorMessage, setErrorMessage] = useState("");

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
            const endpoint = import.meta.env.VITE_WP_CONTACT_FORM_ENDPOINT;

            // Create FormData for WP compatibility (e.g., Contact Form 7)
            const body = new FormData();
            Object.keys(formData).forEach(key => {
                body.append(key, formData[key]);
            });

            const response = await fetch(endpoint, {
                method: 'POST',
                body: body,
            });

            const result = await response.json();

            if (response.ok && (result.status === 'mail_sent' || !result.status)) {
                setStatus("success");
                setFormData({
                    name: "", email: "", phone: "", eventType: "", days: "",
                    fromDD: "", fromMM: "", fromYYYY: "", toDD: "", toMM: "", toYYYY: "",
                    location: "", message: ""
                });
            } else {
                throw new Error(result.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Form submission error:", error);
            setStatus("error");
            setErrorMessage(error.message);
        }
    };

    return (
        <section className={styles.section}>
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
                                    <label className={styles.label}>Your name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your name"
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
                                        placeholder="Ex: Emailemail@gmail.com"
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
                                        placeholder="+00 9999999999"
                                        className={styles.input}
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={status === "submitting"}
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Type of Event</label>
                                    <select
                                        name="eventType"
                                        className={styles.select}
                                        value={formData.eventType}
                                        onChange={handleChange}
                                        disabled={status === "submitting"}
                                    >
                                        <option value="">Select Here</option>
                                        <option value="wedding">Wedding</option>
                                        <option value="engagement">Engagement</option>
                                        <option value="corporate">Corporate Events</option>
                                        <option value="baby">Baby Shower</option>
                                    </select>
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>No. of Days to cover</label>
                                    <select
                                        name="days"
                                        className={styles.select}
                                        value={formData.days}
                                        onChange={handleChange}
                                        disabled={status === "submitting"}
                                    >
                                        <option value="">Select here</option>
                                        <option value="1">1 Day</option>
                                        <option value="2">2 Days</option>
                                        <option value="3">3 Days</option>
                                        <option value="multiple">Multiple Days</option>
                                    </select>
                                </div>

                                {/* Date Section - From */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>From</label>
                                    <div className={styles.dateSplitRow}>
                                        <input
                                            type="text"
                                            name="fromDD"
                                            placeholder="DD"
                                            maxLength="2"
                                            className={styles.dateSplitInput}
                                            value={formData.fromDD}
                                            onChange={handleChange}
                                            disabled={status === "submitting"}
                                        />
                                        <input
                                            type="text"
                                            name="fromMM"
                                            placeholder="MM"
                                            maxLength="2"
                                            className={styles.dateSplitInput}
                                            value={formData.fromMM}
                                            onChange={handleChange}
                                            disabled={status === "submitting"}
                                        />
                                        <input
                                            type="text"
                                            name="fromYYYY"
                                            placeholder="YYYY"
                                            maxLength="4"
                                            className={styles.dateSplitInputYear}
                                            value={formData.fromYYYY}
                                            onChange={handleChange}
                                            disabled={status === "submitting"}
                                        />
                                    </div>
                                </div>

                                {/* Date Section - To */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>To</label>
                                    <div className={styles.dateSplitRow}>
                                        <input
                                            type="text"
                                            name="toDD"
                                            placeholder="DD"
                                            maxLength="2"
                                            className={styles.dateSplitInput}
                                            value={formData.toDD}
                                            onChange={handleChange}
                                            disabled={status === "submitting"}
                                        />
                                        <input
                                            type="text"
                                            name="toMM"
                                            placeholder="MM"
                                            maxLength="2"
                                            className={styles.dateSplitInput}
                                            value={formData.toMM}
                                            onChange={handleChange}
                                            disabled={status === "submitting"}
                                        />
                                        <input
                                            type="text"
                                            name="toYYYY"
                                            placeholder="YYYY"
                                            maxLength="4"
                                            className={styles.dateSplitInputYear}
                                            value={formData.toYYYY}
                                            onChange={handleChange}
                                            disabled={status === "submitting"}
                                        />
                                    </div>
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Location (only within Netherlands)</label>
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="Write here"
                                        className={styles.input}
                                        value={formData.location}
                                        onChange={handleChange}
                                        disabled={status === "submitting"}
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Anything Else to say</label>
                                    <textarea
                                        name="message"
                                        placeholder="Write here"
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
                        <h3>Have something urgent?</h3>
                        <p className={styles.emailAddress}>Emailemail@Email.com</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
