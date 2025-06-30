import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_CONFIG } from '../config/api';
import { Persona, Message } from '../types';

const genAI = new GoogleGenerativeAI(API_CONFIG.GEMINI_API_KEY);

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async generatePersonaResponse(persona: Persona, userMessage: string, conversationHistory: Message[] = []): Promise<string> {
    try {
      // Check if API key is available
      if (!API_CONFIG.GEMINI_API_KEY) {
        console.warn('⚠️ Gemini API key not found, using fallback response');
        return this.getFallbackResponse(persona, userMessage);
      }

      console.log('🤖 Generating response for:', persona.name);
      console.log('📝 User message:', userMessage);

      const systemPrompt = `You are ${persona.name}, a ${persona.type} persona. ${persona.description}

Personality: ${persona.personality}

Key traits: ${persona.memoryData.traits.join(', ')}
Important memories: ${persona.memoryData.memories.join(', ')}
Relationships: ${persona.memoryData.relationships.join(', ')}

IMPORTANT: Respond as this persona would, staying completely in character. Be conversational, empathetic, and authentic. Keep responses natural and not too long (2-3 sentences usually).`;

      const context = conversationHistory.slice(-5).map(msg => 
        `${msg.sender === 'user' ? 'Human' : persona.name}: ${msg.content}`
      ).join('\n');

      const fullPrompt = `${systemPrompt}\n\nRecent conversation:\n${context}\n\nHuman: ${userMessage}\n\n${persona.name}:`;

      console.log('🚀 Sending request to Gemini API...');
      
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Received response:', text);
      return text;
    } catch (error) {
      console.error('❌ Gemini API error:', error);
      return this.getFallbackResponse(persona, userMessage);
    }
  }

  private getFallbackResponse(persona: Persona, userMessage: string): string {
    // Smart fallback responses based on persona type and message content
    const messageWords = userMessage.toLowerCase();
    
    if (messageWords.includes('hello') || messageWords.includes('hi')) {
      const greetings = {
        memory: "Hello there! It's so wonderful to see you again. How have you been?",
        younger: "Hey! This is so cool - talking to my future self! How's everything going?",
        future: "Hello, past self. I'm glad we can finally talk. What's on your mind?"
      };
      return greetings[persona.type] || "Hello! It's great to talk with you.";
    }
    
    if (messageWords.includes('how') && messageWords.includes('you')) {
      const responses = {
        memory: "I'm doing well, dear. I've been thinking about you and hoping you're taking care of yourself.",
        younger: "I'm excited and curious about everything! Tell me, did we achieve our dreams?",
        future: "I'm doing wonderfully. Life has taught me so much, and I'm here to share that wisdom with you."
      };
      return responses[persona.type] || "I'm doing well, thank you for asking.";
    }
    
    if (messageWords.includes('advice') || messageWords.includes('help')) {
      const advice = {
        memory: "Remember, sweetheart, you're stronger than you know. Trust yourself and follow your heart.",
        younger: "Wow, you're asking me for advice? That's so weird! But I think we should always stay curious and never give up on our dreams.",
        future: "Here's what I've learned: be patient with yourself, invest in relationships, and never stop learning. You're on the right path."
      };
      return advice[persona.type] || "I'm here to help you however I can.";
    }
    
    // Default responses
    const defaults = {
      memory: "I understand what you're going through. Remember that I'm always here for you, even if just in memory.",
      younger: "That's really interesting! I can't wait to see how things turn out. What else can you tell me about the future?",
      future: "That's a thoughtful question. From my perspective, I can see how important this moment is for your growth."
    };
    
    return defaults[persona.type] || "That's really interesting. Tell me more about what you're thinking.";
  }

  async createPersonaFromMemory(memoryText: string, personaType: 'memory' | 'younger' | 'future'): Promise<Partial<Persona>> {
    try {
      // Check if API key is available
      if (!API_CONFIG.GEMINI_API_KEY) {
        console.warn('⚠️ Gemini API key not found, using fallback persona creation');
        return this.getFallbackPersonaData(memoryText, personaType);
      }

      console.log('🎭 Creating persona from memory:', personaType);
      console.log('📖 Memory text:', memoryText.slice(0, 100) + '...');

      const typePrompts = {
        memory: "Based on this description of a person or memory, create a persona profile for someone from the past:",
        younger: "Based on this description, create a persona profile for a younger version of the user:",
        future: "Based on this description and aspirations, create a persona profile for a future version of the user:"
      };

      const prompt = `${typePrompts[personaType]}

"${memoryText}"

Create a realistic persona with these details:
- name: A suitable name (e.g., "Mom", "You at 16", "Future You")
- description: Brief description (1-2 sentences)
- personality: Detailed personality description (2-3 sentences)
- traits: Array of 4-6 key personality traits
- memories: Array of 3-5 important memories or experiences
- relationships: Array of key relationships

Respond with ONLY a valid JSON object in this exact format:
{
  "name": "string",
  "description": "string", 
  "personality": "string",
  "traits": ["trait1", "trait2", "trait3", "trait4"],
  "memories": ["memory1", "memory2", "memory3"],
  "relationships": ["relationship1", "relationship2"]
}`;

      console.log('🚀 Sending persona creation request...');
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('📄 Raw response:', text);
      
      // Clean up the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        console.log('✅ Parsed persona data:', parsed);
        return parsed;
      }
      
      throw new Error('No valid JSON found in response');
      
    } catch (error) {
      console.error('❌ Error creating persona:', error);
      return this.getFallbackPersonaData(memoryText, personaType);
    }
  }

  private getFallbackPersonaData(memoryText: string, personaType: 'memory' | 'younger' | 'future'): Partial<Persona> {
    // Fallback persona data based on type
    const fallbackData = {
      memory: {
        name: "Memory Persona",
        description: "A cherished memory brought to life through AI.",
        personality: "Warm, caring, and full of wisdom from shared experiences. Always supportive and understanding.",
        traits: ["caring", "wise", "empathetic", "loving"],
        memories: [memoryText.slice(0, 100) + "..."],
        relationships: ["family", "friends"]
      },
      younger: {
        name: "Younger You",
        description: "Your past self, full of dreams and curiosity.",
        personality: "Energetic, curious, and optimistic about the future. Always asking questions and dreaming big.",
        traits: ["curious", "energetic", "hopeful", "ambitious"],
        memories: [memoryText.slice(0, 100) + "..."],
        relationships: ["family", "friends", "classmates"]
      },
      future: {
        name: "Future You",
        description: "Your future self, wise and accomplished.",
        personality: "Confident, wise, and successful with valuable life experience. Offers guidance with patience and understanding.",
        traits: ["confident", "wise", "successful", "balanced"],
        memories: [memoryText.slice(0, 100) + "..."],
        relationships: ["professional network", "life partner", "mentees"]
      }
    };
    
    return fallbackData[personaType];
  }
}

export const geminiService = new GeminiService();