'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Phone } from 'lucide-react';
import { useGetFeaturedProductsQuery } from '../../store/api/productsApi';

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { data } = useGetFeaturedProductsQuery();

  const slides = useMemo(() => {
    const products = data?.data?.items || [];
    if (products.length === 0) return [];
    return products.slice(0, 4).map((p: any) => ({
      id: p.id || p._id,
      image: p.images?.[0]?.replace('w=600', 'w=1920') || '',
      title: p.name,
      subtitle: p.description,
      cta: p.onSale ? `Now ₹${p.basePrice.toLocaleString('en-IN')}` : 'View Details',
      ctaLink: `/product/${p.id || p._id}`,
    }));
  }, [data]);

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    pauseAutoPlay();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    pauseAutoPlay();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    pauseAutoPlay();
  };

  if (slides.length === 0) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black" style={{ height: 'calc(100vh - 80px)' }}>
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-6 px-6">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white">
              <span className="block">Luxury Furniture</span>
              <span className="block bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">Redefined</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">Handcrafted premium furniture for modern living</p>
            <Link href="/products" className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all">
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-black" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1500 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 pointer-events-none'
            }`}
          >
            <div
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[8000ms] ease-linear ${
                index === currentSlide ? 'scale-110' : 'scale-100'
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black/60" />
            </div>

            <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
              <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div className="text-white space-y-8">
                    <div className={`inline-flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full border bg-white/10 border-white/30 text-white backdrop-blur-sm transition-all duration-1000 delay-200 ${
                      index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                      <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">Premium Collection</span>
                    </div>

                    <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight transition-all duration-1000 delay-400 ${
                      index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                      <span className="block">{slide.title.split(' ').slice(0, 2).join(' ')}</span>
                      <span className="block bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                        {slide.title.split(' ').slice(2).join(' ') || ''}
                      </span>
                    </h1>

                    <p className={`text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl transition-all duration-1000 delay-600 text-gray-200 line-clamp-3 ${
                      index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                      {slide.subtitle}
                    </p>

                    <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-800 ${
                      index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                      <Link
                        href={slide.ctaLink}
                        className="group inline-flex items-center justify-center space-x-2 sm:space-x-3 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:via-orange-700 hover:to-amber-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                      >
                        <span>{slide.cta}</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </Link>
                      <Link
                        href="/consultation"
                        className="group inline-flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-500 hover:scale-105 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 backdrop-blur-sm"
                      >
                        <span>Free Consultation</span>
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>

                  <div className={`hidden lg:block space-y-6 transition-all duration-1000 delay-1000 ${
                    index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}>
                    {[
                      { icon: '🏆', title: 'Award-Winning Design', desc: 'Internationally recognized furniture collections' },
                      { icon: '🚚', title: 'White-Glove Delivery', desc: 'Professional setup and installation included' },
                      { icon: '💎', title: 'Lifetime Warranty', desc: 'Comprehensive coverage on all premium pieces' },
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-4 p-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-105">
                        <div className="text-2xl">{feature.icon}</div>
                        <div>
                          <h3 className="font-bold text-lg">{feature.title}</h3>
                          <p className="text-sm text-gray-300">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={prevSlide} className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 p-2 sm:p-3 lg:p-4 bg-white/15 hover:bg-white/25 backdrop-blur-xl rounded-xl lg:rounded-2xl transition-all duration-500 hover:scale-110 z-20 border border-white/30 hover:border-white/50 shadow-2xl">
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
      </button>
      <button onClick={nextSlide} className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 p-2 sm:p-3 lg:p-4 bg-white/15 hover:bg-white/25 backdrop-blur-xl rounded-xl lg:rounded-2xl transition-all duration-500 hover:scale-110 z-20 border border-white/30 hover:border-white/50 shadow-2xl">
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
      </button>

      <div className="absolute bottom-6 sm:bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 bg-black/30 backdrop-blur-xl rounded-xl lg:rounded-2xl px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 border border-white/20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative transition-all duration-500 ${
                index === currentSlide ? 'w-8 h-2 sm:w-10 sm:h-2.5 lg:w-12 lg:h-3' : 'w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 hover:w-4 sm:hover:w-5 lg:hover:w-6'
              }`}
            >
              <div className={`w-full h-full rounded-full transition-all duration-500 ${
                index === currentSlide ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg' : 'bg-white/50 hover:bg-white/75'
              }`} />
              {index === currentSlide && <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse opacity-50" />}
            </button>
          ))}
          <div className="hidden sm:block ml-2 sm:ml-3 lg:ml-4 pl-2 sm:pl-3 lg:pl-4 border-l border-white/30">
            <span className="text-white text-xs sm:text-sm font-bold">{String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/30 z-20">
        <div className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 transition-all duration-300" style={{ width: isAutoPlaying ? `${((currentSlide + 1) / slides.length) * 100}%` : '0%' }} />
      </div>
    </section>
  );
};

export default HeroSection;
