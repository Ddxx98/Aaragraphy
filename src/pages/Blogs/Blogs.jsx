import React from 'react';
import Blog from '../../components/Blog/Blog';
import Gallery from '../../components/Gallery/Gallery';
import ReviewSection from '../../components/ReviewSection/ReviewSection';

const Blogs = () => {
    const blogPosts = [
        {
            id: 1,
            image: "/images/blog-1.jpg",
            title: "Memoir of Nature",
            author: "Aniketh Russel & Arunima David",
            date: "14-10-2025",
            category: "Wedding"
        },
        {
            id: 2,
            image: "/images/blog-2.jpg",
            title: "Memoir of Nature",
            author: "Aniketh Russel & Arunima David",
            date: "14-10-2025",
            category: "Corporate"
        },
        {
            id: 3,
            image: "/images/blog-3.jpg",
            title: "Memoir of Nature",
            author: "Aniketh Russel & Arunima David",
            date: "14-10-2025",
            category: "Travel"
        },
        {
            id: 4,
            image: "/images/blog-4.jpg",
            title: "Memoir of Nature",
            author: "Aniketh Russel & Arunima David",
            date: "14-10-2025",
            category: "Baby Shower"
        },
        {
            id: 5,
            image: "/images/blog-5.jpg",
            title: "Memoir of Nature",
            author: "Aniketh Russel & Arunima David",
            date: "14-10-2025",
            category: "Wedding"
        },
        {
            id: 6,
            image: "/images/blog-6.jpg",
            title: "Memoir of Nature",
            author: "Aniketh Russel & Arunima David",
            date: "14-10-2025",
            category: "Travel"
        }
    ];
    return (
        <div>
            <Blog posts={blogPosts} />
            <Gallery />
            <ReviewSection />
        </div>
    );
};

export default Blogs;
