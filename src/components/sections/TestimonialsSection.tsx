'use client';

import React, { useState, useMemo } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useGetProductsQuery } from '../../store/api/productsApi';

interface TestimonialItem {
  id: string;
  productName: string;
  category: string;
  rating: number;
  review: string;
  image: string;
}

const TestimonialsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { data, isLoading } = useGetProductsQuery({ limit: 20, sortBy: 'rating' });

  const testimonials = useMemo<TestimonialItem[]>(() => {
    if (!data?.data?.items?.length) return [];

    return data.data.items
      .filter((product) => product.rating.average > 0 && product.images.length > 0)
      .map((product) => {
        const productAny = product as any;
        const review = productAny.reviews?.length ? productAny.reviews[0] : null;

        return {
          id: product.id,
          productName: product.name,
          category: product.category,
          rating: Math.round(product.rating.average),
          review: review?.comment
            || `This ${product.name} exceeded my expectations. The quality and craftsmanship are outstanding.`,
          image: product.images[0],
        };
      })
      .slice(0, 8);
  }, [data]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="h-6 w-40 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-12 w-96 bg-gray-200 rounded-full mx-auto mb-6 animate-pulse" />
            <div className="h-6 w-80 bg-gray-200 rounded-full mx-auto animate-pulse" />
          </div>
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
              <div className="flex-shrink-0 text-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse mx-auto" />
                <div className="mt-6 space-y-3">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="h-12 w-12 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-5/6 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials.length) return null;

  const current = testimonials[currentTestimonial];

  return (
    <section className="py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Quote className="w-6 h-6 text-amber-600" />
            <span className="text-amber-600 font-medium font-montserrat">Customer Stories</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-montserrat">
            Voices of Satisfaction
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-playfair">
            Real stories from customers who have transformed their homes with our exceptional furniture
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full -translate-y-20 translate-x-20 opacity-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full translate-y-16 -translate-x-16 opacity-10" />

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
                <div className="flex-shrink-0 text-center lg:text-left">
                  <div className="relative inline-block">
                    <img
                      src={current.image}
                      alt={current.productName}
                      className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-amber-600 rounded-full p-2">
                      <Quote className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-2xl font-bold text-gray-900 mb-1 font-montserrat">
                      {current.productName}
                    </h4>
                    <p className="text-amber-600 font-medium mb-1 font-montserrat">
                      {current.category}
                    </p>
                    <p className="text-gray-600 text-sm mb-3">
                      {current.rating}/5 average rating
                    </p>

                    <div className="flex justify-center lg:justify-start space-x-1 mb-4">
                      {renderStars(current.rating)}
                    </div>

                    <div className="bg-gray-50 rounded-lg px-4 py-2 inline-block">
                      <p className="text-sm text-gray-600 font-medium">
                        Product: {current.productName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="mb-6">
                    <Quote className="w-12 h-12 text-amber-600 opacity-50 mb-4" />
                  </div>

                  <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-playfair italic">
                    "{current.review}"
                  </blockquote>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-xl rounded-full p-4 hover:bg-gray-50 transition-all duration-200 hover:scale-110 z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-xl rounded-full p-4 hover:bg-gray-50 transition-all duration-200 hover:scale-110 z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          <div className="flex justify-center space-x-3 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'w-12 h-3 bg-amber-600 rounded-full'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 opacity-80">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">&#10003;</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 font-montserrat">Free White-Glove Delivery</h4>
            <p className="text-sm text-gray-600 font-playfair">Orders over ₹1,000</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">30</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 font-montserrat">Day Returns</h4>
            <p className="text-sm text-gray-600 font-playfair">Hassle-free returns</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white fill-current" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 font-montserrat">5-Star Service</h4>
            <p className="text-sm text-gray-600 font-playfair">Award-winning support</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">&infin;</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 font-montserrat">Lifetime Warranty</h4>
            <p className="text-sm text-gray-600 font-playfair">Quality guarantee</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
