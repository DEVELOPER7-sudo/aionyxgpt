# Speech-to-Speech Chat Component Integration Guide

## Overview

This guide explains how to integrate and use the new Speech-to-Speech Chat component that leverages the Puter.ai Speech2Speech API for real-time voice conversion and communication.

## Features

- **Speech Recognition**: Convert spoken audio to text using Web Speech API
- **Voice Conversion**: Transform audio into different voices using ElevenLabs (via Puter.ai)
- **Multiple Voices**: 5 pre-configured voices (Rachel, Bella, Antoni, Charlie, Domi)
- **Real-time Processing**: Record, transcribe, and convert in real-time
- **Audio Playback**: Play converted audio with download capability
- **Conversation History**: Full conversation history with timestamps
- **Customizable Settings**: 
  - Target voice selection
  - Voice model choice (Multilingual or English-only)
  - Background noise removal toggle

## Components Created

### 1. `useSpeech2Speech` Hook
**Location**: `src/hooks/useSpeech2Speech.ts`

Custom React hook that manages:
- Speech recognition using Web Speech API
- Voice conversion using Puter.ai API
- Audio playback and recording
- State management for transcript, audio, and errors

**Key Methods**:
```typescript
const {
  isRecording,           // Boolean - currently recording
  isProcessing,          // Boolean - processing voice conversion
  transcript,            // String - current transcript
  audioUrl,              // String - converted audio URL
  startRecording,        // Function - start recording
  stopRecording,         // Function - stop recording
  convertVoice,          // Function - convert audio to different voice
  playAudio,             // Function - play converted audio
  stopAudio,             // Function - stop audio playback
  recordAndConvert,      // Function - record and convert in one step
  setTranscript,         // Function - update transcript
  setAudioUrl,           // Function - update audio URL
} = useSpeech2Speech();
```

### 2. `Speech2SpeechChat` Component
**Location**: `src/components/Speech2SpeechChat.tsx`

Full-featured chat interface with:
- Recording controls (start/stop)
- Settings panel for voice and model selection
- Conversation history display
- Audio playback and download
- Voice conversion in real-time

**Props**:
```typescript
interface Speech2SpeechChatProps {
  onClose?: () => void;  // Optional callback when closing
}
```

### 3. `Speech2SpeechModal` Component
**Location**: `src/components/Speech2SpeechModal.tsx`

Modal wrapper for the Speech2Speech chat component.

**Props**:
```typescript
interface Speech2SpeechModalProps {
  isOpen: boolean;                    // Modal open state
  onOpenChange: (open: boolean) => void;  // Callback for state change
}
```

## Integration Steps

### Step 1: Add Puter SDK to HTML

Ensure the Puter SDK is loaded in your `index.html`:

```html
<script src="https://js.puter.com/v2/"></script>
```

### Step 2: Import and Use in Your App

**In ChatApp.tsx or another parent component**:

```typescript
import { useState } from 'react';
import Speech2SpeechModal from '@/components/Speech2SpeechModal';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

function ChatApp() {
  const [speech2SpeechOpen, setSpeech2SpeechOpen] = useState(false);

  return (
    <div>
      {/* Your existing chat UI */}
      
      {/* Add button to open Speech2Speech */}
      <Button
        onClick={() => setSpeech2SpeechOpen(true)}
        variant="outline"
        className="gap-2"
      >
        <Volume2 className="w-4 h-4" />
        Speech2Speech
      </Button>

      {/* Add modal */}
      <Speech2SpeechModal 
        isOpen={speech2SpeechOpen} 
        onOpenChange={setSpeech2SpeechOpen} 
      />
    </div>
  );
}
```

### Step 3: Add to Header or Navigation

Add a button to launch the Speech2Speech feature from your app header:

```typescript
import Speech2SpeechModal from '@/components/Speech2SpeechModal';
import { Volume2 } from 'lucide-react';

export function Header() {
  const [speech2SpeechOpen, setSpeech2SpeechOpen] = useState(false);

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => setSpeech2SpeechOpen(true)}
        variant="ghost"
        size="icon"
        title="Speech-to-Speech Chat"
      >
        <Volume2 className="w-5 h-5" />
      </Button>

      <Speech2SpeechModal 
        isOpen={speech2SpeechOpen} 
        onOpenChange={setSpeech2SpeechOpen} 
      />
    </div>
  );
}
```

## API Reference

### Puter.ai Speech2Speech API

The component uses the Puter.ai wrapper for ElevenLabs Voice Changer:

```typescript
const audioElement = await puter.ai.speech2speech(source, options);

// Parameters:
// source: String | File | Blob - Audio to convert
// options: {
//   voice: string,                      // Voice ID (default: Rachel)
//   model: 'eleven_multilingual_sts_v2' | 'eleven_english_sts_v2'
//   output_format: string,              // mp3_44100_128, opus_48000_64, etc.
//   removeBackgroundNoise: boolean,
//   voiceSettings: { stability, similarity_boost }
// }
```

### Available Voices

Default voice options configured:

| ID | Label | Type |
|---|---|---|
| `21m00Tcm4TlvDq8ikWAM` | Rachel (English Female) | Female |
| `EXAVITQu4vr4xnSDxMaL` | Bella (English Female) | Female |
| `pFZP5JQG7iQjIQuC4Oy5` | Antoni (English Male) | Male |
| `G0gQMatjKIeN59UiWrS0` | Charlie (English Male) | Male |
| `nPczCjzI2devNBz1zQrb` | Domi (English Male) | Male |

**Adding Custom Voices**:

Edit `Speech2SpeechChat.tsx` and add to `VOICE_OPTIONS`:

```typescript
const VOICE_OPTIONS = [
  // ... existing voices
  { id: 'NEW_VOICE_ID', label: 'New Voice Name' },
];
```

## Usage Example

### Basic Usage

```typescript
import Speech2SpeechChat from '@/components/Speech2SpeechChat';

export function MyComponent() {
  return (
    <div style={{ height: '600px' }}>
      <Speech2SpeechChat onClose={() => console.log('Closed')} />
    </div>
  );
}
```

### Advanced Hook Usage

```typescript
import { useSpeech2Speech } from '@/hooks/useSpeech2Speech';

export function CustomVoiceApp() {
  const { isRecording, recordAndConvert } = useSpeech2Speech();

  const handleRecordAndConvert = async () => {
    const result = await recordAndConvert({
      voice: '21m00Tcm4TlvDq8ikWAM', // Rachel
      model: 'eleven_multilingual_sts_v2',
      removeBackgroundNoise: true,
    });

    if (result) {
      console.log('Transcript:', result.transcript);
      console.log('Audio URL:', result.audioUrl);
    }
  };

  return (
    <button onClick={handleRecordAndConvert} disabled={isRecording}>
      {isRecording ? 'Recording...' : 'Record & Convert'}
    </button>
  );
}
```

## Requirements

### Browser APIs Needed
- **Web Speech API**: For speech recognition
- **MediaRecorder API**: For audio recording
- **getUserMedia API**: For microphone access

### Puter Account
- Active Puter.ai account with API access
- Valid API credentials configured
- Sufficient credits for ElevenLabs voice conversion

### Permissions
Users will be prompted for:
1. Microphone access (required for recording)
2. Notification permissions (optional, for toast notifications)

## Troubleshooting

### "Speech Recognition API not supported"
- Use a modern browser (Chrome, Edge, Safari 14.1+, Firefox with flag)
- Web Speech API is required

### "Puter SDK not loaded"
- Ensure `<script src="https://js.puter.com/v2/"></script>` is in your HTML
- Check browser console for loading errors

### "Failed to access microphone"
- User rejected microphone permission
- Check browser microphone settings
- Try in a different browser or incognito window

### "Voice conversion failed"
- Check Puter.ai account and API credits
- Verify voice ID exists
- Check audio file format/size

### "No audio playback"
- Check browser speaker permissions
- Verify audio URL is accessible
- Test with different browser

## Performance Tips

1. **Reduce Background Noise**: Enable "Remove Background Noise" option for better quality
2. **Use Multilingual Model**: Recommended for most use cases
3. **Optimal Audio Length**: 3-30 seconds per recording
4. **Clear Conversation**: Use settings to clear history for better performance

## Security & Privacy

- Audio is processed through Puter.ai servers
- No data is stored locally except conversation history
- User can clear conversation at any time
- Ensure users consent to audio processing

## File Structure

```
src/
├── components/
│   ├── Speech2SpeechChat.tsx       # Main component
│   └── Speech2SpeechModal.tsx      # Modal wrapper
├── hooks/
│   └── useSpeech2Speech.ts         # Custom hook
└── types/
    └── chat.ts                      # Type definitions
```

## Future Enhancements

- [ ] Real-time streaming conversion
- [ ] Custom voice cloning
- [ ] Audio effects/processing
- [ ] Conversation transcription export
- [ ] Multi-language support
- [ ] Voice quality presets
- [ ] Audio normalization
- [ ] Batch processing

## Support

For issues with:
- **Puter.ai API**: Check [Puter documentation](https://puter.com)
- **ElevenLabs**: See [ElevenLabs docs](https://elevenlabs.io)
- **Web Speech API**: Refer to [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## License

This component integrates with third-party APIs (Puter.ai, ElevenLabs). Ensure compliance with their terms of service.
