import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import PersonaGrid from './components/PersonaGrid';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import IntroPage from './components/IntroPage';
import AppLayout from './components/AppLayout';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [showIntro, setShowIntro] = useState(true);
  const [showApp, setShowApp] = useState(false);

  // Handle intro completion
  const handleIntroComplete = () => {
    setShowIntro(false);
    setShowApp(true);
  };

  // For demo purposes, show the app layout when user clicks "Start a Memory"
  const handleStartApp = () => {
    setShowIntro(false);
    setShowApp(true);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-xl bg-gradient-premium p-0.5"
        >
          <div className="w-full h-full rounded-xl bg-obsidian-800"></div>
        </motion.div>
      </div>
    );
  }

  // Show main app layout if authenticated
  if (isAuthenticated) {
    return <AppLayout />;
  }

  // Show intro page first for non-authenticated users
  if (showIntro) {
    return <IntroPage onEnterApp={handleIntroComplete} />;
  }

  // Show landing page with auth integration
  return (
    <div className="min-h-screen bg-obsidian-950 overflow-x-hidden">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(13, 15, 22, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
      
      <Header />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Hero onStartApp={handleStartApp} />
        <PersonaGrid onStartChat={() => {}} onCreateMemory={handleStartApp} />
        <Features />
        <Testimonials />
        <CTA onStartApp={handleStartApp} />
      </motion.main>
      
      <Footer />
    </div>
  );
}

export default App;