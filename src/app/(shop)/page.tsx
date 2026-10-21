'use client';

import HeroSection from '@/components/sections/HeroSection';
import CollectionsSection from '@/components/sections/CollectionsSection';
import ProductShowcase from '@/components/sections/ProductShowcase';
import VideoSection from '@/components/sections/VideoSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import NewsletterSection from '@/components/sections/NewsletterSection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CollectionsSection />
      <ProductShowcase />
      <VideoSection />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
