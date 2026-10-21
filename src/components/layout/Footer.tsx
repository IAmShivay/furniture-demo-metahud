'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Heart, Award, Truck, Shield, Clock, CheckCircle } from 'lucide-react';
import { brandInfo, contactInfo, socialLinks } from '../../config/brand';
import { useSubscribeNewsletterMutation } from '../../store/api/newsletterApi';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [footerEmail, setFooterEmail] = useState('');
  const [footerSubscribed, setFooterSubscribed] = useState(false);
  const [subscribe, { isLoading: footerLoading }] = useSubscribeNewsletterMutation();

  return (
    <footer className="bg-gray-900 text-white">
      {}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img src="/logo.png" alt={brandInfo.name} className="h-12 mb-2" />
              <p className="text-sm text-amber-400 font-playfair">
                {brandInfo.tagline}
              </p>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed font-playfair">
              {brandInfo.description}
            </p>

            {}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3 text-amber-400 font-montserrat">Our Values</h4>
              <div className="space-y-2">
                {brandInfo.values.slice(0, 3).map((value, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Heart className="w-3 h-3 text-amber-600" />
                    <span className="text-sm text-gray-300">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div className="flex space-x-4">
              <a href={socialLinks.facebook} className="text-gray-400 hover:text-amber-600 transition-colors duration-200">
                <Facebook className="w-6 h-6" />
              </a>
              <a href={socialLinks.instagram} className="text-gray-400 hover:text-amber-600 transition-colors duration-200">
                <Instagram className="w-6 h-6" />
              </a>
              <a href={socialLinks.twitter} className="text-gray-400 hover:text-amber-600 transition-colors duration-200">
                <Twitter className="w-6 h-6" />
              </a>
              <a href={socialLinks.youtube} className="text-gray-400 hover:text-amber-600 transition-colors duration-200">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {}
          <div>
            <h4 className="text-lg font-semibold mb-6 font-montserrat">
              Shop Collections
            </h4>
            <ul className="space-y-3">
              <li><Link href="/collections/living-room" className="text-gray-300 hover:text-amber-600 transition-colors duration-200 font-playfair">Living Room</Link></li>
              <li><Link href="/collections/bedroom" className="text-gray-300 hover:text-amber-600 transition-colors duration-200 font-playfair">Bedroom</Link></li>
              <li><Link href="/collections/dining" className="text-gray-300 hover:text-amber-600 transition-colors duration-200 font-playfair">Dining Room</Link></li>
              <li><Link href="/collections/office" className="text-gray-300 hover:text-amber-600 transition-colors duration-200 font-playfair">Home Office</Link></li>
              <li><Link href="/gallery" className="text-gray-300 hover:text-amber-600 transition-colors duration-200 font-playfair">Gallery</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-amber-600 transition-colors duration-200 font-playfair">All Products</Link></li>
              <li><Link href="/products?sale=true" className="text-amber-400 hover:text-amber-300 transition-colors duration-200 font-playfair font-medium">Sale Items</Link></li>
            </ul>
          </div>

          {}
          <div>
            <h4 className="text-lg font-semibold mb-6 font-montserrat">
              Customer Care
            </h4>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-gray-300 hover:text-amber-600 transition-colors duration-200 font-playfair">Contact Us</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-amber-600 transition-colors duration-200 font-playfair">Design Services</Link></li>
              <li><Link href="/consultation" className="text-gray-300 hover:text-amber-600 transition-colors duration-200 font-playfair">Book Consultation</Link></li>
              <li><Link href="/shipping" className="text-gray-300 hover:text-amber-600 transition-colors duration-200 font-playfair">Shipping & Delivery</Link></li>
              <li><Link href="/refund-policy" className="text-gray-300 hover:text-amber-600 transition-colors duration-200 font-playfair">Refund Policy</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-amber-600 transition-colors duration-200 font-playfair">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-amber-600 transition-colors duration-200 font-playfair">Terms & Conditions</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-amber-600 transition-colors duration-200 font-playfair">FAQ</Link></li>
            </ul>
          </div>

          {}
          <div>
            <h4 className="text-lg font-semibold mb-6 font-montserrat">
              Get in Touch
            </h4>
            
            {}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <a href={`tel:${contactInfo.phone}`} className="text-gray-300 hover:text-amber-600 transition-colors">
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="text-gray-300 hover:text-amber-600 transition-colors">
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-gray-300">
                  <p>{contactInfo.address.street}</p>
                  <p>{contactInfo.address.city}, {contactInfo.address.state} {contactInfo.address.zip}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-gray-300 text-sm">
                  <p>{contactInfo.hours.weekdays}</p>
                  <p>{contactInfo.hours.weekends}</p>
                </div>
              </div>
            </div>

            {}
            <div>
              <h5 className="text-sm font-semibold mb-3 text-amber-400 font-montserrat">Stay Inspired</h5>
              <p className="text-sm text-gray-400 mb-4 font-playfair">Get design tips and exclusive offers</p>
              {!footerSubscribed ? (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const result = await subscribe({ email: footerEmail }).unwrap();
                    if (result.success) setFooterSubscribed(true);
                  } catch {}
                }} className="flex">
                  <input
                    type="email"
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                    placeholder="Your email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
                    required
                  />
                  <button type="submit" disabled={footerLoading} className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-r-lg transition-colors duration-200">
                    <Mail className="w-5 h-5" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Subscribed!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center space-x-3 text-gray-400">
              <Truck className="w-6 h-6 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-white">Free Delivery</p>
                <p className="text-xs">Orders over ₹1,000</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-400">
              <Shield className="w-6 h-6 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-white">Secure Payment</p>
                <p className="text-xs">SSL Protected</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-400">
              <Award className="w-6 h-6 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-white">Quality Guarantee</p>
                <p className="text-xs">Lifetime warranty</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-400">
              <Heart className="w-6 h-6 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-white">Design Support</p>
                <p className="text-xs">Free consultation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} {brandInfo.name}. All rights reserved. | Crafted with ❤️ since {brandInfo.founded}
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-amber-600 transition-colors duration-200">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-amber-600 transition-colors duration-200">Terms of Service</Link>
              <Link href="/refund-policy" className="text-gray-400 hover:text-amber-600 transition-colors duration-200">Refund Policy</Link>
              <Link href="/contact" className="text-gray-400 hover:text-amber-600 transition-colors duration-200">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;