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
import { Persona } from '../types';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

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
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Help & Support</h2>
            <p className="text-gray-400">Help documentation coming soon...</p>
          </div>
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
        onTabChange={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
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
          {renderContent()}
        </div>
      </motion.main>

      <MemoryCreator 
        isOpen={showMemoryCreator} 
        onClose={() => setShowMemoryCreator(false)} 
      />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default AppLayout;