import React, { useState } from 'react';
import Contact from '../../components/Contact/Contact';
import ServicePackage from '../../components/ServicePackage/ServicePackage';

const ContactUs = () => {
    const [selectedPackage, setSelectedPackage] = useState("");
    const [packageNames, setPackageNames] = useState([]);

    return (
        <div>
            <ServicePackage
                onSelectPackage={setSelectedPackage}
                onPackagesLoaded={setPackageNames}
            />
            <Contact
                selectedPackage={selectedPackage}
                packageNames={packageNames}
            />
        </div>
    );
};

export default ContactUs;
