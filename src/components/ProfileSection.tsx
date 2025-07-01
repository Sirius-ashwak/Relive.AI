import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Crown, Edit3, Save, X, Camera, Check } from 'lucide-react';
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
    toast('Changes cancelled');
  };

  const subscriptionInfo = {
    free: { name: 'Free', color: 'text-obsidian-400', icon: '🆓', bgColor: 'bg-obsidian-500/20' },
    pro: { name: 'Pro', color: 'text-aurora-400', icon: '⭐', bgColor: 'bg-aurora-500/20' },
    legacy: { name: 'Legacy', color: 'text-lavender-400', icon: '👑', bgColor: 'bg-lavender-500/20' }
  };

  const avatarOptions = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧑‍💻', '👨‍🎨', '👩‍🎨', '🧑‍🔬'];

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">No User Found</h2>
        <p className="text-obsidian-400">Please log in to view your profile.</p>
      </div>
    );
  }

  const currentSubscription = subscriptionInfo[user.subscription];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-manrope text-3xl font-bold mb-3">
          <span className="gradient-text">Your Profile</span>
        </h1>
        <p className="text-lg text-obsidian-300">
          Manage your account and preferences
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-manrope text-2xl font-semibold text-white">Account Information</h2>
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-premium rounded-xl font-semibold text-obsidian-900 transition-all duration-300"
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
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-premium rounded-xl font-semibold text-obsidian-900 transition-all duration-300"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-white border border-white/20 transition-all duration-300"
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
                className="w-20 h-20 rounded-2xl bg-gradient-premium p-0.5"
              >
                <div className="w-full h-full rounded-2xl bg-obsidian-800 flex items-center justify-center text-3xl">
                  {isEditing ? editData.avatar : user.avatar}
                </div>
              </motion.div>
              {isEditing && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute -bottom-2 -right-2 p-2 bg-gradient-premium rounded-full cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-obsidian-900" />
                </motion.div>
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
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-300 ${
                      editData.avatar === avatar
                        ? 'bg-gradient-premium text-obsidian-900'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    {avatar}
                    {editData.avatar === avatar && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-sage-400 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-2 h-2 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-obsidian-300 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-aurora-400/50 focus:outline-none text-white placeholder-obsidian-400 transition-all duration-300"
                placeholder="Enter your full name"
              />
            ) : (
              <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                {user.name}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-obsidian-300 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-aurora-400/50 focus:outline-none text-white placeholder-obsidian-400 transition-all duration-300"
                placeholder="Enter your email"
              />
            ) : (
              <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                {user.email}
              </div>
            )}
          </div>

          {/* Member Since */}
          <div>
            <label className="block text-sm font-medium text-obsidian-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Member Since
            </label>
            <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
              {user.createdAt.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {/* Subscription */}
          <div>
            <label className="block text-sm font-medium text-obsidian-300 mb-2">
              <Crown className="w-4 h-4 inline mr-2" />
              Subscription
            </label>
            <div className={`px-4 py-3 rounded-xl ${currentSubscription.bgColor} border border-white/10 flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {currentSubscription.icon}
                </span>
                <div>
                  <span className={`font-semibold ${currentSubscription.color}`}>
                    {currentSubscription.name} Plan
                  </span>
                  <p className="text-xs text-obsidian-400 mt-1">
                    {user.subscription === 'free' ? 'Basic features included' : 
                     user.subscription === 'pro' ? 'Advanced features unlocked' : 
                     'Premium features & priority support'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toast('Subscription management coming soon!')}
                className="px-4 py-2 bg-gradient-premium rounded-lg font-semibold text-obsidian-900 text-sm transition-all duration-300"
              >
                {user.subscription === 'free' ? 'Upgrade' : 'Manage'}
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
        <motion.div 
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-aurora-400/50 text-center transition-all duration-300"
          whileHover={{ y: -2 }}
        >
          <div className="text-3xl font-bold text-aurora-400 mb-2">12</div>
          <div className="text-obsidian-300">Personas Created</div>
        </motion.div>
        <motion.div 
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-coral-400/50 text-center transition-all duration-300"
          whileHover={{ y: -2 }}
        >
          <div className="text-3xl font-bold text-coral-400 mb-2">156</div>
          <div className="text-obsidian-300">Conversations</div>
        </motion.div>
        <motion.div 
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-lavender-400/50 text-center transition-all duration-300"
          whileHover={{ y: -2 }}
        >
          <div className="text-3xl font-bold text-lavender-400 mb-2">24h</div>
          <div className="text-obsidian-300">Time Spent</div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfileSection;