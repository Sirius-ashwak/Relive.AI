import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Clock, Shield } from 'lucide-react';

interface CTAProps {
  onStartApp?: () => void;
}

const CTA: React.FC<CTAProps> = ({ onStartApp }) => {
  const benefits = [
    {
      icon: Sparkles,
      text: "Start for free, no credit card required"
    },
    {
      icon: Clock,
      text: "Setup your first memory in under 5 minutes"
    },
    {
      icon: Shield,
      text: "Enterprise-grade security and privacy"
    }
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 aurora-bg">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-accent-pink/20 to-accent-cyan/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent-pink" />
            <span>Ready to start your journey?</span>
          </motion.div>

          <h2 className="font-sora text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Begin Your</span>
            <br />
            <span className="gradient-text">Memory Journey</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Start preserving memories, connecting with loved ones, and healing through conversation. 
            Your first memory companion is waiting.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 25px 50px rgba(94, 241, 255, 0.4)" 
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartApp}
            className="group flex items-center space-x-3 px-8 py-4 bg-gradient-aurora rounded-2xl font-bold text-lg text-dark-500 transition-all duration-300"
          >
            <span>Create Your First Memory</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </motion.div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 px-8 py-4 glass glass-hover rounded-2xl font-semibold text-lg text-white border border-white/20 hover:border-accent-cyan/50 transition-all duration-300"
          >
            <span>Watch Demo</span>
          </motion.button>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex items-center space-x-3 p-4 rounded-2xl glass glass-hover"
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-8 h-8 rounded-lg bg-gradient-aurora flex items-center justify-center flex-shrink-0"
              >
                <benefit.icon className="w-4 h-4 text-dark-500" />
              </motion.div>
              <span className="text-white text-sm font-medium">
                {benefit.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 inline-flex items-center space-x-2 px-4 py-2 rounded-full glass text-sm text-gray-400"
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span>Trusted by 10,000+ users worldwide</span>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;