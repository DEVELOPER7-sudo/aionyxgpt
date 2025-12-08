import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useOnyxSpeak } from '@/hooks/useOnyxSpeak';
import { toast } from 'sonner';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Volume2,
  Download,
  Copy,
  Trash2,
  Settings,
  Loader2,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversationItem {
  id: string;
  type: 'user' | 'assistant';
  transcript: string;
  audioUrl?: string;
  timestamp: Date;
  voiceId?: string;
}

interface Speech2SpeechChatProps {
  onClose?: () => void;
}

const VOICE_OPTIONS = [
  { id: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel (English Female)' },
  { id: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella (English Female)' },
  { id: 'pFZP5JQG7iQjIQuC4Oy5', label: 'Antoni (English Male)' },
  { id: 'G0gQMatjKIeN59UiWrS0', label: 'Charlie (English Male)' },
  { id: 'nPczCjzI2devNBz1zQrb', label: 'Domi (English Male)' },
];

const Speech2SpeechChat = ({ onClose }: Speech2SpeechChatProps) => {
  const {
    isRecording,
    isProcessing,
    transcript,
    audioUrl,
    startRecording,
    stopRecording,
    convertVoice,
    playAudio,
    stopAudio,
    setTranscript,
    setAudioUrl,
  } = useOnyxSpeak();

  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('21m00Tcm4TlvDq8ikWAM');
  const [removeNoise, setRemoveNoise] = useState(false);
  const [model, setModel] = useState<'eleven_multilingual_sts_v2' | 'eleven_english_sts_v2'>('eleven_multilingual_sts_v2');
  const [showSettings, setShowSettings] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [recording, setRecording] = useState<MediaRecorder | null>(null);
  const recordingChunks = useRef<BlobPart[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  const handleStartRecording = async () => {
    try {
      recordingChunks.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        recordingChunks.current.push(e.data);
      };

      mediaRecorder.onstart = () => {
        startRecording();
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(recordingChunks.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());

        // Add user message with transcript
        const userMessage: ConversationItem = {
          id: `msg-${Date.now()}`,
          type: 'user',
          transcript,
          timestamp: new Date(),
        };
        setConversation(prev => [...prev, userMessage]);

        // Convert voice
        try {
          const convertedUrl = await convertVoice(audioBlob, {
            voice: selectedVoice,
            model: model,
            removeBackgroundNoise: removeNoise,
          });

          // Add assistant message with converted voice
          const assistantMessage: ConversationItem = {
            id: `msg-${Date.now()}-reply`,
            type: 'assistant',
            transcript: `[Voice conversion applied - listening to your message in different voice]`,
            audioUrl: convertedUrl,
            timestamp: new Date(),
            voiceId: selectedVoice,
          };
          setConversation(prev => [...prev, assistantMessage]);
        } catch (err) {
          console.error('Conversion failed:', err);
        }

        // Clear for next recording
        setTranscript('');
        setAudioUrl(null);
        setRecording(null);
      };

      mediaRecorder.start();
      setRecording(mediaRecorder);
    } catch (err) {
      toast.error('Failed to access microphone');
      console.error('Microphone access error:', err);
    }
  };

  const handleStopRecording = () => {
    if (recording && recording.state === 'recording') {
      stopRecording();
      recording.stop();
    }
  };

  const handlePlayAudio = (url: string, messageId: string) => {
    if (playingId === messageId) {
      stopAudio();
      setPlayingId(null);
    } else {
      if (playingId) {
        stopAudio();
      }
      playAudio(url);
      setPlayingId(messageId);
    }
  };

  const handleDownloadAudio = (url: string, fileName: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Downloaded audio');
  };

  const handleCopyTranscript = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleClearConversation = () => {
    setConversation([]);
    setTranscript('');
    setAudioUrl(null);
    toast.success('Conversation cleared');
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b border-border px-4 py-4 flex items-center justify-between bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">OnyxGPT.Speak</h2>
            <p className="text-xs text-muted-foreground">Speak, listen, and convert voices in real-time</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="hover:bg-primary/10"
          >
            <Settings className="w-5 h-5" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-destructive/10">
              <span className="text-lg">×</span>
            </Button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="mx-4 mt-4 p-4 border-primary/30 bg-primary/5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voice-select">Target Voice</Label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger id="voice-select" className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICE_OPTIONS.map(voice => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model-select">Voice Model</Label>
              <Select value={model} onValueChange={(val: any) => setModel(val)}>
                <SelectTrigger id="model-select" className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eleven_multilingual_sts_v2">Multilingual (Recommended)</SelectItem>
                  <SelectItem value="eleven_english_sts_v2">English Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="noise-reduction">Remove Background Noise</Label>
              <Switch id="noise-reduction" checked={removeNoise} onCheckedChange={setRemoveNoise} />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleClearConversation}
              className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Conversation
            </Button>
          </div>
        </Card>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Mic className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Start Speaking</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Click the record button below to speak. Your voice will be converted and played back in the selected voice.
              </p>
            </div>
          </div>
        ) : (
          conversation.map(message => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3 animate-slide-in-up',
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl p-4 shadow-lg transition-all duration-300',
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border hover:border-primary/30'
                )}
              >
                <p className="text-sm mb-3">{message.transcript}</p>

                {message.audioUrl && (
                  <div className="flex items-center gap-2 pt-2 border-t border-current border-opacity-20">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:scale-110 transition-transform"
                      onClick={() => handlePlayAudio(message.audioUrl!, message.id)}
                    >
                      {playingId === message.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:scale-110 transition-transform"
                      onClick={() => handleDownloadAudio(message.audioUrl!, `message-${message.id}.mp3`)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>

                    {message.voiceId && (
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {VOICE_OPTIONS.find(v => v.id === message.voiceId)?.label || 'Custom'}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-2 mt-2 pt-2 border-t border-current border-opacity-20">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:scale-110 transition-transform"
                    onClick={() => handleCopyTranscript(message.transcript)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <span className="text-xs opacity-60 ml-auto">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input/Recording Area */}
      <div className="border-t border-border px-4 py-4 bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Transcript Display */}
          {transcript && (
            <Card className="p-3 bg-primary/5 border-primary/20">
              <p className="text-sm text-foreground">{transcript}</p>
            </Card>
          )}

          {/* Recording Status */}
          {isRecording && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-pulse">
              <div className="h-2 w-2 bg-destructive rounded-full animate-bounce" />
              <span className="text-sm font-medium text-destructive">Recording...</span>
            </div>
          )}

          {/* Processing Status */}
          {isProcessing && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm font-medium text-primary">Converting voice...</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            {!isRecording ? (
              <Button
                onClick={handleStartRecording}
                disabled={isProcessing}
                className="gap-2 px-6"
                size="lg"
              >
                <Mic className="w-5 h-5" />
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={handleStopRecording}
                variant="destructive"
                className="gap-2 px-6"
                size="lg"
              >
                <MicOff className="w-5 h-5" />
                Stop & Convert
              </Button>
            )}
          </div>

          {/* Info */}
          <p className="text-xs text-muted-foreground text-center">
            Selected Voice: <span className="font-semibold">
              {VOICE_OPTIONS.find(v => v.id === selectedVoice)?.label}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Speech2SpeechChat;
