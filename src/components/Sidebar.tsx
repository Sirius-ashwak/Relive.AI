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
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

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
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
    }
  };

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
      {/* Scrollable container */}
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-4">
          <div className="flex items-center justify-between mb-8">
            <motion.div 
              className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center">
                <Brain className="w-6 h-6 text-obsidian-900" />
              </div>
              {!isCollapsed && (
                <span className="font-manrope font-bold text-xl gradient-text">
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
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4">
          <div className="flex flex-col h-full">
            {/* Main Navigation - Scrollable */}
            <nav className="flex-1 space-y-2 mb-6">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-premium text-obsidian-900 font-semibold'
                      : 'glass glass-hover text-white hover:text-aurora-400'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className={`text-xs ${
                        activeTab === item.id ? 'text-obsidian-600' : 'text-obsidian-400'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Bottom Navigation - Fixed at bottom */}
            <div className="flex-shrink-0 space-y-2 border-t border-white/10 pt-4">
              {bottomItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-premium text-obsidian-900 font-semibold'
                      : 'glass glass-hover text-white hover:text-aurora-400'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className={`text-xs ${
                        activeTab === item.id ? 'text-obsidian-600' : 'text-obsidian-400'
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
                onClick={handleLogout}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl glass glass-hover text-coral-400 hover:text-coral-300 transition-all duration-200 ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">Sign Out</span>}
              </motion.button>

              {/* Collapse Toggle for collapsed state */}
              {isCollapsed && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onToggleCollapse}
                  className="w-full p-3 rounded-xl glass glass-hover flex justify-center"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;