import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import BelowFooter from './BelowFooter/BelowFooter';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <BelowFooter />
        </div>
    );
};

export default Layout;
