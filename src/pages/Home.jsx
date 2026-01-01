import React from "react";
import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import Service from "../components/Service/Service";
import RecentSection from "../components/RecentSection/RecentSection";
import ReviewSection from "../components/ReviewSection/ReviewSection";
import Gallery from "../components/Gallery/Gallery";
import Section from "../components/Section/Section";

const Home = () => {
    return (
        <div>
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
                <ReviewSection />
            </div>
            <div id="gallery">
                <Gallery />
            </div>
            <div id="about">
                <Section />
            </div>
        </div>
    );
};

export default Home;
