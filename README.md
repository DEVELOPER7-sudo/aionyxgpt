# OnyxGPT - Advanced AI Platform 🚀

A next-generation AI-powered platform featuring advanced trigger framework, custom bot creation, mobile app support, and comprehensive AI model integration.

---

## 🌟 Latest Updates (v2.0.0)

### ⚡ Trigger Framework 2.0
- **XML Tag System**: Responses wrapped in `<trigger_name>...</trigger_name>` tags
- **TriggerBar Component**: Collapsible metadata display above responses
- **Multi-Select Dropdown**: Choose multiple triggers simultaneously
- **Contextual Metadata**: Each trigger explains its purpose and influence
- **60+ Built-in Triggers** across 4 categories:
  - 🧩 Reasoning & Analysis (reason, analyze, critique, debate, etc.)
  - 🔍 Research & Information (search, deep research, fact-check, etc.)
  - 📋 Planning & Organization (plan, roadmap, checklist, etc.)
  - ✨ Communication & Style (simplify, formalize, rephrase, etc.)

### 🤖 Custom Bot Creation System
- **Bot Builder**: Create AI assistants with custom system prompts
- **Public/Private Sharing**: Control bot visibility
- **Usage Tracking**: See how often each bot is used
- **Categories**: General, Coding, Writing, Research, Education, Business, Creative, etc.
- **Import/Export**: Share bot configurations via JSON
- **One-Click Activation**: Instantly apply bot behavior to chats

### 📱 Mobile App Support
- **Capacitor Integration**: iOS and Android native app deployment
- **Offline-First**: All data stored locally
- **Progressive Web App**: Install on any device
- **Native Features**: Optimized for mobile UX

### 🎨 Enhanced Features
- **Math Rendering**: KaTeX support for equations (`$...$` and `$$...$$`)
- **100k+ Tokens**: Extended context window (up from 2k)
- **Streaming Toggle**: Enable/disable response streaming
- **Incognito Mode**: Private chats without saving history
- **Color Customization**: Sidebar and background color themes
- **Multiple File Upload**: Images, PDFs, documents
- **OpenRouter Logs**: View API call history

---

## 🎯 Core Features

### 🤖 Multiple AI Models
- **OpenAI**: GPT-5, GPT-5 Mini, GPT-5 Nano
- **Anthropic**: Claude Sonnet 4.5, Claude 3.5 Haiku
- **Google**: Gemini 2.5 Pro, Gemini 2.5 Flash
- **xAI**: Grok 3
- **Meta**: Llama 4 Maverick
- **DeepSeek**: DeepSeek R1
- **Qwen**: Qwen 3 Max
- **Perplexity**: Sonar Pro
- **Uncensored**: Dolphin Mistral 24B Venice 🐬
- **All OpenRouter Models**: 200+ models available

### 🎨 Image Generation
- **Multiple Models**: Flux, Kontext, Turbo, GPT Image, SeeDream, Nano Banana
- **Image Analysis**: Vision-capable models for image understanding
- **Gallery View**: Browse and manage generated images
- **Chat Integration**: Images linked to conversations

### 💾 Data Management
- **Cloud Sync**: Supabase integration for cross-device access
- **Local Storage**: Offline-first architecture
- **Import/Export**: Backup and restore chats
- **Memory System**: Persistent context and user preferences
- **Incognito Mode**: Ephemeral sessions

### 🔍 Search Capabilities
- **Web Search**: Real-time information retrieval
- **Deep Search**: Comprehensive research mode
- **Semantic Search**: Find relevant memories and chats

### ⚙️ Customization
- **Theme System**: Dark/light modes with custom colors
- **Task Modes**: Standard, Reasoning, Research, Creative
- **Temperature Control**: Adjust AI creativity
- **Max Tokens**: Up to 100,000 tokens
- **Provider Selection**: Puter JS or OpenRouter

---

## 🚀 Quick Start

### Web App
```bash
npm install
npm run dev
```

### Mobile App (iOS/Android)

#### Android
```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

#### iOS
```bash
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

---

## 📝 Usage Examples

### Using Triggers
```
User: "deep research quantum computing and summarize"

AI: 
<deep_research>
Quantum computing leverages quantum mechanical phenomena...
[comprehensive research]
</deep_research>

<summarize>
Key points: Quantum computers use qubits, superposition, 
and entanglement for exponential speedup on certain problems.
</summarize>
```

### Creating Custom Bots
1. Navigate to **Custom Bots** in sidebar
2. Click **Create Bot**
3. Set name: "Python Expert"
4. System prompt: "You are an expert Python developer specializing in..."
5. Choose category and visibility
6. Save and activate

### Incognito Mode
1. Go to **Settings**
2. Enable **Incognito Mode**
3. All new chats are temporary
4. Disable to resume normal saving

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **State**: React Query, Local Storage
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: Puter JS, OpenRouter API
- **Mobile**: Capacitor
- **Markdown**: react-markdown, remark-gfm, remark-math, rehype-katex
- **Icons**: Lucide React

---

## 📦 Project Structure

```
/src
  /components
    - TriggerBar.tsx          # Collapsible trigger metadata display
    - TriggerSelector.tsx     # Multi-select trigger dropdown
    - CustomBotsManager.tsx   # Bot creation and management
    - TriggerGallery.tsx      # Trigger library browser
    - ChatArea.tsx            # Main chat interface
    - ChatSidebar.tsx         # Navigation and chat list
    - ...
  /lib
    - triggers.ts             # Trigger framework core
    - custom-bots.ts          # Bot storage and utilities
    - storage.ts              # Local storage management
    - models.ts               # AI model definitions
    - api-logger.ts           # API call logging
    - ...
  /types
    - chat.ts                 # TypeScript interfaces
  /pages
    - ChatApp.tsx             # Main app component
    - Auth.tsx                # Authentication
    - Landing.tsx             # Landing page
  /hooks
    - useAuth.ts              # Authentication hook
    - useChatSync.ts          # Cloud sync hook
    - useVisionAI.ts          # Image analysis hook
    - ...
```

---

## 🎓 Trigger System

### How It Works
1. User includes trigger keywords in message (e.g., "deep research")
2. System detects triggers and builds enhanced prompt
3. AI processes with trigger instructions
4. Response includes XML tags (`<deep_research>...</deep_research>`)
5. TriggerBar displays metadata above response
6. Tags are stripped for clean display

### Trigger Categories

#### 🧩 Reasoning & Analysis
reason, analyze, critique, debate, compare, contrast, deduce, evaluate, justify, hypothesize, examine, interpret, verify, reflect, infer, explore, discuss, validate, assess, troubleshoot

#### 🔍 Research & Information
search, deep research, fact-check, contextualize, summarize, outline, extract, highlight, define, explain, describe, cite, reference, clarify, expand, compress

#### 📋 Planning & Organization
plan, roadmap, checklist, organize, prioritize, schedule, brainstorm, propose, structure, map, draft, improve, review

#### ✨ Communication & Style
simplify, formalize, rephrase, rewrite, summarize-for-kids, persuasive, informative, neutral, balanced, empathetic

---

## 🤖 Custom Bots

### Example Bots

**Code Helper Pro**
- Category: Coding
- Prompt: "You are an expert software developer proficient in multiple languages..."
- Use: Technical problem solving, code review, debugging

**Creative Writer**
- Category: Creative
- Prompt: "You are a creative writing assistant specializing in storytelling..."
- Use: Story development, character creation, plot assistance

**Research Assistant**
- Category: Research
- Prompt: "You are a meticulous researcher with expertise in citation..."
- Use: Academic research, fact verification, source compilation

---

## ⚙️ Configuration

### Environment Variables
```env
# Supabase (optional, for cloud sync)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# OpenRouter (optional, for custom key)
VITE_OPENROUTER_API_KEY=your_openrouter_key
```

### Settings Panel
- **Text Model**: Choose from 200+ AI models
- **Image Model**: Select image generation engine
- **Temperature**: 0.0 - 2.0 (creativity level)
- **Max Tokens**: Up to 100,000 tokens
- **Web Search**: Enable real-time information
- **Deep Search**: Enhanced research mode
- **Streaming**: Toggle response streaming
- **Incognito**: Private mode
- **Theme Colors**: Customize UI appearance

---

## 📱 Mobile Deployment

### Android
1. Build web app: `npm run build`
2. Add Android platform: `npx cap add android`
3. Sync assets: `npx cap sync android`
4. Open in Android Studio: `npx cap open android`
5. Build APK/AAB for distribution

### iOS
1. Build web app: `npm run build`
2. Add iOS platform: `npx cap add ios`
3. Sync assets: `npx cap sync ios`
4. Open in Xcode: `npx cap open ios`
5. Build IPA for App Store

### Configuration
See `capacitor.config.ts` for app settings:
- App ID: `com.onyxgpt.app`
- App Name: `OnyxGPT`
- Splash screen, icons, permissions, etc.

---

## 🔒 Privacy & Security

- **Local-First**: All data stored on device by default
- **Optional Cloud Sync**: User-controlled Supabase integration
- **Incognito Mode**: No storage for private conversations
- **No Tracking**: Zero analytics or telemetry
- **Export Control**: Full data ownership
- **Secure Storage**: Encrypted local storage
- **Authentication**: Supabase Auth for cloud features

---

## 🐛 Troubleshooting

### Triggers Not Working
- Ensure triggers are enabled in Trigger Gallery
- Check spelling of trigger keywords
- View trigger detection in debug logs

### Custom Bots Not Saving
- Check browser localStorage availability
- Verify JSON format for imports
- Clear cache and retry

### Mobile App Issues
- Update Capacitor: `npm install @capacitor/core @capacitor/cli@latest`
- Sync platforms: `npx cap sync`
- Check native logs in Xcode/Android Studio

### Math Not Rendering
- Ensure KaTeX CSS is imported
- Check console for errors
- Verify markdown syntax: `$equation$` or `$$block$$`

---

## 📊 Performance Tips

- **Lazy Loading**: Heavy components load on demand
- **Local Storage**: Minimize cloud API calls
- **Image Optimization**: Compress uploads
- **Token Limits**: Adjust maxTokens for faster responses
- **Streaming**: Enable for real-time feedback
- **Cleanup**: Regularly export and clear old chats

---

## 🛣️ Roadmap

### Upcoming Features
- [ ] Cloud bot marketplace
- [ ] Trigger analytics dashboard
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Plugin system
- [ ] Collaborative editing
- [ ] Advanced markdown (Mermaid diagrams)
- [ ] Bot templates library
- [ ] Trigger chaining
- [ ] Adaptive trigger suggestions

---

## 🤝 Contributing

Contributions welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Credits

Built with ❤️ using:
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com)
- [Capacitor](https://capacitorjs.com)
- [OpenRouter](https://openrouter.ai)
- [Puter](https://puter.com)

---

## 📞 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check the [UPGRADE_SUMMARY.md](./UPGRADE_SUMMARY.md) for technical details

---

**OnyxGPT v2.0.0** - The Future of AI Interaction
