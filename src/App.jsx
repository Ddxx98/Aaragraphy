import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Blog from './pages/Blogs/Blogs';
import BlogDetails from './components/BlogDetails/BlogDetails';
import AboutUs from './pages/AboutUs/AboutUs';
import ContactUs from './pages/ContactUs/ContactUs';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import Faq from './pages/Faq/Faq';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './utils/ScrollToTop';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogDetails />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="faq" element={<Faq />} />
            <Route path="contact" element={<ContactUs />} />
          </Route>

          {/* Admin Routes */}
          <Route path="admin/login" element={<Login />} />
          <Route path="admin" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
