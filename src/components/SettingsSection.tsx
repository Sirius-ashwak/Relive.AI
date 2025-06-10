import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Volume2, 
  Download,
  Trash2,
  Key,
  Database
} from 'lucide-react';
import toast from 'react-hot-toast';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sound: boolean;
  conversation: boolean;
}

interface PrivacySettings {
  dataCollection: boolean;
  analytics: boolean;
  shareUsage: boolean;
}

interface AppearanceSettings {
  animations: boolean;
  compactMode: boolean;
}

interface VoiceSettings {
  enabled: boolean;
  autoPlay: boolean;
  volume: number;
}

interface SettingsState {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  appearance: AppearanceSettings;
  voice: VoiceSettings;
}

const SettingsSection: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      email: true,
      push: false,
      sound: true,
      conversation: true
    },
    privacy: {
      dataCollection: false,
      analytics: true,
      shareUsage: false
    },
    appearance: {
      animations: true,
      compactMode: false
    },
    voice: {
      enabled: true,
      autoPlay: false,
      volume: 75
    }
  });

  const handleToggle = (category: keyof SettingsState, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !(prev[category] as any)[setting]
      }
    }));
    toast.success('Setting updated');
  };

  const handleSliderChange = (value: number) => {
    setSettings(prev => ({
      ...prev,
      voice: {
        ...prev.voice,
        volume: value
      }
    }));
  };

  const ToggleSwitch: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
        enabled ? 'bg-gradient-aurora' : 'bg-gray-600'
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 24 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
      />
    </motion.button>
  );

  const settingSections = [
    {
      title: 'Notifications',
      icon: Bell,
      category: 'notifications' as keyof SettingsState,
      items: [
        { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
        { key: 'push', label: 'Push Notifications', description: 'Browser notifications' },
        { key: 'sound', label: 'Sound Effects', description: 'Audio feedback for actions' },
        { key: 'conversation', label: 'Conversation Alerts', description: 'Notify when personas respond' }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      category: 'privacy' as keyof SettingsState,
      items: [
        { key: 'dataCollection', label: 'Data Collection', description: 'Allow anonymous usage data' },
        { key: 'analytics', label: 'Analytics', description: 'Help improve the app' },
        { key: 'shareUsage', label: 'Share Usage Stats', description: 'Share with development team' }
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      category: 'appearance' as keyof SettingsState,
      items: [
        { key: 'animations', label: 'Animations', description: 'Enable smooth transitions' },
        { key: 'compactMode', label: 'Compact Mode', description: 'Reduce spacing and padding' }
      ]
    },
    {
      title: 'Voice & Audio',
      icon: Volume2,
      category: 'voice' as keyof SettingsState,
      items: [
        { key: 'enabled', label: 'Voice Responses', description: 'Enable AI voice generation' },
        { key: 'autoPlay', label: 'Auto-play Audio', description: 'Automatically play voice messages' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-sora text-4xl font-bold mb-4">
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-xl text-gray-300">
          Customize your Relive experience
        </p>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + sectionIndex * 0.1 }}
            className="p-6 rounded-2xl glass glass-hover"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-aurora p-0.5">
                <div className="w-full h-full rounded-xl bg-dark-400 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <h2 className="font-sora text-xl font-semibold text-white">{section.title}</h2>
            </div>

            <div className="space-y-4">
              {section.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl glass">
                  <div>
                    <h3 className="font-medium text-white">{item.label}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                  <ToggleSwitch
                    enabled={(settings[section.category] as any)[item.key]}
                    onToggle={() => handleToggle(section.category, item.key)}
                  />
                </div>
              ))}

              {/* Volume Slider for Voice section */}
              {section.title === 'Voice & Audio' && (
                <div className="p-4 rounded-xl glass">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-white">Volume Level</h3>
                      <p className="text-sm text-gray-400">Adjust voice playback volume</p>
                    </div>
                    <span className="text-accent-cyan font-semibold">{settings.voice.volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.voice.volume}
                    onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advanced Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-2xl glass glass-hover"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-aurora p-0.5">
            <div className="w-full h-full rounded-xl bg-dark-400 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="font-sora text-xl font-semibold text-white">Advanced</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 rounded-xl glass glass-hover text-left"
          >
            <Download className="w-5 h-5 text-accent-cyan" />
            <div>
              <div className="font-medium text-white">Export Data</div>
              <div className="text-sm text-gray-400">Download your conversations</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 rounded-xl glass glass-hover text-left"
          >
            <Key className="w-5 h-5 text-accent-pink" />
            <div>
              <div className="font-medium text-white">API Keys</div>
              <div className="text-sm text-gray-400">Manage external integrations</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 rounded-xl glass glass-hover text-left"
          >
            <Database className="w-5 h-5 text-accent-purple" />
            <div>
              <div className="font-medium text-white">Storage</div>
              <div className="text-sm text-gray-400">Manage local data</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 rounded-xl glass glass-hover text-left text-red-400"
          >
            <Trash2 className="w-5 h-5" />
            <div>
              <div className="font-medium">Delete Account</div>
              <div className="text-sm text-gray-400">Permanently remove data</div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsSection;