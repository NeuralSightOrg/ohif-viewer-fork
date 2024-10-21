import React, { useState, useRef } from 'react';
import { useUserAuthentication } from '@ohif/ui';
import { Camera, Edit2, Link, Twitter, Facebook, Instagram, Save } from 'lucide-react';
import { Input } from '@ohif/ui';
import DashboardLayout from '../dashboard/DashboardLayout';

const Profile = () => {
  const [userAuthenticationState, api] = useUserAuthentication();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    ...userAuthenticationState.user,
    bio: userAuthenticationState.user?.bio || '',
    website: userAuthenticationState.user?.website || '',
    twitter: userAuthenticationState.user?.twitter || '',
    facebook: userAuthenticationState.user?.facebook || '',
    instagram: userAuthenticationState.user?.instagram || '',
  });
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    api.reset();
    api.service.handleUnauthenticated();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    api.setUser(userInfo);
    setIsEditing(false);
  };

  const handleChange = e => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInfo({ ...userInfo, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-primary-dark rounded-lg p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">User Profile</h1>
            {isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </button>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="mb-6 md:mb-0 md:w-1/3">
              <div className="relative">
                <img
                  src={userInfo.avatar || 'https://via.placeholder.com/150'}
                  alt="User Avatar"
                  className="mx-auto h-32 w-32 rounded-full"
                />
                {isEditing && (
                  <div
                    className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-600 p-2"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <Input
                    type="text"
                    name="username"
                    value={userInfo.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 w-full"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <Input
                  as="textarea" // Using Input as a textarea
                  name="bio"
                  value={userInfo.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="3"
                  className="mt-1 w-full"
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                      <Link className="h-4 w-4" />
                    </span>
                    <Input
                      type="text"
                      name="website"
                      value={userInfo.website}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Twitter</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                      <Twitter className="h-4 w-4" />
                    </span>
                    <Input
                      type="text"
                      name="twitter"
                      value={userInfo.twitter}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Facebook</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                      <Facebook className="h-4 w-4" />
                    </span>
                    <Input
                      type="text"
                      name="facebook"
                      value={userInfo.facebook}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Instagram</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                      <Instagram className="h-4 w-4" />
                    </span>
                    <Input
                      type="text"
                      name="instagram"
                      value={userInfo.instagram}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <a
              href="/logout"
              className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
