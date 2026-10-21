'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, CheckCircle, MapPin, Phone, Clock, Calendar, Users, Award } from 'lucide-react';
import { contactInfo } from '../../config/brand';
import { useSubscribeNewsletterMutation } from '../../store/api/newsletterApi';

const NewsletterSection: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [subscribe, { isLoading }] = useSubscribeNewsletterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = await subscribe({ email }).unwrap();
      if (result.success) {
        setIsSubscribed(true);
      }
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to subscribe. Please try again.');
    }
  };

  return (
    <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
      {}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Mail className="w-6 h-6 text-amber-600" />
              <span className="text-amber-600 font-medium font-montserrat">Stay Connected</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">
              Join the LuxeHouse Family
            </h2>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed font-playfair">
              Be the first to discover new collections, receive exclusive design insights, and enjoy special member benefits.
              Join over 50,000 design enthusiasts who trust us to inspire their homes.
            </p>

            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                    required
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:transform-none font-montserrat"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Subscribing...</span>
                    </div>
                  ) : (
                    'Subscribe to Newsletter'
                  )}
                </button>
                <p className="text-sm text-gray-400 font-playfair">
                  By subscribing, you agree to our Privacy Policy and consent to receiving marketing emails.
                  Unsubscribe at any time.
                </p>
              </form>
            ) : (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-3 font-montserrat">Welcome to the LuxeHouse Family!</h3>
                <p className="text-gray-300 font-playfair">
                  You'll receive your first design inspiration email within 24 hours.
                  Get ready to transform your space!
                </p>
              </div>
            )}

            
            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold font-montserrat">Exclusive Access</p>
                  <p className="text-sm text-gray-400 font-playfair">Early collection previews</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold font-montserrat">Design Community</p>
                  <p className="text-sm text-gray-400 font-playfair">Connect with designers</p>
                </div>
              </div>
            </div>
          </div>

          
          <div>
            <h3 className="text-3xl font-bold mb-8 font-montserrat">
              Visit Our Showroom
            </h3>

            <div className="space-y-8">
              
              <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 hover:border-amber-600/50 transition-colors duration-300">
                <h4 className="text-2xl font-semibold mb-6 text-amber-400 font-montserrat">Durgapur Showroom</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 font-playfair">{contactInfo.address.street}</p>
                      <p className="text-gray-300 font-playfair">
                        {contactInfo.address.city}, {contactInfo.address.state} {contactInfo.address.zip}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a href={`tel:${contactInfo.phone}`} className="text-gray-300 hover:text-amber-600 transition-colors font-playfair">
                      {contactInfo.phone}
                    </a>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Clock className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="text-gray-300 font-playfair">
                      <p>{contactInfo.hours.weekdays}</p>
                      <p>{contactInfo.hours.weekends}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/consultation')}
                  className="mt-6 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 font-montserrat"
                >
                  Schedule Visit
                </button>
              </div>

              
              <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="w-6 h-6 text-amber-400" />
                  <h4 className="text-xl font-bold font-montserrat">Complimentary Design Consultation</h4>
                </div>
                <p className="text-gray-300 mb-6 font-playfair">
                  Our expert designers are ready to help you create your dream space.
                  Book a free consultation and discover how our furniture can transform your home.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => router.push('/consultation')}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 font-montserrat"
                  >
                    Book In-Store
                  </button>
                  <button
                    onClick={() => router.push('/consultation')}
                    className="border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 font-montserrat"
                  >
                    Virtual Consultation
                  </button>
                </div>
              </div>

              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-amber-400 font-montserrat">Our Premium Services</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Interior Design Consultation',
                    'White-Glove Delivery',
                    'Professional Assembly',
                    'Custom Furniture Design',
                    '3D Room Visualization',
                    'Furniture Care & Maintenance'
                  ].map((service, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-amber-600 rounded-full" />
                      <span className="text-gray-300 font-playfair">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
