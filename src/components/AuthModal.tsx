import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Brain, Sparkles, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { login, register, isLoading } = useAuthStore();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back! 🎉');
      } else {
        await register(formData.email, formData.password, formData.name);
        toast.success('Account created successfully! 🎉');
      }
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Auth error:', error);
      
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else if (error.message?.includes('User already registered')) {
        toast.error('An account with this email already exists');
      } else if (error.message?.includes('Email not confirmed')) {
        toast.error('Please check your email and confirm your account');
      } else if (error.message?.includes('Password should be at least 6 characters')) {
        toast.error('Password must be at least 6 characters long');
      } else {
        toast.error(error.message || 'Authentication failed. Please try again.');
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '' });
    setErrors({});
    setShowPassword(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-obsidian-900 rounded-3xl p-8 glass border border-white/20"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center">
              <Brain className="w-6 h-6 text-obsidian-900" />
            </div>
            <div>
              <h2 className="font-manrope text-2xl font-bold text-white">
                {isLogin ? 'Welcome Back' : 'Join Relive'}
              </h2>
              <p className="text-obsidian-400 text-sm">
                {isLogin ? 'Sign in to your account' : 'Create your account'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 rounded-xl glass glass-hover disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Info */}
        <div className="mb-6 p-4 rounded-xl bg-aurora-500/10 border border-aurora-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-aurora-400" />
            <p className="text-aurora-300 text-sm font-medium">Quick Start</p>
          </div>
          <p className="text-aurora-200 text-xs">
            {isLogin 
              ? 'Sign in to access your memory companions and continue conversations.'
              : 'Create a free account to start building your first AI memory persona.'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name field (signup only) */}
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-obsidian-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-obsidian-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border transition-all duration-300 text-white placeholder-obsidian-400 ${
                      errors.name ? 'border-coral-500/50' : 'border-white/10 focus:border-aurora-400/50'
                    } focus:outline-none`}
                  />
                </div>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-coral-400 text-sm mt-1 flex items-center space-x-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.name}</span>
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-obsidian-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-obsidian-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border transition-all duration-300 text-white placeholder-obsidian-400 ${
                  errors.email ? 'border-coral-500/50' : 'border-white/10 focus:border-aurora-400/50'
                } focus:outline-none`}
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-coral-400 text-sm mt-1 flex items-center space-x-1"
              >
                <AlertCircle className="w-3 h-3" />
                <span>{errors.email}</span>
              </motion.p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-obsidian-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-obsidian-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                className={`w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border transition-all duration-300 text-white placeholder-obsidian-400 ${
                  errors.password ? 'border-coral-500/50' : 'border-white/10 focus:border-aurora-400/50'
                } focus:outline-none`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-obsidian-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-coral-400 text-sm mt-1 flex items-center space-x-1"
              >
                <AlertCircle className="w-3 h-3" />
                <span>{errors.password}</span>
              </motion.p>
            )}
            {!isLogin && !errors.password && (
              <p className="text-obsidian-400 text-xs mt-1">
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-premium text-obsidian-900 font-bold py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
              </>
            ) : (
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            )}
          </motion.button>
        </form>

        {/* Toggle between login/signup */}
        <div className="mt-6 text-center">
          <p className="text-obsidian-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setFormData({ email: '', password: '', name: '' });
              }}
              disabled={isLoading}
              className="ml-2 text-aurora-400 hover:text-aurora-300 font-medium transition-colors disabled:opacity-50"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Features preview */}
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-white text-sm font-medium mb-2">What you'll get:</p>
          <ul className="text-obsidian-300 text-xs space-y-1">
            <li>• Create unlimited memory personas</li>
            <li>• Have natural AI conversations</li>
            <li>• Preserve memories forever</li>
            <li>• Connect with past and future selves</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;