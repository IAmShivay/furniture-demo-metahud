'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, Home, Phone, Mail, ArrowRight, Shield, Package, LayoutDashboard, LogOut } from 'lucide-react';
import { brandInfo } from '../../config/brand';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setMobileMenuOpen, setSearchOpen } from '../../store/slices/uiSlice';
import { useWishlist } from '../../hooks/useWishlist';
import { selectIsAuthenticated, selectUser } from '../../store/slices/authSlice';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { wishlistCount } = useWishlist();

  const { logout, isAdmin, isSupport } = useAuth();

  
  const mobileMenuOpen = useAppSelector(state => state.ui.mobileMenuOpen);
  const searchOpen = useAppSelector(state => state.ui.searchOpen);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  useEffect(() => {
    setActiveDropdown(null);
    setUserMenuOpen(false);
    dispatch(setMobileMenuOpen(false));
    dispatch(setSearchOpen(false));
  }, [pathname, dispatch]);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        dispatch(setSearchOpen(false));
      }

      
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }

      
      if (activeDropdown) {
        const dropdownElement = dropdownRefs.current[activeDropdown];
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown, dispatch]);

  
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dispatch(setSearchOpen(false));
        setActiveDropdown(null);
        setUserMenuOpen(false);
        dispatch(setMobileMenuOpen(false));
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [dispatch]);

  const navigation = [
    {
      name: 'Collections',
      href: '/collections',
      submenu: [
        { name: 'Living Room', href: '/collections/living-room', description: 'Sofas, chairs, and coffee tables' },
        { name: 'Bedroom', href: '/collections/bedroom', description: 'Beds, dressers, and nightstands' },
        { name: 'Dining Room', href: '/collections/dining', description: 'Tables, chairs, and storage' },
        { name: 'Office', href: '/collections/office', description: 'Desks, chairs, and bookcases' },
        { name: 'Outdoor', href: '/collections/outdoor', description: 'Patio and garden furniture' },
      ]
    },
    {
      name: 'Services',
      href: '/services'
    },
    {
      name: 'Gallery',
      href: '/gallery'
    },
    {
      name: 'Blog',
      href: '/blog'
    },
    {
      name: 'About',
      href: '/about'
    },
    {
      name: 'Contact',
      href: '/contact'
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {}
      <div className="absolute inset-0 transition-all duration-700 bg-gradient-to-b from-black/70 via-black/50 to-black/30 backdrop-blur-xl">
        {}
        <div className="absolute inset-0 transition-all duration-700 bg-gradient-to-b from-black/40 via-black/20 to-transparent"></div>

        {}
        <div className={`absolute inset-0 opacity-5 transition-opacity duration-700 ${
          isScrolled ? 'opacity-0' : 'opacity-10'
        }`} style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {}
      <div className={`relative z-10 transition-all duration-700 ${
        isScrolled ? 'h-0 overflow-hidden opacity-0 -translate-y-full' : 'h-auto opacity-100 translate-y-0'
      }`}>
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-center py-2 sm:py-3 px-2 sm:px-4 relative overflow-hidden">
          {}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>

          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-8 relative z-10">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
              <span className="font-bold text-xs sm:text-sm md:text-base tracking-wide">EXCLUSIVE: Save 25% on Premium Collections</span>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
            </div>
            <div className="hidden lg:flex items-center space-x-3">
              <span className="w-px h-4 bg-white/40"></span>
              <span className="font-semibold text-sm">Free Design Consultation + White-Glove Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-4 sm:py-6">
          {}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-5 group cursor-pointer">
            <img
              src="/logo.png"
              alt={brandInfo.name}
              className={`transition-all duration-500 group-hover:scale-105 transform-gpu ${
                isScrolled ? 'h-8 sm:h-10' : 'h-10 sm:h-14'
              }`}
            />
          </Link>

          {}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative group"
                ref={(el) => {
                  if (el) dropdownRefs.current[item.name] = el;
                }}
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => {
                  if (dropdownTimerRef.current) {
                    clearTimeout(dropdownTimerRef.current);
                  }
                  dropdownTimerRef.current = setTimeout(() => {
                    if (!dropdownRefs.current[item.name]?.matches(':hover')) {
                      setActiveDropdown(null);
                    }
                  }, 100);
                }}
              >
                <Link
                  href={item.href}
                  className="relative flex items-center space-x-2 px-5 py-4 text-sm font-bold transition-all duration-500 font-montserrat rounded-2xl group-hover:scale-105 transform-gpu text-white hover:text-white hover:bg-white/20 hover:backdrop-blur-xl filter drop-shadow-lg hover:shadow-2xl border border-white/20 hover:border-white/40"
                >
                  <span className="relative z-10 tracking-wide">{item.name}</span>
                  {item.submenu && (
                    <ChevronDown className={`w-4 h-4 transition-all duration-500 ${
                      activeDropdown === item.name ? 'rotate-180 scale-110' : ''
                    }`} />
                  )}

                  {}
                  <div className="absolute inset-0 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/25 via-white/15 to-white/20 backdrop-blur-xl shadow-inner"></div>

                  {}
                  <div className="absolute -inset-0.5 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 blur-sm bg-gradient-to-br from-white/30 to-white/10"></div>
                </Link>

                {}
                {item.submenu && activeDropdown === item.name && (
                  <div
                    className="absolute top-full left-0 mt-2 w-96 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-8 z-[60] opacity-100 visible transition-all duration-300"
                    style={{
                      transform: 'translateX(-50%)',
                      left: '50%'
                    }}
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black/95 rotate-45 border-l border-t border-white/20"></div>

                    <div className="px-8 mb-6">
                      <h3 className="text-xl font-bold text-white font-montserrat">
                        {item.name}
                      </h3>
                      <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-2"></div>
                    </div>

                    <div className="space-y-1">
                      {item.submenu.map((subItem, index) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-8 py-4 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 transition-all duration-300 group border-l-4 border-transparent hover:border-amber-500 rounded-r-xl"
                          style={{ animationDelay: `${index * 50}ms` }}
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="font-semibold text-white group-hover:text-amber-400 transition-colors duration-300 font-montserrat">
                            {subItem.name}
                          </div>
                          <div className="text-sm text-gray-300 font-playfair mt-1 group-hover:text-gray-200 transition-colors duration-300">
                            {subItem.description}
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="px-8 pt-6 mt-6 border-t border-white/20">
                      <a
                        href="#view-all"
                        className="inline-flex items-center space-x-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors duration-300"
                      >
                        <span>View All {item.name}</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {}
            <button
              onClick={() => dispatch(setSearchOpen(!searchOpen))}
              className="hidden xs:block relative p-2 sm:p-3 md:p-4 transition-all duration-500 rounded-xl sm:rounded-2xl group hover:scale-110 transform-gpu text-white hover:text-white hover:bg-white/25 hover:backdrop-blur-xl filter drop-shadow-lg hover:shadow-2xl border border-white/30 hover:border-white/50"
              aria-label="Search"
            >
              <Search className="w-5 h-5 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" />

              {}
              <div className="absolute inset-0 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/20 to-white/10 shadow-inner"></div>

              {}
              <div className="absolute -inset-0.5 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 blur-sm bg-gradient-to-br from-white/40 to-white/20"></div>
            </button>

            <div className="hidden sm:block relative" ref={userMenuRef}>
              <button
                onClick={() => isAuthenticated ? setUserMenuOpen(!userMenuOpen) : router.push('/login')}
                className="relative p-2 sm:p-3 md:p-4 transition-all duration-500 rounded-xl sm:rounded-2xl group hover:scale-110 transform-gpu text-white hover:text-white hover:bg-white/25 hover:backdrop-blur-xl filter drop-shadow-lg hover:shadow-2xl border border-white/30 hover:border-white/50"
                aria-label={isAuthenticated ? 'Account' : 'Sign In'}
              >
                <User className="w-5 h-5 transition-all duration-500 group-hover:scale-125" />
                {isAuthenticated && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {userMenuOpen && isAuthenticated && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-4 z-[60]">
                  <div className="px-5 pb-3 mb-2 border-b border-white/10">
                    <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                    <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-500/20 text-amber-400">
                      {user?.role}
                    </span>
                  </div>

                  <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center space-x-3 px-5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                    <User className="w-4 h-4" />
                    <span>My Account</span>
                  </Link>
                  <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center space-x-3 px-5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                    <Package className="w-4 h-4" />
                    <span>My Orders</span>
                  </Link>

                  {isSupport() && (
                    <>
                      <div className="my-2 border-t border-white/10" />
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center space-x-3 px-5 py-2.5 text-sm text-amber-400 hover:text-amber-300 hover:bg-white/10 transition-colors">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link href="/admin/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center space-x-3 px-5 py-2.5 text-sm text-amber-400 hover:text-amber-300 hover:bg-white/10 transition-colors">
                        <Package className="w-4 h-4" />
                        <span>Manage Orders</span>
                      </Link>
                    </>
                  )}

                  {isAdmin() && (
                    <>
                      <Link href="/admin/users" onClick={() => setUserMenuOpen(false)} className="flex items-center space-x-3 px-5 py-2.5 text-sm text-amber-400 hover:text-amber-300 hover:bg-white/10 transition-colors">
                        <Shield className="w-4 h-4" />
                        <span>Manage Users</span>
                      </Link>
                    </>
                  )}

                  <div className="my-2 border-t border-white/10" />
                  <button
                    onClick={() => { setUserMenuOpen(false); logout(); router.push('/'); }}
                    className="flex items-center space-x-3 w-full px-5 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {}
            <button
              onClick={() => router.push('/wishlist')}
              className="relative p-2 sm:p-3 md:p-4 transition-all duration-500 rounded-xl sm:rounded-2xl group hover:scale-110 transform-gpu text-white hover:text-white hover:bg-white/25 hover:backdrop-blur-xl filter drop-shadow-lg hover:shadow-2xl border border-white/30 hover:border-white/50"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 transition-all duration-500 group-hover:scale-125 group-hover:fill-current group-hover:text-red-400" />

              {}
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}

              <div className="absolute inset-0 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/20 to-white/10 shadow-inner"></div>

              <div className="absolute -inset-0.5 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 blur-sm bg-gradient-to-br from-white/40 to-white/20"></div>
            </button>

            {}
            <button
              onClick={onCartClick}
              className="relative p-2 sm:p-3 md:p-4 transition-all duration-500 rounded-xl sm:rounded-2xl group hover:scale-110 transform-gpu text-white hover:text-white hover:bg-white/25 hover:backdrop-blur-xl filter drop-shadow-lg hover:shadow-2xl border border-white/30 hover:border-white/50"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 transition-all duration-500 group-hover:scale-125 group-hover:-rotate-12" />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center font-bold shadow-xl animate-bounce border-2 border-white">
                  {cartCount}
                </span>
              )}

              <div className="absolute inset-0 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/20 to-white/10 shadow-inner"></div>

              <div className="absolute -inset-0.5 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 blur-sm bg-gradient-to-br from-white/40 to-white/20"></div>
            </button>

            {}
            <button
              onClick={() => dispatch(setMobileMenuOpen(!mobileMenuOpen))}
              className="lg:hidden relative p-2 sm:p-3 md:p-4 transition-all duration-500 rounded-xl sm:rounded-2xl group hover:scale-110 transform-gpu text-white hover:text-white hover:bg-white/25 hover:backdrop-blur-xl filter drop-shadow-lg hover:shadow-2xl border border-white/30 hover:border-white/50"
              aria-label="Menu"
            >
              <div className="relative w-5 h-5">
                <Menu className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${
                  mobileMenuOpen ? 'opacity-0 rotate-180 scale-50' : 'opacity-100 rotate-0 scale-100'
                }`} />
                <X className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${
                  mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-50'
                }`} />
              </div>

              <div className="absolute inset-0 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/20 to-white/10 shadow-inner"></div>

              <div className="absolute -inset-0.5 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 blur-sm bg-gradient-to-br from-white/40 to-white/20"></div>
            </button>
          </div>
        </div>

        {}
        {searchOpen && (
          <div ref={searchRef} className="pb-6 animate-in slide-in-from-top duration-300">
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for furniture, collections, or inspiration..."
                  className="w-full px-6 py-4 pl-14 pr-20 text-lg border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white/95 backdrop-blur-xl border-white/30 text-gray-900 placeholder-gray-600 shadow-2xl font-montserrat"
                  autoFocus
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-amber-500" />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-lg">
                    ESC
                  </kbd>
                </div>
              </div>

              {}
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden opacity-95">
                <div className="p-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Popular Searches</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Modern Sofa', 'Dining Table', 'Office Chair', 'Bedroom Set', 'Coffee Table'].map((term) => (
                      <button
                        key={term}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-amber-100 hover:text-amber-700 rounded-full transition-colors duration-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-gray-200/50 animate-in slide-in-from-top duration-300 shadow-2xl">
          <nav className="container mx-auto px-6 py-8">
            {}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 font-montserrat bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Explore Collections
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-2"></div>
            </div>

            {}
            <div className="space-y-2">
              {navigation.map((item, index) => (
                <div key={item.name} className="animate-in slide-in-from-left duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                  <a
                    href={item.href}
                    className="group flex items-center justify-between px-6 py-4 text-lg font-semibold text-gray-900 hover:text-amber-600 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 rounded-2xl transition-all duration-300 border-l-4 border-transparent hover:border-amber-500 hover:shadow-lg font-montserrat"
                  >
                    <span>{item.name}</span>
                    {item.submenu && (
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
                    )}
                  </a>

                  {item.submenu && (
                    <div className="ml-6 mt-3 space-y-2 pl-4 border-l-2 border-gray-100">
                      {item.submenu.map((subItem, subIndex) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-3 text-base text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-300 font-playfair hover:translate-x-2"
                          style={{ animationDelay: `${(index * 100) + (subIndex * 50)}ms` }}
                        >
                          <div className="font-medium">{subItem.name}</div>
                          <div className="text-sm text-gray-500 mt-1">{subItem.description}</div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isAuthenticated && (
              <div className="pt-6 mt-6 border-t border-gray-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  {user?.name}
                  <span className="ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-100 text-amber-700">
                    {user?.role}
                  </span>
                </h4>
                <div className="space-y-1">
                  <Link href="/account" onClick={() => dispatch(setMobileMenuOpen(false))} className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all">
                    <User className="w-5 h-5" /><span>My Account</span>
                  </Link>
                  <Link href="/account" onClick={() => dispatch(setMobileMenuOpen(false))} className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all">
                    <Package className="w-5 h-5" /><span>My Orders</span>
                  </Link>
                  {isSupport() && (
                    <>
                      <Link href="/admin" onClick={() => dispatch(setMobileMenuOpen(false))} className="flex items-center space-x-3 px-4 py-3 text-amber-700 hover:bg-amber-50 rounded-xl transition-all">
                        <LayoutDashboard className="w-5 h-5" /><span>Dashboard</span>
                      </Link>
                      <Link href="/admin/orders" onClick={() => dispatch(setMobileMenuOpen(false))} className="flex items-center space-x-3 px-4 py-3 text-amber-700 hover:bg-amber-50 rounded-xl transition-all">
                        <Package className="w-5 h-5" /><span>Manage Orders</span>
                      </Link>
                    </>
                  )}
                  {isAdmin() && (
                    <Link href="/admin/users" onClick={() => dispatch(setMobileMenuOpen(false))} className="flex items-center space-x-3 px-4 py-3 text-amber-700 hover:bg-amber-50 rounded-xl transition-all">
                      <Shield className="w-5 h-5" /><span>Manage Users</span>
                    </Link>
                  )}
                  <button onClick={() => { dispatch(setMobileMenuOpen(false)); logout(); router.push('/'); }} className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all">
                    <LogOut className="w-5 h-5" /><span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}

            <div className="pt-8 mt-8 border-t border-gray-200/50">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Get in Touch</h4>
              <div className="space-y-3">
                <a
                  href="tel:+919547587246"
                  className="flex items-center space-x-4 px-4 py-3 text-gray-700 hover:text-amber-600 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 rounded-xl transition-all duration-300 group"
                >
                  <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors duration-300">
                    <Phone className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Call Us</div>
                    <div className="text-sm text-gray-500">+91 9547587246</div>
                  </div>
                </a>
                <a
                  href="mailto:hello@luxehouse.in"
                  className="flex items-center space-x-4 px-4 py-3 text-gray-700 hover:text-amber-600 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 rounded-xl transition-all duration-300 group"
                >
                  <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors duration-300">
                    <Mail className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Email Us</div>
                    <div className="text-sm text-gray-500">hello@luxehouse.in</div>
                  </div>
                </a>
              </div>
            </div>

            {}
            <div className="pt-8 mt-8 border-t border-gray-200/50">
              <Link
                href="/consultation"
                onClick={() => dispatch(setMobileMenuOpen(false))}
                className="block w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white text-center py-4 px-6 rounded-2xl font-semibold text-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-xl font-montserrat"
              >
                Book Free Consultation
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;