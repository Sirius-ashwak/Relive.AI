# Relive - AI Memory Companion

<div align="center">
  <img src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Relive AI Memory Companion" width="600" height="300" style="border-radius: 16px; object-fit: cover;">
  
  <h3>Talk to the Past. Shape Your Future.</h3>
  <p>Premium AI Memory Companion that lets you have sophisticated conversations with replicas of people you know and past versions of yourself.</p>

  [![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0.8-ff69b4.svg)](https://www.framer.com/motion/)
  [![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)
</div>

## ✨ Features

### 🧠 AI Memory Intelligence
- **Advanced AI Conversations**: Powered by Google's Gemini Pro for natural, contextual dialogue
- **Memory Preservation**: Create detailed personas from memories and descriptions
- **Emotional Intelligence**: AI that understands context, emotion, and nuance

### 👥 Persona Types
- **Memory Personas**: Recreate conversations with loved ones, friends, or important people
- **Younger Self**: Talk to past versions of yourself from any age or time period
- **Future Self**: Envision and converse with your future aspirations and goals

### 🎨 Premium User Experience
- **Apple-Style Design**: Sophisticated glass morphism and premium animations
- **Real-time Chat**: Instant responses with typing indicators and smooth transitions
- **Voice & Video Ready**: Infrastructure for voice cloning and video avatars
- **Responsive Design**: Optimized for all devices with mobile-first approach

### 🔒 Privacy & Security
- **Local Storage**: All data stored securely in your browser
- **No Server Dependencies**: Complete privacy with client-side processing
- **Encrypted Conversations**: Secure message handling and storage

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/relive-ai.git
   cd relive-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.5.3** - Type-safe development
- **Vite 5.4.2** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework

### UI & Animation
- **Framer Motion 11.0.8** - Production-ready motion library
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful, customizable icons
- **React Hot Toast** - Elegant notifications

### State Management
- **Zustand 4.4.7** - Lightweight state management
- **React Query** - Server state management and caching
- **Local Storage Persistence** - Automatic data persistence

### AI & APIs
- **Google Gemini Pro** - Advanced language model for conversations
- **ElevenLabs** - Voice cloning capabilities (ready)
- **Tavus** - Video avatar generation (ready)

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── modern/          # Advanced components
│   └── ...              # Feature components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── services/            # API services
├── store/               # Zustand stores
├── types/               # TypeScript definitions
└── config/              # Configuration files
```

## 🎯 Usage

### Creating Your First Memory Persona

1. **Click "Create New Memory"** on the dashboard
2. **Choose persona type**:
   - **Memory of Someone**: Recreate a loved one or important person
   - **Younger You**: Talk to your past self
   - **Future You**: Envision your future aspirations
3. **Describe the memory** with as much detail as possible
4. **Start conversing** with your AI companion

### Having Conversations

- **Natural dialogue**: Talk as you would with the real person
- **Context awareness**: AI remembers previous conversations
- **Emotional intelligence**: Responses match the persona's personality
- **Voice & video ready**: Premium features for enhanced interaction

## 🔧 Configuration

### Environment Variables

```env
# Required
VITE_GEMINI_API_KEY=your_gemini_api_key

# Optional (for premium features)
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
VITE_TAVUS_API_KEY=your_tavus_key
```

### Customization

The app uses a sophisticated design system with:
- **Color palette**: Obsidian dark theme with aurora accents
- **Typography**: Manrope and Inter font families
- **Animations**: Framer Motion with Apple-style transitions
- **Glass morphism**: Premium backdrop blur effects

## 📱 PWA Support

Relive is a Progressive Web App with:
- **Offline functionality**: Works without internet connection
- **App-like experience**: Install on mobile and desktop
- **Background sync**: Automatic updates when online
- **Push notifications**: Stay connected with your personas

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run tests
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React best practices
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality assurance

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini** for advanced AI capabilities
- **Framer Motion** for beautiful animations
- **Radix UI** for accessible components
- **Tailwind CSS** for rapid styling
- **The React community** for amazing tools and libraries

## 📞 Support

- **Documentation**: [docs.relive.ai](https://docs.relive.ai)
- **Discord**: [Join our community](https://discord.gg/relive)
- **Email**: support@relive.ai
- **Issues**: [GitHub Issues](https://github.com/yourusername/relive-ai/issues)

---

<div align="center">
  <p>Made with ❤️ for preserving memories and meaningful connections</p>
  <p>© 2025 Relive. All rights reserved.</p>
</div>