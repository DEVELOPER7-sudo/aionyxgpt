# Speech-to-Speech Chat - Quick Reference

## Files to Copy

```
📁 src/
├── 📁 hooks/
│   └── 📄 useSpeech2Speech.ts (NEW)
├── 📁 components/
│   ├── 📄 Speech2SpeechChat.tsx (NEW)
│   └── 📄 Speech2SpeechModal.tsx (NEW)
```

## Add to index.html

```html
<!-- Add this in <head> -->
<script src="https://js.puter.com/v2/"></script>
```

## Simplest Integration

```typescript
import { useState } from 'react';
import Speech2SpeechModal from '@/components/Speech2SpeechModal';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function YourComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Volume2 className="w-4 h-4" />
      </Button>
      <Speech2SpeechModal isOpen={open} onOpenChange={setOpen} />
    </>
  );
}
```

## Hook Usage

```typescript
import { useSpeech2Speech } from '@/hooks/useSpeech2Speech';

export function MyApp() {
  const {
    isRecording,
    transcript,
    audioUrl,
    startRecording,
    stopRecording,
    playAudio,
    convertVoice,
  } = useSpeech2Speech();

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Start
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop
      </button>
      <p>{transcript}</p>
      {audioUrl && <button onClick={() => playAudio(audioUrl)}>Play</button>}
    </div>
  );
}
```

## Available Voices

| ID | Voice | Type |
|----|-------|------|
| `21m00Tcm4TlvDq8ikWAM` | Rachel | Female |
| `EXAVITQu4vr4xnSDxMaL` | Bella | Female |
| `pFZP5JQG7iQjIQuC4Oy5` | Antoni | Male |
| `G0gQMatjKIeN59UiWrS0` | Charlie | Male |
| `nPczCjzI2devNBz1zQrb` | Domi | Male |

## Component Props

### Speech2SpeechChat
```typescript
<Speech2SpeechChat 
  onClose={() => console.log('closed')} 
/>
```

### Speech2SpeechModal
```typescript
<Speech2SpeechModal 
  isOpen={boolean} 
  onOpenChange={(open) => void}
/>
```

## Hook Methods

```typescript
// Recording
startRecording()        // Start microphone input
stopRecording()         // Stop and transcribe

// Voice Conversion
convertVoice(blob, {    // Convert audio to voice
  voice: 'VOICE_ID',
  model: 'multilingual',
  removeBackgroundNoise: true
})

// Playback
playAudio(url)          // Play audio URL
stopAudio()             // Stop playback

// Utilities
setTranscript(text)     // Update transcript
setAudioUrl(url)        // Update audio URL
```

## User Flow

```
Start Recording
    ↓
User Speaks (Real-time Transcript)
    ↓
Stop & Convert
    ↓
Voice Processing (2-10 seconds)
    ↓
Play/Download Converted Audio
    ↓
Add to Conversation History
```

## Features Checklist

✅ Speech recognition (Web Speech API)
✅ Voice conversion (Puter.ai + ElevenLabs)
✅ Audio recording & playback
✅ Transcript display
✅ Multiple voice selection
✅ Settings panel
✅ Conversation history
✅ Download audio files
✅ Copy transcript
✅ Background noise removal
✅ Dark mode support
✅ Mobile responsive
✅ Smooth animations
✅ Error handling

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Web Speech API supported |
| Edge | ✅ Full | Web Speech API supported |
| Firefox | ⚠️ Partial | May require flags |
| Safari | ✅ 14.1+ | Web Speech API supported |
| Mobile | ✅ Yes | Chrome/Safari on mobile |

## Troubleshooting Quick Links

**"Puter SDK not loaded"**
- Add script tag to index.html

**"Microphone not working"**
- Check browser permissions
- Try different browser

**"Speech API not available"**
- Use Chrome or Edge
- Check if browser supports Web Speech API

**"Voice conversion failed"**
- Verify Puter.ai account
- Check API credits
- Check internet connection

## Testing Checklist

- [ ] Microphone permission works
- [ ] Recording starts/stops
- [ ] Transcript appears during recording
- [ ] Voice conversion completes
- [ ] Audio plays successfully
- [ ] Download works
- [ ] Settings panel opens
- [ ] Different voices convert correctly
- [ ] Clear conversation works
- [ ] Works on mobile
- [ ] Works in dark mode
- [ ] No console errors

## Performance Tips

1. **Enable noise removal** for cleaner audio
2. **Use multilingual model** for best results
3. **Keep recordings 3-30 seconds** for optimal conversion
4. **Close modal to save memory** when not in use
5. **Clear conversation** periodically to reset state

## Cost Estimate

- Per minute of audio: $0.50 - $2.00 (via Puter/ElevenLabs)
- Test mode: Free (limited responses)
- Your Puter.ai account will be billed

## Documentation Map

| Document | Purpose |
|----------|---------|
| SPEECH2SPEECH_FEATURE_SUMMARY.md | Overview & status |
| SPEECH2SPEECH_INTEGRATION_GUIDE.md | Full technical docs |
| SPEECH2SPEECH_IMPLEMENTATION_EXAMPLE.md | 4 ways to integrate |
| SPEECH2SPEECH_QUICK_REFERENCE.md | This file |

## Code Examples

### Minimal Button
```typescript
<Button onClick={() => setSpeech2SpeechOpen(true)}>
  Speech Chat
</Button>
```

### With Icon
```typescript
<Button onClick={() => setSpeech2SpeechOpen(true)}>
  <Volume2 className="w-4 h-4" />
  Speech
</Button>
```

### In Header
```typescript
<header className="flex justify-between">
  <h1>My App</h1>
  <Button onClick={() => setSpeech2SpeechOpen(true)} variant="ghost">
    <Volume2 />
  </Button>
</header>
```

### Full Page Route
```typescript
<Route path="/voice" element={<Speech2SpeechChat />} />
```

## API Endpoints Used

1. **Puter.ai Speech2Speech**
   - Endpoint: `puter.ai.speech2speech()`
   - Method: POST
   - Input: Audio blob/URL
   - Output: Converted audio URL

2. **Web Speech API**
   - Recognition: `SpeechRecognition` interface
   - Browser: Built-in API
   - Input: Microphone stream
   - Output: Text transcript

## Environment Setup

No environment variables needed!

All configuration is done through:
- Component props
- Hook parameters
- Settings panel UI

## Security Notes

✅ Audio processed through secure APIs
✅ No data stored on disk
✅ Conversation history local only
✅ User consent required for microphone
✅ HTTPS recommended for production

## Common Customizations

**Change Default Voice:**
```typescript
const [selectedVoice, setSelectedVoice] = 
  useState('EXAVITQu4vr4xnSDxMaL'); // Bella instead of Rachel
```

**Disable Noise Removal by Default:**
```typescript
const [removeNoise, setRemoveNoise] = useState(false);
```

**Add More Voices:**
```typescript
const VOICE_OPTIONS = [
  // ... existing
  { id: 'NEW_ID', label: 'New Voice' },
];
```

## Next Steps

1. ✅ Copy 3 files to project
2. ✅ Add Puter SDK to HTML
3. ✅ Add button to your app
4. ✅ Test microphone access
5. ✅ Test voice conversion
6. ✅ Deploy to production

## Need Help?

Check these files in order:
1. `SPEECH2SPEECH_FEATURE_SUMMARY.md` - Overview
2. `SPEECH2SPEECH_INTEGRATION_GUIDE.md` - Details
3. `SPEECH2SPEECH_IMPLEMENTATION_EXAMPLE.md` - Examples
4. This file - Quick answers

---

**Status**: Ready to integrate
**Time to implement**: 5-10 minutes
**No new dependencies required**
**All required packages already installed**

Good luck! 🎉
