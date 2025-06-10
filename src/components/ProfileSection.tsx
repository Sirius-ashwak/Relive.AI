import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Crown, Edit3, Save, X, Camera } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const ProfileSection: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '👤'
  });

  const handleSave = () => {
    if (user) {
      updateUser(editData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '👤'
    });
    setIsEditing(false);
  };

  const subscriptionInfo = {
    free: { name: 'Free', color: 'text-gray-400', icon: '🆓' },
    pro: { name: 'Pro', color: 'text-accent-cyan', icon: '⭐' },
    legacy: { name: 'Legacy', color: 'text-accent-purple', icon: '👑' }
  };

  const avatarOptions = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧑‍💻', '👨‍🎨', '👩‍🎨', '🧑‍🔬'];

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">No User Found</h2>
        <p className="text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-sora text-4xl font-bold mb-4">
          <span className="gradient-text">Your Profile</span>
        </h1>
        <p className="text-xl text-gray-300">
          Manage your account and preferences
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto p-8 rounded-3xl glass glass-hover"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-sora text-2xl font-semibold text-white">Account Information</h2>
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-aurora rounded-xl font-semibold text-dark-500"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </motion.button>
          ) : (
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-aurora rounded-xl font-semibold text-dark-500"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 glass glass-hover rounded-xl font-semibold text-white"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </motion.button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-20 h-20 rounded-2xl bg-gradient-aurora p-0.5"
              >
                <div className="w-full h-full rounded-2xl bg-dark-400 flex items-center justify-center text-3xl">
                  {isEditing ? editData.avatar : user.avatar}
                </div>
              </motion.div>
              {isEditing && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute -bottom-2 -right-2 p-2 bg-gradient-aurora rounded-full"
                >
                  <Camera className="w-4 h-4 text-dark-500" />
                </motion.button>
              )}
            </div>
            
            {isEditing && (
              <div className="flex flex-wrap gap-2">
                {avatarOptions.map((avatar) => (
                  <motion.button
                    key={avatar}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditData({ ...editData, avatar })}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${
                      editData.avatar === avatar
                        ? 'bg-gradient-aurora'
                        : 'glass glass-hover'
                    }`}
                  >
                    {avatar}
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-cyan/50 focus:outline-none text-white"
              />
            ) : (
              <div className="px-4 py-3 rounded-xl glass text-white">
                {user.name}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-cyan/50 focus:outline-none text-white"
              />
            ) : (
              <div className="px-4 py-3 rounded-xl glass text-white">
                {user.email}
              </div>
            )}
          </div>

          {/* Member Since */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Member Since
            </label>
            <div className="px-4 py-3 rounded-xl glass text-white">
              {user.createdAt.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {/* Subscription */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Crown className="w-4 h-4 inline mr-2" />
              Subscription
            </label>
            <div className="px-4 py-3 rounded-xl glass flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">
                  {subscriptionInfo[user.subscription].icon}
                </span>
                <span className={`font-semibold ${subscriptionInfo[user.subscription].color}`}>
                  {subscriptionInfo[user.subscription].name} Plan
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-aurora rounded-lg font-semibold text-dark-500 text-sm"
              >
                Upgrade
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Account Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="p-6 rounded-2xl glass glass-hover text-center">
          <div className="text-3xl font-bold text-accent-cyan mb-2">12</div>
          <div className="text-gray-300">Personas Created</div>
        </div>
        <div className="p-6 rounded-2xl glass glass-hover text-center">
          <div className="text-3xl font-bold text-accent-pink mb-2">156</div>
          <div className="text-gray-300">Conversations</div>
        </div>
        <div className="p-6 rounded-2xl glass glass-hover text-center">
          <div className="text-3xl font-bold text-accent-purple mb-2">24h</div>
          <div className="text-gray-300">Time Spent</div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSection;