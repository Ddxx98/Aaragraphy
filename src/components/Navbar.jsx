import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="p-4 bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Photography</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-600">Home</Link>
          <Link to="/blog" className="hover:text-gray-600">Blog</Link>
          <Link to="/about" className="hover:text-gray-600">About Us</Link>
          <Link to="/faq" className="hover:text-gray-600">FAQs</Link>
          <Link to="/contact" className="hover:text-gray-600">Contact Us</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
