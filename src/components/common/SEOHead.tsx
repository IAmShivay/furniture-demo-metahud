'use client';

import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
  noIndex?: boolean;
}








const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'LuxeHouse - Premium Furniture & Home Decor Brand',
  description = 'Transform your home with LuxeHouse\'s curated collection of luxury furniture. Modern design meets exceptional craftsmanship.',
  keywords = 'luxury furniture, premium home decor, modern furniture, scandinavian design, furniture brand',
  image = 'https://luxehouse.in/og-image.jpg',
  url = 'https://luxehouse.in',
  type = 'website',
  structuredData,
  noIndex = false,
}) => {
  return (
    <>
      <title>{title}</title>
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {}
      <link rel="canonical" href={url} />

      {}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </>
  );
};

export default SEOHead;
