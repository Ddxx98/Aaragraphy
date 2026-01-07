import React from 'react';
import Blog from '../../components/Blog/Blog';
import Gallery from '../../components/Gallery/Gallery';
import ReviewSection from '../../components/ReviewSection/ReviewSection';

const Blogs = () => {
    const blogPosts = [
        {
            id: 1,
            image: "../src/assets/couple.jpg",
            title: "Memoir of Nature",
            groom: "Aniketh Russel",
            bride: "Arunima David",
            date: "14-10-2025",
            category: "Wedding"
        },
        {
            id: 2,
            image: "../src/assets/couple.jpg",
            title: "Memoir of Nature",
            groom: "Aniketh Russel",
            bride: "Arunima David",
            date: "14-10-2025",
            category: "Corporate"
        },
        {
            id: 3,
            image: "../src/assets/couple.jpg",
            title: "Memoir of Nature",
            groom: "Aniketh Russel",
            bride: "Arunima David",
            date: "14-10-2025",
            category: "Travel"
        },
        {
            id: 4,
            image: "../src/assets/couple.jpg",
            title: "Memoir of Nature",
            groom: "Aniketh Russel",
            bride: "Arunima David",
            date: "14-10-2025",
            category: "Baby Shower"
        },
        {
            id: 5,
            image: "../src/assets/couple.jpg",
            title: "Memoir of Nature",
            groom: "Aniketh Russel",
            bride: "Arunima David",
            date: "14-10-2025",
            category: "Wedding"
        },
        {
            id: 6,
            image: "../src/assets/couple.jpg",
            title: "Memoir of Nature",
            groom: "Aniketh Russel",
            bride: "Arunima David",
            date: "14-10-2025",
            category: "Travel"
        }
    ];
    return (
        <div>
            <Blog posts={blogPosts} />
            <Gallery viewAll={false} />
            <ReviewSection />
        </div>
    );
};

export default Blogs;
