import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_CONFIG } from '../config/api';
import { Persona, Message } from '../types';

const genAI = new GoogleGenerativeAI(API_CONFIG.GEMINI_API_KEY);

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

  async generatePersonaResponse(persona: Persona, userMessage: string, conversationHistory: Message[] = []): Promise<string> {
    try {
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
      
      // Fallback responses based on persona type
      const fallbackResponses = {
        memory: "I'm having trouble connecting right now, but I'm here with you. Please try again in a moment.",
        younger: "Whoa, something went wrong! This is so weird. Can you try saying that again?",
        future: "I'm experiencing some technical difficulties. Let me gather my thoughts and try again."
      };
      
      return fallbackResponses[persona.type] || "I'm having trouble connecting right now. Please try again in a moment.";
    }
  }

  async createPersonaFromMemory(memoryText: string, personaType: 'memory' | 'younger' | 'future'): Promise<Partial<Persona>> {
    try {
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
      
      // Fallback persona data
      const fallbackData = {
        memory: {
          name: "Memory Persona",
          description: "A cherished memory brought to life through AI.",
          personality: "Warm, caring, and full of wisdom from shared experiences.",
          traits: ["caring", "wise", "empathetic", "loving"],
          memories: [memoryText.slice(0, 100)],
          relationships: ["family", "friends"]
        },
        younger: {
          name: "Younger You",
          description: "Your past self, full of dreams and curiosity.",
          personality: "Energetic, curious, and optimistic about the future.",
          traits: ["curious", "energetic", "hopeful", "ambitious"],
          memories: [memoryText.slice(0, 100)],
          relationships: ["family", "friends", "classmates"]
        },
        future: {
          name: "Future You",
          description: "Your future self, wise and accomplished.",
          personality: "Confident, wise, and successful with valuable life experience.",
          traits: ["confident", "wise", "successful", "balanced"],
          memories: [memoryText.slice(0, 100)],
          relationships: ["professional network", "life partner", "mentees"]
        }
      };
      
      return fallbackData[personaType];
    }
  }
}

export const geminiService = new GeminiService();