import React from "react";
import Hero from "../components/Hero/Hero";
import Service from "../components/Service/Service";
import RecentSection from "../components/RecentSection/RecentSection";
import ReviewSection from "../components/ReviewSection/ReviewSection";
import Gallery from "../components/Gallery/Gallery";
import Section from "../components/Section/Section";
import Instagram from "../components/Instagram/Instagram";

const Home = () => {
    return (
        <div className="homePageContainer">
            <div id="explore">
                <Hero />
            </div>
            <div id="services">
                <Service />
            </div>
            <div id="work">
                <RecentSection />
            </div>
            <div id="reviews">
                <ReviewSection limited={true} />
            </div>
            <div id="gallery">
                <Gallery viewAll={true} limited={true} />
            </div>
            <div id="instagram">
                <Instagram />
            </div>
            <div id="about">
                <Section />
            </div>
        </div>
    );
};

export default Home;
