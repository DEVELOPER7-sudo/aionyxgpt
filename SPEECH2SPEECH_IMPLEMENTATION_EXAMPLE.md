# Speech-to-Speech Implementation Example

## Quick Integration Example

This file shows you exactly where and how to add the Speech-to-Speech feature to your existing ChatApp.

## Option 1: Add to Header (Recommended)

Edit your **Header component** to include a button:

```typescript
// In src/components/Header.tsx or similar

import { useState } from 'react';
import Speech2SpeechModal from '@/components/Speech2SpeechModal';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [speech2SpeechOpen, setSpeech2SpeechOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      {/* Your existing header content */}
      
      <div className="flex gap-2">
        {/* Other buttons */}
        
        <Button
          onClick={() => setSpeech2SpeechOpen(true)}
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 transition-colors"
          title="Speech-to-Speech Chat"
        >
          <Volume2 className="w-5 h-5" />
        </Button>

        {/* Add modal */}
        <Speech2SpeechModal 
          isOpen={speech2SpeechOpen} 
          onOpenChange={setSpeech2SpeechOpen} 
        />
      </div>
    </div>
  );
}
```

## Option 2: Add to ChatApp Main View

Edit **src/pages/ChatApp.tsx**:

```typescript
import { useState } from 'react';
import Speech2SpeechModal from '@/components/Speech2SpeechModal';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChatApp = () => {
  const [speech2SpeechOpen, setSpeech2SpeechOpen] = useState(false);

  // ... your existing code ...

  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      {/* Existing sidebar and chat area */}
      
      {/* Add button somewhere in your layout */}
      <div className="absolute bottom-8 right-8">
        <Button
          onClick={() => setSpeech2SpeechOpen(true)}
          className="gap-2 rounded-full shadow-lg"
          size="lg"
        >
          <Volume2 className="w-5 h-5" />
          Speech Chat
        </Button>
      </div>

      {/* Add modal */}
      <Speech2SpeechModal 
        isOpen={speech2SpeechOpen} 
        onOpenChange={setSpeech2SpeechOpen} 
      />
    </div>
  );
};

export default ChatApp;
```

## Option 3: Add as Tab in Sidebar

Edit your **ChatSidebar component**:

```typescript
import { useState } from 'react';
import Speech2SpeechModal from '@/components/Speech2SpeechModal';
import { Volume2, MessageCircle, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ChatSidebar() {
  const [activeTab, setActiveTab] = useState<'chat' | 'speech' | 'images'>('chat');
  const [speech2SpeechOpen, setSpeech2SpeechOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      {/* Tab navigation */}
      <div className="border-b border-border p-2 flex gap-2">
        <Button
          variant={activeTab === 'chat' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('chat')}
          className="gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Chat
        </Button>
        
        <Button
          variant={activeTab === 'speech' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('speech')}
          className="gap-2"
        >
          <Volume2 className="w-4 h-4" />
          Speech
        </Button>
        
        <Button
          variant={activeTab === 'images' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('images')}
          className="gap-2"
        >
          <Image className="w-4 h-4" />
          Images
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'speech' && (
          <Speech2SpeechModal 
            isOpen={activeTab === 'speech'} 
            onOpenChange={(open) => !open && setActiveTab('chat')} 
          />
        )}
        {/* Other tabs content */}
      </div>
    </div>
  );
}
```

## Option 4: Full-Screen Voice Chat Page

Create **src/pages/VoiceChat.tsx**:

```typescript
import Speech2SpeechChat from '@/components/Speech2SpeechChat';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function VoiceChatPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/chat')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Voice-to-Voice Chat</h1>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <Speech2SpeechChat onClose={() => navigate('/chat')} />
      </div>
    </div>
  );
}
```

Then add the route in **App.tsx**:

```typescript
import VoiceChatPage from './pages/VoiceChat';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/chat" element={<ProtectedRoute><ChatApp /></ProtectedRoute>} />
          <Route path="/voice" element={<ProtectedRoute><VoiceChatPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
```

## Setup Checklist

- [ ] Copy `useSpeech2Speech.ts` to `src/hooks/`
- [ ] Copy `Speech2SpeechChat.tsx` to `src/components/`
- [ ] Copy `Speech2SpeechModal.tsx` to `src/components/`
- [ ] Add `<script src="https://js.puter.com/v2/"></script>` to `index.html`
- [ ] Add button/integration to your preferred location (Header, ChatApp, Sidebar, etc.)
- [ ] Test microphone permissions
- [ ] Verify Puter SDK is loaded (`window.puter` exists)
- [ ] Test voice conversion with sample audio

## Testing Steps

1. **Open the Speech-to-Speech interface** (via button/modal)
2. **Allow microphone access** when prompted
3. **Click "Start Recording"**
4. **Speak clearly** (e.g., "Hello, this is a test message")
5. **Click "Stop & Convert"**
6. **Wait for voice conversion** to complete
7. **Click play icon** to hear the converted voice
8. **Download audio** if needed
9. **Try different voices** from settings

## Customization

### Change Default Voice

Edit `Speech2SpeechChat.tsx`:

```typescript
const [selectedVoice, setSelectedVoice] = useState('21m00Tcm4TlvDq8ikWAM'); // Rachel

// Change to:
const [selectedVoice, setSelectedVoice] = useState('EXAVITQu4vr4xnSDxMaL'); // Bella
```

### Add More Voices

Edit the `VOICE_OPTIONS` array in `Speech2SpeechChat.tsx`:

```typescript
const VOICE_OPTIONS = [
  { id: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel (English Female)' },
  { id: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella (English Female)' },
  { id: 'pFZP5JQG7iQjIQuC4Oy5', label: 'Antoni (English Male)' },
  { id: 'G0gQMatjKIeN59UiWrS0', label: 'Charlie (English Male)' },
  { id: 'nPczCjzI2devNBz1zQrb', label: 'Domi (English Male)' },
  // Add new voices here:
  { id: 'YOUR_VOICE_ID', label: 'Your Voice Name' },
];
```

### Customize UI

Modify colors and styles in `Speech2SpeechChat.tsx`:

```typescript
// Change button color
<Button
  onClick={handleStartRecording}
  className="gap-2 px-6 bg-gradient-to-r from-purple-500 to-pink-500"
  size="lg"
>

// Change card styling
<Card className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-primary/20">
```

## Common Issues & Solutions

### Microphone Not Working

```typescript
// Debug in browser console:
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => console.log('✓ Microphone works'))
  .catch(err => console.error('✗ Microphone error:', err));
```

### Puter SDK Not Found

Check `index.html`:
```html
<!-- MUST be in <head> or before app scripts -->
<script src="https://js.puter.com/v2/"></script>
```

### Web Speech API Not Available

```typescript
// In browser console:
console.log(window.webkitSpeechRecognition || window.SpeechRecognition);
// Should log the API constructor, not undefined
```

## Next Steps

1. Test the component thoroughly with your app
2. Customize voices and settings as needed
3. Add error handling for production
4. Monitor Puter.ai credit usage
5. Consider adding rate limiting for API calls
6. Implement analytics for usage tracking

---

Need help? Check `SPEECH2SPEECH_INTEGRATION_GUIDE.md` for detailed documentation.
