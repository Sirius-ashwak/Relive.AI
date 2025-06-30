export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar: string;
          subscription: 'free' | 'pro' | 'legacy';
          preferences: {
            theme: 'dark' | 'light';
            notifications: boolean;
            autoSave: boolean;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar?: string;
          subscription?: 'free' | 'pro' | 'legacy';
          preferences?: {
            theme: 'dark' | 'light';
            notifications: boolean;
            autoSave: boolean;
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar?: string;
          subscription?: 'free' | 'pro' | 'legacy';
          preferences?: {
            theme: 'dark' | 'light';
            notifications: boolean;
            autoSave: boolean;
          };
          updated_at?: string;
        };
      };
      personas: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'memory' | 'younger' | 'future' | 'custom';
          avatar: string;
          description: string;
          personality: string;
          voice_id: string | null;
          tavus_persona_id: string | null;
          status: 'active' | 'sleeping' | 'learning';
          last_interaction: string;
          conversation_count: number;
          memory_data: {
            traits: string[];
            memories: string[];
            relationships: string[];
            goals?: string[];
            timeContext?: string;
            backstory?: string;
          };
          is_custom: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: 'memory' | 'younger' | 'future' | 'custom';
          avatar?: string;
          description: string;
          personality: string;
          voice_id?: string | null;
          tavus_persona_id?: string | null;
          status?: 'active' | 'sleeping' | 'learning';
          last_interaction?: string;
          conversation_count?: number;
          memory_data: {
            traits: string[];
            memories: string[];
            relationships: string[];
            goals?: string[];
            timeContext?: string;
            backstory?: string;
          };
          is_custom?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: 'memory' | 'younger' | 'future' | 'custom';
          avatar?: string;
          description?: string;
          personality?: string;
          voice_id?: string | null;
          tavus_persona_id?: string | null;
          status?: 'active' | 'sleeping' | 'learning';
          last_interaction?: string;
          conversation_count?: number;
          memory_data?: {
            traits: string[];
            memories: string[];
            relationships: string[];
            goals?: string[];
            timeContext?: string;
            backstory?: string;
          };
          is_custom?: boolean;
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          persona_id: string;
          user_id: string;
          title: string;
          started_at: string;
          last_message_at: string;
          duration: number;
          is_active: boolean;
          mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'thoughtful' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          persona_id: string;
          user_id: string;
          title: string;
          started_at?: string;
          last_message_at?: string;
          duration?: number;
          is_active?: boolean;
          mood?: 'happy' | 'sad' | 'neutral' | 'excited' | 'thoughtful' | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          persona_id?: string;
          user_id?: string;
          title?: string;
          started_at?: string;
          last_message_at?: string;
          duration?: number;
          is_active?: boolean;
          mood?: 'happy' | 'sad' | 'neutral' | 'excited' | 'thoughtful' | null;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          content: string;
          sender: 'user' | 'persona';
          audio_url: string | null;
          video_url: string | null;
          emotion: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          content: string;
          sender: 'user' | 'persona';
          audio_url?: string | null;
          video_url?: string | null;
          emotion?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          content?: string;
          sender?: 'user' | 'persona';
          audio_url?: string | null;
          video_url?: string | null;
          emotion?: string | null;
        };
      };
      memory_capsules: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          type: 'text' | 'audio' | 'video' | 'photo';
          tags: string[];
          is_private: boolean;
          ipfs_hash: string | null;
          blockchain_hash: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          type: 'text' | 'audio' | 'video' | 'photo';
          tags?: string[];
          is_private?: boolean;
          ipfs_hash?: string | null;
          blockchain_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          type?: 'text' | 'audio' | 'video' | 'photo';
          tags?: string[];
          is_private?: boolean;
          ipfs_hash?: string | null;
          blockchain_hash?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}