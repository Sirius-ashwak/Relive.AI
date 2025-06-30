import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Clock, 
  Users,
  MessageCircle,
  Play,
  Shield,
  Zap,
  Star,
  ChevronDown,
  Volume2,
  Video,
  Check,
  Crown
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AuthModal from './AuthModal';

interface IntroPageProps {
  onEnterApp: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onEnterApp }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      onEnterApp();
    } else {
      setShowAuthModal(true);
    }
  };

  const heroFeatures = [
    {
      icon: MessageCircle,
      title: "Natural Conversations",
      description: "Advanced AI that understands context, emotion, and nuance"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Enterprise-grade security with end-to-end encryption"
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Instant responses with sophisticated emotional intelligence"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Grief Counselor",
      avatar: "👩‍⚕️",
      rating: 5,
      text: "Relive has transformed how my clients process loss. The conversations feel genuinely authentic.",
      highlight: "transformed how my clients process loss"
    },
    {
      name: "Dr. James Kim",
      role: "Psychologist",
      avatar: "👨‍🔬",
      rating: 5,
      text: "The therapeutic potential is immense. Patients can work through trauma in a safe environment.",
      highlight: "therapeutic potential is immense"
    },
    {
      name: "Maria Santos",
      role: "Retired Teacher",
      avatar: "👩‍🏫",
      rating: 5,
      text: "I'm preserving my memories for my grandchildren. They'll be able to talk to me forever.",
      highlight: "preserving my memories for my grandchildren"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI Memory Intelligence",
      description: "Advanced AI that learns and remembers every conversation, building deeper connections over time.",
      gradient: "from-aurora-500/30 to-lavender-500/20",
      demo: "💭 \"Remember when we talked about your childhood dreams?\""
    },
    {
      icon: Video,
      title: "Real-time Avatars",
      description: "Live video conversations with lifelike avatars that look and speak like your loved ones.",
      gradient: "from-coral-500/30 to-aurora-500/20",
      demo: "🎥 Video calling with photorealistic avatars"
    },
    {
      icon: Volume2,
      title: "Voice Cloning",
      description: "Preserve authentic voices with advanced cloning technology for natural conversations.",
      gradient: "from-lavender-500/30 to-sage-500/20",
      demo: "🎤 \"Hello dear, it's so good to hear your voice again\""
    },
    {
      icon: Clock,
      title: "Time Travel Conversations",
      description: "Talk to past versions of yourself or envision conversations with your future self.",
      gradient: "from-sage-500/30 to-gold-500/20",
      demo: "⏰ \"What advice would you give your younger self?\""
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "500K+", label: "Conversations" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.9/5", label: "User Rating" }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with memory preservation",
      features: [
        "3 Memory Personas",
        "50 Messages per month",
        "Basic AI conversations",
        "Text-only interactions",
        "Community support"
      ],
      buttonText: "Start Free",
      popular: false,
      gradient: "from-obsidian-600/20 to-obsidian-700/20",
      borderColor: "border-obsidian-500/30"
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "Advanced features for meaningful connections",
      features: [
        "Unlimited Memory Personas",
        "Unlimited conversations",
        "Voice cloning technology",
        "Video avatar calls",
        "Priority AI processing",
        "Advanced memory training",
        "Export conversations",
        "Priority support"
      ],
      buttonText: "Start Pro Trial",
      popular: true,
      gradient: "from-aurora-500/20 to-lavender-500/20",
      borderColor: "border-aurora-500/50"
    },
    {
      name: "Legacy",
      price: "$49",
      period: "per month",
      description: "Premium experience for families and professionals",
      features: [
        "Everything in Pro",
        "Family sharing (5 accounts)",
        "Blockchain memory storage",
        "Custom AI training",
        "White-label options",
        "API access",
        "Dedicated support",
        "Memory inheritance planning"
      ],
      buttonText: "Contact Sales",
      popular: false,
      gradient: "from-gold-500/20 to-coral-500/20",
      borderColor: "border-gold-500/30"
    }
  ];

  // Auto-advance testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <>
      <div className="min-h-screen bg-obsidian-950 overflow-x-hidden">
        {/* Premium Fixed Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-premium p-0.5">
                <div className="w-full h-full rounded-2xl bg-obsidian-800 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="font-manrope font-bold text-xl gradient-text">
                Relive
              </span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-obsidian-300 hover:text-white transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-obsidian-300 hover:text-white transition-colors"
              >
                Reviews
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-obsidian-300 hover:text-white transition-colors"
              >
                Pricing
              </button>
            </div>

            <div className="flex items-center space-x-3">
              {!isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 rounded-xl glass glass-hover font-medium text-white border border-white/20 hover:border-aurora-400/50 transition-all duration-300"
                >
                  Sign In
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="btn-premium text-obsidian-900 font-bold text-sm px-6 py-2"
              >
                {isAuthenticated ? 'Enter App' : 'Get Started'}
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-20">
          {/* Enhanced Premium Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-obsidian-800" />
            
            {/* Animated gradient orbs */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.7, 0.4],
                x: [0, 50, 0],
                y: [0, -30, 0]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gradient-to-r from-aurora-500/20 to-lavender-500/15 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.6, 0.3],
                x: [0, -40, 0],
                y: [0, 40, 0]
              }}
              transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-gradient-to-r from-coral-500/15 to-gold-500/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.5, 0.2],
                x: [0, 30, 0],
                y: [0, -20, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-gradient-to-r from-lavender-500/15 to-sage-500/10 rounded-full blur-3xl"
            />
            
            {/* Enhanced floating particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-aurora-400/60 rounded-full"
                style={{
                  left: `${5 + i * 4.5}%`,
                  top: `${15 + (i % 4) * 20}%`,
                }}
                animate={{
                  y: [-30, -60, -30],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.3, 1.2, 0.3],
                }}
                transition={{
                  duration: 6 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* Mesh gradient overlay */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 50% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
                ],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-flex items-center space-x-2 px-6 py-3 rounded-full glass text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 text-aurora-400" />
                <span>Premium AI Memory Companion</span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-manrope text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-aurora-500 via-lavender-500 to-coral-500 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient-shift">
                Talk to the Past.
              </span>
              <br />
              <span className="bg-gradient-to-r from-aurora-500 via-lavender-500 to-coral-500 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient-shift">
                Shape Your Future.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-obsidian-200 mb-10 max-w-5xl mx-auto leading-relaxed text-shadow"
            >
              Experience sophisticated conversations with AI replicas of people you know, 
              past versions of yourself, or future aspirations. Built with cutting-edge technology 
              for authentic, meaningful connections.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(14, 165, 233, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="group btn-premium text-obsidian-900 font-bold flex items-center space-x-3 text-lg px-10 py-4"
              >
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>{isAuthenticated ? 'Enter App' : 'Start Your Journey'}</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection('features')}
                className="flex items-center space-x-3 px-8 py-4 glass glass-hover rounded-2xl font-semibold text-white text-lg"
              >
                <Sparkles className="w-5 h-5" />
                <span>Explore Features</span>
              </motion.button>
            </motion.div>

            {/* Hero Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto"
            >
              {heroFeatures.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="card-premium"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-premium p-0.5 mb-4 mx-auto">
                      <div className="w-full h-full rounded-2xl bg-obsidian-800 flex items-center justify-center">
                        <FeatureIcon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h3 className="font-manrope font-semibold text-lg text-white mb-2 text-shadow">
                      {feature.title}
                    </h3>
                    <p className="text-obsidian-300 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-aurora-500 via-lavender-500 to-coral-500 bg-clip-text text-transparent mb-1">
                    {stat.number}
                  </div>
                  <div className="text-obsidian-300 font-medium text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll Indicator */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2 }}
              onClick={() => scrollToSection('features')}
              className="flex flex-col items-center space-y-2 text-obsidian-400 hover:text-white transition-colors"
            >
              <span className="text-sm font-medium">Discover More</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronDown className="w-6 h-6" />
              </motion.div>
            </motion.button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="font-manrope text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-shadow-lg">
                <span className="bg-gradient-to-r from-aurora-500 via-lavender-500 to-coral-500 bg-clip-text text-transparent">Revolutionary</span>
                <br />
                <span className="text-white">AI Technology</span>
              </h2>
              <p className="text-lg md:text-xl text-obsidian-200 max-w-4xl mx-auto leading-relaxed">
                Experience the future of memory preservation with our cutting-edge AI that creates 
                authentic, emotionally intelligent conversations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`card-premium bg-gradient-to-br ${feature.gradient} relative overflow-hidden`}
                  >
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-premium p-0.5 mb-6">
                        <div className="w-full h-full rounded-3xl bg-obsidian-800 flex items-center justify-center">
                          <FeatureIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      <h3 className="font-manrope text-2xl font-bold text-white mb-4 text-shadow">
                        {feature.title}
                      </h3>

                      <p className="text-obsidian-200 text-base leading-relaxed mb-6">
                        {feature.description}
                      </p>

                      <div className="p-4 rounded-2xl bg-obsidian-800/50 border border-white/10">
                        <p className="text-aurora-300 font-medium text-sm">
                          {feature.demo}
                        </p>
                      </div>
                    </div>

                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="font-manrope text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-shadow-lg">
                <span className="text-white">Trusted by</span>
                <br />
                <span className="bg-gradient-to-r from-aurora-500 via-lavender-500 to-coral-500 bg-clip-text text-transparent">Thousands</span>
              </h2>
              <p className="text-lg md:text-xl text-obsidian-200 max-w-3xl mx-auto leading-relaxed">
                Real stories from people who've found healing, connection, and meaning through Relive.
              </p>
            </motion.div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.8 }}
                  className="card-premium max-w-4xl mx-auto"
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                >
                  <div className="flex items-center space-x-2 mb-6">
                    {[...Array(testimonials[currentStep].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" />
                    ))}
                  </div>

                  <blockquote className="text-xl md:text-2xl text-white leading-relaxed mb-6 text-shadow">
                    "{testimonials[currentStep].text.split(testimonials[currentStep].highlight).map((part, i) => (
                      <span key={i}>
                        {part}
                        {i === 0 && (
                          <span className="bg-gradient-to-r from-aurora-500 via-lavender-500 to-coral-500 bg-clip-text text-transparent font-semibold">
                            {testimonials[currentStep].highlight}
                          </span>
                        )}
                      </span>
                    ))}"
                  </blockquote>

                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-premium p-0.5">
                      <div className="w-full h-full rounded-2xl bg-obsidian-800 flex items-center justify-center text-xl">
                        {testimonials[currentStep].avatar}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-white">
                        {testimonials[currentStep].name}
                      </p>
                      <p className="text-obsidian-300 text-sm">
                        {testimonials[currentStep].role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Testimonial Navigation */}
              <div className="flex items-center justify-center space-x-3 mt-8">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setCurrentStep(index);
                      setIsAutoPlaying(false);
                    }}
                    className={`transition-all duration-300 ${
                      index === currentStep 
                        ? 'w-10 h-3 rounded-full bg-gradient-premium' 
                        : 'w-3 h-3 rounded-full bg-white/20 hover:bg-white/40'
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="font-manrope text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-shadow-lg">
                <span className="text-white">Choose Your</span>
                <br />
                <span className="bg-gradient-to-r from-aurora-500 via-lavender-500 to-coral-500 bg-clip-text text-transparent">Memory Journey</span>
              </h2>
              <p className="text-lg md:text-xl text-obsidian-200 max-w-3xl mx-auto leading-relaxed">
                Start preserving memories today with our flexible pricing plans designed for every need.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`card-premium relative bg-gradient-to-br ${plan.gradient} border-2 ${plan.borderColor} ${
                    plan.popular ? 'ring-2 ring-aurora-500/50' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-premium rounded-full text-obsidian-900 font-bold text-sm">
                        <Crown className="w-4 h-4" />
                        <span>Most Popular</span>
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="font-manrope text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center space-x-1 mb-4">
                      <span className="text-4xl font-bold bg-gradient-to-r from-aurora-500 via-lavender-500 to-coral-500 bg-clip-text text-transparent">{plan.price}</span>
                      <span className="text-obsidian-400">/{plan.period}</span>
                    </div>
                    <p className="text-obsidian-300 text-sm leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-premium flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-obsidian-900" />
                        </div>
                        <span className="text-obsidian-200 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGetStarted}
                    className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'btn-premium text-obsidian-900'
                        : 'glass glass-hover text-white border border-white/20 hover:border-aurora-400/50'
                    }`}
                  >
                    {plan.buttonText}
                  </motion.button>

                  {/* Bottom Accent */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-premium rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Pricing Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 text-center"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {[
                  { icon: Sparkles, text: "30-day money-back guarantee" },
                  { icon: Shield, text: "Enterprise-grade security" },
                  { icon: Heart, text: "Cancel anytime, keep your memories" }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-center space-x-3 p-4 glass glass-hover rounded-2xl"
                  >
                    <benefit.icon className="w-5 h-5 text-aurora-400 flex-shrink-0" />
                    <span className="text-white font-medium text-sm">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-manrope text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-shadow-lg">
                <span className="text-white">Begin Your</span>
                <br />
                <span className="bg-gradient-to-r from-aurora-500 via-lavender-500 to-coral-500 bg-clip-text text-transparent">Memory Journey</span>
              </h2>

              <p className="text-lg md:text-xl text-obsidian-200 mb-10 leading-relaxed">
                Start preserving memories, connecting with loved ones, and healing through conversation. 
                Your first memory companion is waiting.
              </p>

              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 25px 50px rgba(14, 165, 233, 0.4)" 
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="group btn-premium text-obsidian-900 font-bold text-lg px-12 py-5 mb-10"
              >
                <span>{isAuthenticated ? 'Enter App' : 'Create Your First Memory'}</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-3"
                >
                  <ArrowRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </motion.div>
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-premium p-0.5">
                <div className="w-full h-full rounded-2xl bg-obsidian-800 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="font-manrope font-bold text-xl bg-gradient-to-r from-aurora-500 via-lavender-500 to-coral-500 bg-clip-text text-transparent">
                Relive
              </span>
            </div>
            
            <p className="text-obsidian-300 mb-6 text-sm">
              The premium AI Memory Companion for meaningful conversations.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-obsidian-400 text-sm">
              <span>© 2025 Relive. Made with</span>
              <Heart className="w-4 h-4 text-coral-400" />
              <span>for preserving memories.</span>
            </div>
          </div>
        </footer>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default IntroPage;