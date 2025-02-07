import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'business' | 'product';
  url?: string;
  article?: {
    publishedTime: string;
    modifiedTime: string;
    author: string;
    section: string;
    tags: string[];
  };
  business?: {
    name: string;
    description: string;
    image: string;
    address: {
      city: string;
      state: string;
    };
    rating?: number;
    reviewCount?: number;
  };
}

const SEO = ({ 
  title, 
  description, 
  image = 'https://hiiqznjqvlirpptknglm.supabase.co/storage/v1/object/public/Cities//Detroit-josh-garcia-iqa83PdCO1A-unsplash.jpg',
  type = 'website',
  url = typeof window !== 'undefined' ? window.location.href : '',
  article,
  business
}: SEOProps) => {
  const siteName = 'VeriLocal';
  const fullTitle = `${title} | ${siteName}`;

  // Generate structured data
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
    };

    switch (type) {
      case 'article':
        return {
          ...baseData,
          '@type': 'Article',
          headline: title,
          description,
          image,
          datePublished: article?.publishedTime,
          dateModified: article?.modifiedTime,
          author: {
            '@type': 'Person',
            name: article?.author
          },
          publisher: {
            '@type': 'Organization',
            name: siteName,
            logo: {
              '@type': 'ImageObject',
              url: 'https://verilocal.pro/logo.png'
            }
          }
        };
      case 'business':
        return {
          ...baseData,
          '@type': 'LocalBusiness',
          name: business?.name,
          description: business?.description,
          image: business?.image,
          address: {
            '@type': 'PostalAddress',
            addressLocality: business?.address.city,
            addressRegion: business?.address.state,
            addressCountry: 'US'
          },
          aggregateRating: business?.rating ? {
            '@type': 'AggregateRating',
            ratingValue: business.rating,
            reviewCount: business.reviewCount
          } : undefined
        };
      default:
        return {
          ...baseData,
          '@type': 'WebSite',
          name: siteName,
          url
        };
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="image" content={image} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article Meta Tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:author" content={article.author} />
          <meta property="article:section" content={article.section} />
          {article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>
    </Helmet>
  );
};

export default SEO;