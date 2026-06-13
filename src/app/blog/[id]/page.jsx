import React from 'react';
import BlogDetails from '../../../components/BlogDetails/BlogDetails';

export async function generateStaticParams() {
  return [
    { id: 'engagement' },
    { id: 'wedding' },
  ];
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const titleFormatted = id
    ? id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ')
    : 'Story';
  return {
    title: `${titleFormatted} | Aaragraphy Photography`,
    description: `Read the story and view the gallery of our ${titleFormatted} session captured by Aaragraphy.`,
  };
}

export default async function BlogDetailsPage({ params }) {
  const { id } = await params;
  return <BlogDetails id={id} />;
}
