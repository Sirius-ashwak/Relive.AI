import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import PersonaGrid from './PersonaGrid';
import ConversationsSection from './ConversationsSection';
import ProfileSection from './ProfileSection';
import SettingsSection from './SettingsSection';
import MemoriesSection from './MemoriesSection';
import TimelineSection from './TimelineSection';
import MemoryCreator from './MemoryCreator';
import ChatInterface from './ChatInterface';
import AuthModal from './AuthModal';
import { Database } from '../types/database';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

type Persona = Database['public']['Tables']['personas']['Row'];

const AppLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMemoryCreator, setShowMemoryCreator] = useState(false);
  const [activeChatPersona, setActiveChatPersona] = useState<Persona | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { isAuthenticated, user } = useAuthStore();

  // Check authentication status and show modal if needed
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

  // Show welcome message when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      toast.success(`Welcome back, ${user.name}!`);
    }
  }, [isAuthenticated, user]);

  const handleStartChat = (persona: Persona) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      toast.error('Please sign in to start a conversation');
      return;
    }
    setActiveChatPersona(persona);
  };

  const handleCloseChat = () => {
    setActiveChatPersona(null);
  };

  const handleCreateMemory = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      toast.error('Please sign in to create memories');
      return;
    }
    setShowMemoryCreator(true);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Add smooth transition feedback
    toast.success(`Switched to ${tab.charAt(0).toUpperCase() + tab.slice(1)}`, {
      duration: 1500,
      style: {
        background: 'rgba(13, 15, 22, 0.9)',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      },
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onStartChat={handleStartChat} onCreateMemory={handleCreateMemory} />;
      case 'personas':
        return <PersonaGrid onStartChat={handleStartChat} onCreateMemory={handleCreateMemory} />;
      case 'conversations':
        return <ConversationsSection onStartChat={handleStartChat} />;
      case 'profile':
        return <ProfileSection />;
      case 'settings':
        return <SettingsSection />;
      case 'memories':
        return <MemoriesSection />;
      case 'timeline':
        return <TimelineSection />;
      case 'help':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-premium p-0.5 mx-auto mb-6">
              <div className="w-full h-full rounded-2xl bg-obsidian-800 flex items-center justify-center">
                <span className="text-2xl">❓</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Help & Support</h2>
            <p className="text-obsidian-400 mb-6">Need assistance? We're here to help!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toast('Help documentation coming soon!')}
              className="btn-premium text-obsidian-900 font-bold"
            >
              Contact Support
            </motion.button>
          </motion.div>
        );
      default:
        return <Dashboard onStartChat={handleStartChat} onCreateMemory={handleCreateMemory} />;
    }
  };

  if (activeChatPersona) {
    return <ChatInterface persona={activeChatPersona} onClose={handleCloseChat} />;
  }

  return (
    <div className="min-h-screen bg-obsidian-950 flex">
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

      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => {
          setSidebarCollapsed(!sidebarCollapsed);
          toast.success(sidebarCollapsed ? 'Sidebar expanded' : 'Sidebar collapsed', {
            duration: 1500,
          });
        }}
      />

      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-72'
        }`}
      >
        <div className="p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </motion.main>

      <MemoryCreator 
        isOpen={showMemoryCreator} 
        onClose={() => {
          setShowMemoryCreator(false);
          toast('Memory creator closed');
        }} 
      />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default AppLayout;