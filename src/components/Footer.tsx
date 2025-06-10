import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Twitter, Github, Linkedin, Mail, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
  const links = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Personas', href: '#personas' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'API', href: '#api' }
    ],
    company: [
      { name: 'About', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press', href: '#press' }
    ],
    support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Privacy', href: '#privacy' },
      { name: 'Terms', href: '#terms' },
      { name: 'Contact', href: '#contact' }
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: '#twitter', label: 'Twitter' },
    { icon: Github, href: '#github', label: 'GitHub' },
    { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
    { icon: Mail, href: '#email', label: 'Email' }
  ];

  return (
    <footer className="relative pt-24 pb-12 px-6 aurora-bg border-t border-white/5">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-aurora-500/10 to-lavender-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-premium p-0.5">
                <div className="w-full h-full rounded-xl bg-obsidian-800 flex items-center justify-center">
                  <Brain className="w-7 h-7 text-white" />
                </div>
              </div>
              <span className="font-sora font-bold text-2xl gradient-text">
                Relive
              </span>
            </div>
            
            <p className="text-obsidian-200 leading-relaxed mb-8 max-w-md text-shadow">
              The premium AI Memory Companion that lets you have sophisticated conversations 
              with replicas of people you know and past versions of yourself.
            </p>

            {/* Social links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl glass glass-hover"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links sections */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="font-sora font-semibold text-white mb-6 text-shadow">Product</h4>
              <ul className="space-y-4">
                {links.product.map((link, index) => (
                  <li key={index}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5, color: '#0EA5E9' }}
                      className="text-obsidian-300 hover:text-aurora-400 transition-colors"
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="font-sora font-semibold text-white mb-6 text-shadow">Company</h4>
              <ul className="space-y-4">
                {links.company.map((link, index) => (
                  <li key={index}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5, color: '#0EA5E9' }}
                      className="text-obsidian-300 hover:text-aurora-400 transition-colors"
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="font-sora font-semibold text-white mb-6 text-shadow">Support</h4>
              <ul className="space-y-4">
                {links.support.map((link, index) => (
                  <li key={index}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5, color: '#0EA5E9' }}
                      className="text-obsidian-300 hover:text-aurora-400 transition-colors"
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Newsletter signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12 card-premium"
        >
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-aurora-400" />
              <h3 className="font-sora text-2xl font-semibold text-white text-shadow">
                Stay Connected
              </h3>
            </div>
            <p className="text-obsidian-200 mb-6 text-shadow">
              Get updates on new features, memory preservation tips, and exclusive access to beta releases.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-premium"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-premium text-obsidian-900 font-bold"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
        >
          <p className="text-obsidian-300 text-sm">
            © 2025 Relive. All rights reserved.
          </p>
          
          <motion.div
            className="flex items-center space-x-2 text-obsidian-300 text-sm"
            whileHover={{ scale: 1.05 }}
          >
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-coral-400" />
            </motion.div>
            <span>for preserving memories</span>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;