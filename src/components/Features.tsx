import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Mic, Video, Shield, Clock, Heart, Sparkles } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Memory Intelligence",
      description: "Advanced AI that learns and remembers every conversation, building deeper connections over time.",
      gradient: "from-aurora-500/20 to-coral-500/20"
    },
    {
      icon: Video,
      title: "Real-time Avatars",
      description: "Live video conversations with lifelike avatars that look and speak like your loved ones.",
      gradient: "from-coral-500/20 to-lavender-500/20"
    },
    {
      icon: Mic,
      title: "Voice Cloning",
      description: "Preserve authentic voices with advanced cloning technology for natural conversations.",
      gradient: "from-lavender-500/20 to-aurora-500/20"
    },
    {
      icon: Clock,
      title: "Time Travel Conversations",
      description: "Talk to past versions of yourself or envision conversations with your future self.",
      gradient: "from-aurora-500/20 to-lavender-500/20"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your memories are encrypted and stored securely with enterprise-grade protection.",
      gradient: "from-coral-500/20 to-aurora-500/20"
    },
    {
      icon: Heart,
      title: "Emotional Healing",
      description: "Process grief, celebrate memories, and find closure through meaningful conversations.",
      gradient: "from-lavender-500/20 to-coral-500/20"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.6, 0.01, 0.05, 0.9] }
    }
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-aurora-500/10 to-lavender-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 180, 90]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-coral-500/10 to-aurora-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4 text-lavender-400" />
            <span>Advanced Technology</span>
          </motion.div>

          <h2 className="font-sora text-4xl md:text-6xl font-bold mb-6 text-shadow-lg">
            <span className="gradient-text">Redefining</span>
            <br />
            <span className="text-white">Memory & Connection</span>
          </h2>

          <p className="text-xl text-obsidian-200 max-w-3xl mx-auto leading-relaxed text-shadow">
            Cutting-edge AI technology that creates authentic, meaningful conversations 
            with the people and memories that matter most to you.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className={`group relative card-premium bg-gradient-to-br ${feature.gradient} overflow-hidden`}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.8 }}
                />
              </div>

              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-premium p-0.5 mb-6"
                >
                  <div className="w-full h-full rounded-2xl bg-obsidian-800 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                <h3 className="font-sora text-xl font-semibold text-white mb-4 group-hover:text-aurora-300 transition-colors text-shadow">
                  {feature.title}
                </h3>

                <p className="text-obsidian-200 leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom Accent Line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-premium rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;