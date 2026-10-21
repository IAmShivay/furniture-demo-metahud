'use client';

import React, { useState, useEffect } from 'react';
import { User, Package, Heart, Settings, LogOut, Edit, Save, X, Loader2 } from 'lucide-react';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../store/api/authApi';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import SEOHead from '../../components/common/SEOHead';

const Account: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { logout: authLogout } = useAuth();
  
  
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  
  
  const { wishlistItems, isLoading: isWishlistLoading, removeFromWishlist } = useWishlist();
  
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  
  useEffect(() => {
    if (profileData?.data?.user) {
      const user = profileData.data.user;
      setUserInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.addresses && user.addresses.length > 0 
          ? `${user.addresses[0].street}, ${user.addresses[0].city}, ${user.addresses[0].state} ${user.addresses[0].zipCode}` 
          : ''
      });
    }
  }, [profileData]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSave = async () => {
    try {
      
      let addressUpdate = {};
      if (userInfo.address) {
        const addressParts = userInfo.address.split(',').map(part => part.trim());
        if (addressParts.length >= 3) {
          const street = addressParts[0];
          const city = addressParts[1];
          const stateZip = addressParts[2].split(' ');
          const state = stateZip[0];
          const zipCode = stateZip[1] || '';
          
          addressUpdate = {
            addresses: [{
              street,
              city,
              state,
              zipCode,
              country: 'USA'
            }]
          };
        }
      }
      
      
      await updateProfile({
        name: userInfo.name,
        phone: userInfo.phone,
        ...addressUpdate
      }).unwrap();
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    
    if (profileData?.data?.user) {
      const user = profileData.data.user;
      setUserInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.addresses && user.addresses.length > 0 
          ? `${user.addresses[0].street}, ${user.addresses[0].city}, ${user.addresses[0].state} ${user.addresses[0].zipCode}` 
          : ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36">
      <SEOHead title="My Account | LuxeHouse" description="Manage your LuxeHouse account, orders, and preferences." noIndex={true} />
      {}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-montserrat">
              My Account
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 font-playfair">
              Manage your account settings and preferences
            </p>
            <div className="flex items-center justify-center flex-wrap space-x-4 sm:space-x-6 lg:space-x-8 text-sm text-gray-600">
              <span>✓ Profile Management</span>
              <span>✓ Order History</span>
              <span>✓ Secure Settings</span>
              <span>✓ Personal Dashboard</span>
            </div>
          </div>
        </div>
      </section>

      {}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-8">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                  
                </nav>

                {}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={async () => {
                      setIsLoggingOut(true);
                      try {
                        await authLogout();
                        router.push('/login');
                      } catch (error) {
                        console.error('Logout failed:', error);
                      } finally {
                        setIsLoggingOut(false);
                      }
                    }}
                    disabled={isLoggingOut}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <LogOut className="w-5 h-5" />
                    )}
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8">
                {activeTab === 'profile' && (
                  <div>
                    {isProfileLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                        <span className="ml-2 text-gray-600">Loading profile...</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-bold text-gray-900 font-montserrat">Profile Information</h2>
                          {!isEditing ? (
                            <button
                              onClick={() => setIsEditing(true)}
                              className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={handleSave}
                                disabled={isUpdating}
                                className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                              >
                                {isUpdating ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Save className="w-4 h-4" />
                                )}
                                <span>Save</span>
                              </button>
                              <button
                                onClick={handleCancel}
                                disabled={isUpdating}
                                className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                              >
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={userInfo.name}
                                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                />
                              ) : (
                                <p className="text-gray-900">{userInfo.name}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                              <p className="text-gray-900">{userInfo.email}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={userInfo.phone}
                                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                />
                              ) : (
                                <p className="text-gray-900">{userInfo.phone}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={userInfo.address}
                                  onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                  placeholder="Street, City, State ZipCode"
                                />
                              ) : (
                                <p className="text-gray-900">{userInfo.address}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-6">Order History</h2>
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Package className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">
                        This catalogue is a demo storefront, so no orders are placed yet.
                      </p>
                      <button
                        onClick={() => router.push('/products')}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
                      >
                        Start Shopping
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'wishlist' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-6">My Wishlist</h2>
                    {isWishlistLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                        <span className="ml-2 text-gray-600">Loading wishlist...</span>
                      </div>
                    ) : wishlistItems && wishlistItems.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistItems.map((item) => (
                          <div key={item.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="relative pb-[56.25%] overflow-hidden">
                              <img 
                                src={item.images[0]} 
                                alt={item.name}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="font-medium text-gray-900 mb-1 truncate">{item.name}</h3>
                              <p className="text-amber-600 font-medium">₹{item.basePrice.toFixed(2)}</p>
                              <div className="mt-4 flex space-x-2">
                                <button 
                                  onClick={() => router.push(`/product/${item.id}`)}
                                  className="flex-1 bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors"
                                >
                                  View Details
                                </button>
                                <button 
                                  onClick={() => removeFromWishlist(item.id, item.name)}
                                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                          <Heart className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-600 mb-6">Save items you love to your wishlist</p>
                        <button 
                          onClick={() => router.push('/products')}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
                        >
                          Browse Products
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-6">Account Settings</h2>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Email Notifications</h3>
                          <p className="text-sm text-gray-600">Receive updates about your orders and promotions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={(profileData?.data?.user as any)?.preferences?.notifications?.email ?? true}
                            onChange={async (e) => {
                              try {
                                await updateProfile({
                                  preferences: { notifications: { email: e.target.checked, sms: (profileData?.data?.user as any)?.preferences?.notifications?.sms ?? false } }
                                } as any).unwrap();
                              } catch (err) { console.error(err); }
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                          <p className="text-sm text-gray-600">Get text updates about your orders</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={(profileData?.data?.user as any)?.preferences?.notifications?.sms ?? false}
                            onChange={async (e) => {
                              try {
                                await updateProfile({
                                  preferences: { notifications: { sms: e.target.checked, email: (profileData?.data?.user as any)?.preferences?.notifications?.email ?? true } }
                                } as any).unwrap();
                              } catch (err) { console.error(err); }
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Marketing Communications</h3>
                          <p className="text-sm text-gray-600">Receive promotional offers and product updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={(profileData?.data?.user as any)?.preferences?.newsletter ?? true}
                            onChange={async (e) => {
                              try {
                                await updateProfile({
                                  preferences: { newsletter: e.target.checked }
                                } as any).unwrap();
                              } catch (err) { console.error(err); }
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
