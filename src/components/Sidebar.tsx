import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  MessageCircle, 
  Users, 
  Settings, 
  User, 
  History, 
  Heart,
  Sparkles,
  HelpCircle,
  LogOut,
  LayoutDashboard
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview and quick access'
    },
    {
      id: 'personas',
      label: 'Personas',
      icon: Users,
      description: 'Manage your memory companions'
    },
    {
      id: 'conversations',
      label: 'Conversations',
      icon: MessageCircle,
      description: 'Chat history and active talks'
    },
    {
      id: 'memories',
      label: 'Memories',
      icon: Heart,
      description: 'Preserved moments and stories'
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: History,
      description: 'Your memory journey'
    }
  ];

  const bottomItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Account and preferences'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'App configuration'
    },
    {
      id: 'help',
      label: 'Help',
      icon: HelpCircle,
      description: 'Support and guides'
    }
  ];

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`fixed left-0 top-0 h-full z-40 glass border-r border-white/10 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className="flex flex-col h-full p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div 
            className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-aurora flex items-center justify-center">
              <Brain className="w-6 h-6 text-dark-500" />
            </div>
            {!isCollapsed && (
              <span className="font-sora font-bold text-xl gradient-text">
                Relive
              </span>
            )}
          </motion.div>
          
          {!isCollapsed && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleCollapse}
              className="p-2 rounded-lg glass glass-hover"
            >
              <Sparkles className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-2">
          {navigationItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-aurora text-dark-500 font-semibold'
                  : 'glass glass-hover text-white hover:text-accent-cyan'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${
                    activeTab === item.id ? 'text-dark-400' : 'text-gray-400'
                  }`}>
                    {item.description}
                  </div>
                </div>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="space-y-2 border-t border-white/10 pt-4">
          {bottomItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-aurora text-dark-500 font-semibold'
                  : 'glass glass-hover text-white hover:text-accent-cyan'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${
                    activeTab === item.id ? 'text-dark-400' : 'text-gray-400'
                  }`}>
                    {item.description}
                  </div>
                </div>
              )}
            </motion.button>
          ))}
          
          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl glass glass-hover text-red-400 hover:text-red-300 ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Sign Out</span>}
          </motion.button>
        </div>

        {/* Collapse Toggle */}
        {isCollapsed && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleCollapse}
            className="mt-4 p-3 rounded-xl glass glass-hover mx-auto"
          >
            <Sparkles className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;