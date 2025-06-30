import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuthStore();

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

    if (!isLogin && !formData.name) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
        onClose();
      } else {
        await register(formData.email, formData.password, formData.name);
        toast.success('Account created successfully!');
        onClose();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Handle specific Supabase errors
      if (error.message?.includes('Invalid login credentials')) {
        if (isLogin) {
          setErrors({ 
            general: 'Invalid email or password. Please check your credentials or sign up for a new account.' 
          });
        } else {
          setErrors({ 
            general: 'Unable to create account. Please try again.' 
          });
        }
      } else if (error.message?.includes('User already registered')) {
        setErrors({ 
          general: 'An account with this email already exists. Please sign in instead.' 
        });
        setIsLogin(true);
      } else if (error.message?.includes('Email not confirmed')) {
        setErrors({ 
          general: 'Please check your email and click the confirmation link before signing in.' 
        });
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        setErrors({ 
          general: 'Connection error. Please check your internet connection and try again.' 
        });
      } else {
        setErrors({ 
          general: isLogin 
            ? 'Sign in failed. Please check your credentials or create a new account.' 
            : 'Account creation failed. Please try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ email: '', password: '', name: '' });
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      // Use demo credentials that should work
      await login('demo@relive.ai', 'demo123456');
      toast.success('Welcome to the demo!');
      onClose();
    } catch (error) {
      // If demo login fails, create a demo account
      try {
        await register('demo@relive.ai', 'demo123456', 'Demo User');
        toast.success('Demo account created! Welcome!');
        onClose();
      } catch (registerError) {
        toast.error('Demo mode unavailable. Please create your own account.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-obsidian-900 rounded-3xl p-8 glass border border-white/20"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-manrope text-2xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-obsidian-300 mt-1">
              {isLogin ? 'Sign in to continue your journey' : 'Start your memory journey today'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl glass glass-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-coral-500/10 border border-coral-500/20 flex items-start space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-coral-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-coral-400 font-medium text-sm">Authentication Error</p>
                <p className="text-coral-300 text-sm mt-1">{errors.general}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-obsidian-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-obsidian-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border transition-all duration-300 text-white placeholder-obsidian-400 ${
                    errors.name ? 'border-coral-500/50' : 'border-white/10 focus:border-aurora-400/50'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="text-coral-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>
          )}

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
                className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border transition-all duration-300 text-white placeholder-obsidian-400 ${
                  errors.email ? 'border-coral-500/50' : 'border-white/10 focus:border-aurora-400/50'
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="text-coral-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

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
                className={`w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border transition-all duration-300 text-white placeholder-obsidian-400 ${
                  errors.password ? 'border-coral-500/50' : 'border-white/10 focus:border-aurora-400/50'
                }`}
                placeholder="Enter your password"
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
              <p className="text-coral-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full btn-premium text-obsidian-900 font-bold py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-obsidian-900 border-t-transparent rounded-full"
                />
                <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Demo Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full mt-4 px-6 py-3 glass glass-hover rounded-xl font-semibold text-white border border-white/20 hover:border-aurora-400/50 transition-all duration-300 disabled:opacity-50"
        >
          Try Demo Mode
        </motion.button>

        {/* Switch Mode */}
        <div className="mt-8 text-center">
          <p className="text-obsidian-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            type="button"
            onClick={switchMode}
            className="text-aurora-400 hover:text-aurora-300 font-semibold transition-colors mt-1"
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-obsidian-300 text-sm text-center">
            {isLogin 
              ? "New to Relive? Create an account to start preserving your memories."
              : "Join thousands of users preserving their most precious memories."
            }
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;