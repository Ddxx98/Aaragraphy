import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import BelowFooter from '../components/BelowFooter/BelowFooter';
import { AuthProvider } from '../context/AuthContext';
import '../index.css';

export const metadata = {
  title: 'Aaragraphy | Professional Photography Portfolio',
  description: 'Aaragraphy - Professional photography services specializing in weddings, engagements, corporate events, and nature. Capturing your most precious moments with a cinematic and emotional touch.',
  keywords: 'photography, wedding photographer, engagement shoots, corporate events, nature photography, Aaragraphy, Aarography, professional photographer, Ireland photography, Dublin photographer',
  authors: [{ name: 'Aaragraphy' }],
  creator: 'Aaragraphy',
  publisher: 'Aaragraphy',
  metadataBase: new URL('https://aaragraphy.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      {
        url: '/icon.png',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.ico',
    apple: [
      {
        url: '/apple-touch-icon.png',
        type: 'image/png',
      },
    ],
  },
  openGraph: {
    title: 'Aaragraphy | Professional Photography Portfolio',
    description: 'Aaragraphy (Aarography) - Professional photography services specializing in weddings, engagements, corporate events, and nature. Capturing your most precious moments with a cinematic and emotional touch.',
    url: 'https://aaragraphy.com',
    siteName: 'Aaragraphy',
    images: [
      {
        url: '/assets/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Aaragraphy Photography Portfolio',
      },
    ],
    locale: 'en_IE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aaragraphy | Professional Photography Portfolio',
    description: 'Aaragraphy (Aarography) - Professional photography services specializing in weddings, engagements, corporate events, and nature.',
    images: ['/assets/hero.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Aaragraphy",
              "url": "https://aarography.com",
              "logo": "https://aarography.com/assets/logo/logo4.png",
              "sameAs": [
                "https://www.instagram.com/aaragraphy.ie",
                "https://pin.it/O6Y3O4Pqh"
              ]
            })
          }}
        />
      </head>
      <body>
        <div id="__next" className="flex flex-col min-h-screen">
          <AuthProvider>
            <Header />
            <main
              className="flex-grow"
              style={{ paddingTop: 'var(--header-height)' }}
            >
              {children}
            </main>
            <Footer />
            <BelowFooter />
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
