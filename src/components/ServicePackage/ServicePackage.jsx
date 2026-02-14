import React, { useState, useEffect } from 'react';
import styles from './ServicePackage.module.css';
import { fetchFromWP, getACF, getImageUrl } from '../../utils/wpApi';
import { getFromDB } from '../../utils/fbApi';
import coupleFallback from '../../assets/couple.jpg';

const STATIC_PACKAGES = [
    {
        title: "The Signature experience",
        duration: "4.5 to 5 hours",
        ideal_for: "Full branding packages, special events, civil ceremony, wedding (half day), commercial clients.",
        image: coupleFallback,
        deliverables: [
            "120+ edited photos",
            "Multiple locations & outfit change",
            "All unedited proofs included",
            "Up to 10 edited photos within 48 hours for social media Priority editing (faster turnaround)",
            "USB with Raw and Edited photos for future storage delivered with photo prints as a complementary"
        ]
    },
    {
        title: "The Premium",
        duration: "3 to 3.5 hours",
        ideal_for: "Business branding, model portfolios, family events, engagement sessions, couple shoots.",
        image: coupleFallback,
        deliverables: [
            "80+ edited photos",
            "Multiple locations & outfit change",
            "All unedited proofs included",
            "Up to 10 edited photos within 48 hours for social media Priority editing (faster turnaround)",
            "USB with Raw and Edited photos for future storage delivered with photo prints as a complementary"
        ]
    },
    {
        title: "The Classic",
        duration: "2 hours",
        ideal_for: "Families, branding sessions, couple shoots, Cafes.",
        image: coupleFallback,
        deliverables: [
            "50 edited photos",
            "Location & outfit of your choice",
            "All unedited proofs included",
            "Online gallery for download"
        ]
    },
    {
        title: "The essentials",
        duration: "2 hours",
        ideal_for: "Mini portrait sessions & small product shoots.",
        image: coupleFallback,
        deliverables: [
            "15 professionally edited photos",
            "1 hour shooting time"
        ]
    }
];

const STATIC_ADDONS = [
    "Extra edited photos: €5 each",
    "Extra hour shooting: €50",
    "Print packages: starting €40",
    "Priority editing (48-72 hours): €50–€80",
    "Videography: Additional 100 Euros on every package (Highlighted video edits 2 - 5 minutes)"
];

const ServicePackage = ({ onSelectPackage, onPackagesLoaded }) => {
    const [packages, setPackages] = useState(STATIC_PACKAGES);
    const [addons, setAddons] = useState(STATIC_ADDONS);
    const [notes, setNotes] = useState("Location outside Dublin, Meath, Kildare & Wicklow will include travel charge based on the location.");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadServiceData = async () => {
            try {
                // Firebase Fetching
                const firebaseData = await getFromDB('services');
                if (firebaseData) {
                    if (firebaseData.packages) {
                        setPackages(firebaseData.packages);
                        if (onPackagesLoaded) onPackagesLoaded(firebaseData.packages.map(p => p.title));
                    }
                    if (firebaseData.addons && firebaseData.addons.some(a => a.trim() !== "")) {
                        setAddons(firebaseData.addons);
                    } else {
                        setAddons(STATIC_ADDONS);
                    }

                    if (firebaseData.notes && firebaseData.notes.trim() !== "") {
                        setNotes(firebaseData.notes);
                    } else {
                        setNotes("Location outside Dublin, Meath, Kildare & Wicklow will include travel charge based on the location.");
                    }
                } else if (onPackagesLoaded) {
                    onPackagesLoaded(STATIC_PACKAGES.map(p => p.title));
                }

                /* Commented out WordPress Dynamic Fetching
                const pages = await fetchFromWP('/pages', { slug: 'services' });
                if (pages && pages.length > 0) {
                    const acf = getACF(pages[0]);

                    if (acf.service_packages) {
                        const formattedPackages = acf.service_packages.map(pkg => ({
                            title: pkg.title || pkg.package_title,
                            duration: pkg.duration || pkg.package_duration,
                            ideal_for: pkg.ideal_for || pkg.package_ideal_for,
                            image: getImageUrl(pkg.image || pkg.package_image, coupleFallback),
                            deliverables: (pkg.deliverables || pkg.package_deliverables || "").split('\n').filter(line => line.trim() !== "")
                        }));
                        setPackages(formattedPackages);
                        if (onPackagesLoaded) onPackagesLoaded(formattedPackages.map(p => p.title));
                    }

                    if (acf.optional_addons) {
                        setAddons(acf.optional_addons.split('\n').filter(line => line.trim() !== ""));
                    }

                    if (acf.package_notes) {
                        setNotes(acf.package_notes);
                    }
                }
                */
            } catch (error) {
                console.error("Failed to load service packages from Firebase, using fallbacks:", error);
                if (onPackagesLoaded) onPackagesLoaded(STATIC_PACKAGES.map(p => p.title));
            } finally {
                setLoading(false);
            }
        };

        loadServiceData();
    }, [onPackagesLoaded]);

    const handleSelect = (e, title) => {
        if (onSelectPackage) {
            e.preventDefault();
            onSelectPackage(title);
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <section className={styles.section} id="pricing">
            <h2 className={styles.mainTitle}>Service Packages</h2>

            <div className={styles.packagesContainer}>
                {packages.map((pkg, index) => (
                    <div key={index} className={styles.packageItem}>
                        <div className={styles.infoCol}>
                            <h3 className={styles.packageTitle}>{pkg.title}</h3>
                            <p className={styles.duration}>Duration : {pkg.duration}</p>
                            <div className={styles.idealFor}>
                                <h4 className={styles.subLabel}>Ideal for :</h4>
                                <p className={styles.idealText}>{pkg.ideal_for}</p>
                            </div>
                        </div>

                        <div className={styles.imageCol}>
                            <div className={styles.imageWrapper}>
                                <img src={pkg.image} alt={pkg.title} className={styles.packageImage} />
                            </div>
                        </div>

                        <div className={styles.deliverablesCol}>
                            <h4 className={styles.subLabel}>Deliverables:</h4>
                            <ul className={styles.deliverablesList}>
                                {pkg.deliverables.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                            <a
                                href="#contact"
                                className={styles.contactLink}
                                onClick={(e) => handleSelect(e, pkg.title)}
                            >
                                Contact for this
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.addonsSection}>
                <h3 className={styles.addonsTitle}>The optional add ons</h3>
                <ul className={styles.addonsList}>
                    {addons.map((addon, index) => (
                        <li key={index}>{addon}</li>
                    ))}
                </ul>
            </div>

            <div className={styles.notesSection}>
                <p className={styles.noteLabel}>Note:</p>
                <p className={styles.noteText}>{notes}</p>
                <p className={styles.greetingText}>Please contact me in case any clarification on the above collection. Looking forward to create memories :)</p>
            </div>
        </section>
    );
};

export default ServicePackage;
