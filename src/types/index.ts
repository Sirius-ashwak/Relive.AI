export interface User {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'pro' | 'legacy';
  createdAt: Date;
  avatar?: string;
  preferences?: {
    theme: 'dark' | 'light';
    notifications: boolean;
    autoSave: boolean;
  };
}

export interface Persona {
  id: string;
  userId: string;
  name: string;
  type: 'memory' | 'younger' | 'future' | 'custom';
  avatar: string;
  description: string;
  personality: string;
  voiceId?: string;
  tavusPersonaId?: string;
  status: 'active' | 'sleeping' | 'learning';
  lastInteraction: Date;
  conversationCount: number;
  memoryData: {
    traits: string[];
    memories: string[];
    relationships: string[];
    goals?: string[];
    timeContext?: string;
    backstory?: string;
  };
  createdAt: Date;
  isCustom?: boolean;
}

export interface Conversation {
  id: string;
  personaId: string;
  userId: string;
  title: string;
  messages: Message[];
  startedAt: Date;
  lastMessageAt: Date;
  duration: number;
  isActive: boolean;
  mood?: 'happy' | 'sad' | 'neutral' | 'excited' | 'thoughtful';
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  sender: 'user' | 'persona';
  timestamp: Date;
  audioUrl?: string;
  videoUrl?: string;
  emotion?: string;
  isTyping?: boolean;
}

export interface MemoryCapsule {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'text' | 'audio' | 'video' | 'photo';
  tags: string[];
  isPrivate: boolean;
  createdAt: Date;
  ipfsHash?: string;
  blockchainHash?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro' | 'legacy';
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodEnd: Date;
  features: {
    maxPersonas: number;
    unlimitedChat: boolean;
    voiceCloning: boolean;
    videoAvatars: boolean;
    memoryStorage: boolean;
    prioritySupport: boolean;
  };
}

export interface VoiceClone {
  id: string;
  name: string;
  voiceId: string;
  status: 'processing' | 'ready' | 'failed';
  createdAt: Date;
}

export interface VideoAvatar {
  id: string;
  name: string;
  tavusPersonaId: string;
  status: 'processing' | 'ready' | 'failed';
  createdAt: Date;
}