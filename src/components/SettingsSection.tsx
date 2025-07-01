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
  Database,
  Check,
  X
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
    toast.success('Setting updated successfully!');
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
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
        enabled ? 'bg-gradient-premium' : 'bg-obsidian-600'
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 24 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg flex items-center justify-center"
      >
        {enabled ? (
          <Check className="w-2 h-2 text-aurora-500" />
        ) : (
          <X className="w-2 h-2 text-obsidian-400" />
        )}
      </motion.div>
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
        <h1 className="font-manrope text-3xl font-bold mb-3">
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-lg text-obsidian-300">
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
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-premium p-0.5">
                <div className="w-full h-full rounded-xl bg-obsidian-800 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <h2 className="font-manrope text-xl font-semibold text-white">{section.title}</h2>
            </div>

            <div className="space-y-4">
              {section.items.map((item) => (
                <motion.div 
                  key={item.key} 
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.01 }}
                >
                  <div>
                    <h3 className="font-medium text-white">{item.label}</h3>
                    <p className="text-sm text-obsidian-400">{item.description}</p>
                  </div>
                  <ToggleSwitch
                    enabled={(settings[section.category] as any)[item.key]}
                    onToggle={() => handleToggle(section.category, item.key)}
                  />
                </motion.div>
              ))}

              {/* Volume Slider for Voice section */}
              {section.title === 'Voice & Audio' && (
                <motion.div 
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-white">Volume Level</h3>
                      <p className="text-sm text-obsidian-400">Adjust voice playback volume</p>
                    </div>
                    <span className="text-aurora-400 font-semibold">{settings.voice.volume}%</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.voice.volume}
                      onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-obsidian-600 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #0EA5E9 0%, #0EA5E9 ${settings.voice.volume}%, #495057 ${settings.voice.volume}%, #495057 100%)`
                      }}
                    />
                  </div>
                </motion.div>
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
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-premium p-0.5">
            <div className="w-full h-full rounded-xl bg-obsidian-800 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="font-manrope text-xl font-semibold text-white">Advanced</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast.success('Export feature coming soon!')}
            className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-aurora-400/50 text-left transition-all duration-300"
          >
            <Download className="w-5 h-5 text-aurora-400" />
            <div>
              <div className="font-medium text-white">Export Data</div>
              <div className="text-sm text-obsidian-400">Download your conversations</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast.info('API Keys management coming soon!')}
            className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-coral-400/50 text-left transition-all duration-300"
          >
            <Key className="w-5 h-5 text-coral-400" />
            <div>
              <div className="font-medium text-white">API Keys</div>
              <div className="text-sm text-obsidian-400">Manage external integrations</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast.info('Storage management coming soon!')}
            className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-lavender-400/50 text-left transition-all duration-300"
          >
            <Database className="w-5 h-5 text-lavender-400" />
            <div>
              <div className="font-medium text-white">Storage</div>
              <div className="text-sm text-obsidian-400">Manage local data</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                toast.error('Account deletion is not available in demo mode');
              }
            }}
            className="flex items-center space-x-3 p-4 rounded-xl bg-coral-500/10 border border-coral-500/30 hover:border-coral-500/50 text-left transition-all duration-300"
          >
            <Trash2 className="w-5 h-5 text-coral-400" />
            <div>
              <div className="font-medium text-coral-300">Delete Account</div>
              <div className="text-sm text-coral-400/70">Permanently remove data</div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsSection;