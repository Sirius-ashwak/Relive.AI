import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Persona } from '../types';
import { validateApiKeys, getApiKeyStatus } from '../config/api';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const AppLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMemoryCreator, setShowMemoryCreator] = useState(false);
  const [activeChatPersona, setActiveChatPersona] = useState<Persona | null>(null);
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [showApiWarning, setShowApiWarning] = useState(false);

  useEffect(() => {
    // Check API key status on mount
    const status = getApiKeyStatus();
    setApiStatus(status);
    
    // Show warning if Gemini API key is missing
    if (!status.gemini) {
      setShowApiWarning(true);
      setTimeout(() => setShowApiWarning(false), 10000); // Hide after 10 seconds
    }
  }, []);

  const handleStartChat = (persona: Persona) => {
    setActiveChatPersona(persona);
  };

  const handleCloseChat = () => {
    setActiveChatPersona(null);
  };

  const handleCreateMemory = () => {
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
            <p className="text-gray-400 mb-8">Get help with using Relive AI Memory Companion</p>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="card-premium text-left">
                <h3 className="font-semibold text-white mb-3">API Configuration</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {apiStatus?.gemini ? (
                      <CheckCircle className="w-4 h-4 text-sage-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-coral-400" />
                    )}
                    <span className="text-sm">Gemini AI (Required for conversations)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {apiStatus?.elevenlabs ? (
                      <CheckCircle className="w-4 h-4 text-sage-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-obsidian-400" />
                    )}
                    <span className="text-sm">ElevenLabs (Optional - Voice cloning)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {apiStatus?.tavus ? (
                      <CheckCircle className="w-4 h-4 text-sage-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-obsidian-400" />
                    )}
                    <span className="text-sm">Tavus (Optional - Video avatars)</span>
                  </div>
                </div>
              </div>
              
              <div className="card-premium text-left">
                <h3 className="font-semibold text-white mb-3">Getting Started</h3>
                <ol className="text-sm text-obsidian-300 space-y-2">
                  <li>1. Add your Gemini API key to the .env file</li>
                  <li>2. Create your first memory persona</li>
                  <li>3. Start having conversations</li>
                  <li>4. Explore advanced features like voice and video</li>
                </ol>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard onStartChat={handleStartChat} onCreateMemory={handleCreateMemory} />;
    }
  };

  if (activeChatPersona) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="chat"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <ChatInterface persona={activeChatPersona} onClose={handleCloseChat} />
        </motion.div>
      </AnimatePresence>
    );
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

      {/* API Warning */}
      <AnimatePresence>
        {showApiWarning && !apiStatus?.gemini && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md"
          >
            <div className="bg-coral-500/20 border border-coral-500/50 rounded-xl p-4 backdrop-blur-xl">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-coral-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">API Key Required</p>
                  <p className="text-xs text-coral-200">Add your Gemini API key to .env for full functionality</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>

      <AnimatePresence>
        {showMemoryCreator && (
          <MemoryCreator 
            isOpen={showMemoryCreator} 
            onClose={() => setShowMemoryCreator(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;