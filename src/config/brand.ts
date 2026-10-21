import { BrandInfo, ContactInfo, SocialLinks } from '../types';

export const brandInfo: BrandInfo = {
  name: 'LuxeHouse',
  tagline: 'Where Luxury Meets Comfort',
  description: 'LuxeHouse is a premium furniture brand dedicated to creating exceptional pieces that transform houses into homes. Founded on the principles of quality craftsmanship, timeless design, and sustainable practices.',
  founded: '2018',
  location: 'Durgapur, West Bengal',
  values: [
    'Exceptional Craftsmanship',
    'Sustainable Materials',
    'Timeless Design',
    'Customer Satisfaction',
    'Innovation in Comfort'
  ]
};

export const contactInfo: ContactInfo = {
  phone: '+91 9547587246',
  whatsapp: '+91 6295411681',
  email: 'hello@luxehouse.in',
  address: {
    street: 'Arrah Shree Pally',
    city: 'Durgapur',
    state: 'West Bengal',
    zip: '713212',
    country: 'India'
  },
  hours: {
    weekdays: 'Monday - Friday: 10:00 AM - 8:00 PM IST',
    weekends: 'Saturday - Sunday: 10:00 AM - 6:00 PM IST'
  }
};

export const socialLinks: SocialLinks = {
  facebook: 'https://facebook.com/luxehouse.in',
  instagram: 'https://instagram.com/luxehouse.in',
  twitter: 'https://twitter.com/luxehouse_in',
  pinterest: 'https://pinterest.com/luxehouse',
  youtube: 'https://youtube.com/luxehouse'
};