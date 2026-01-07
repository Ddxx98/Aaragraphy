import React, { useState } from "react";
import styles from "./Contact.module.css";

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        serviceType: "",
        eventType: "",
        fromDD: "",
        fromMM: "",
        fromYYYY: "",
        toDD: "",
        toMM: "",
        toYYYY: "",
        location: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // handle form submission
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>Contact here</h2>

                {/* Form Card */}
                <div className={styles.OverlayCard}>
                    <div className={styles.Formcard}>
                        <form className={styles.form} onSubmit={handleSubmit}>
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
                                />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Type of Event</label>
                                <select
                                    name="eventType"
                                    className={styles.select}
                                    value={formData.eventType}
                                    onChange={handleChange}
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
                                    />
                                    <input
                                        type="text"
                                        name="fromMM"
                                        placeholder="MM"
                                        maxLength="2"
                                        className={styles.dateSplitInput}
                                        value={formData.fromMM}
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="text"
                                        name="fromYYYY"
                                        placeholder="YYYY"
                                        maxLength="4"
                                        className={styles.dateSplitInputYear}
                                        value={formData.fromYYYY}
                                        onChange={handleChange}
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
                                    />
                                    <input
                                        type="text"
                                        name="toMM"
                                        placeholder="MM"
                                        maxLength="2"
                                        className={styles.dateSplitInput}
                                        value={formData.toMM}
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="text"
                                        name="toYYYY"
                                        placeholder="YYYY"
                                        maxLength="4"
                                        className={styles.dateSplitInputYear}
                                        value={formData.toYYYY}
                                        onChange={handleChange}
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
                                />
                            </div>

                            <button type="submit" className={styles.submitButton}>
                                SUBMIT
                            </button>
                        </form>
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
