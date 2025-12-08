import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2 } from 'lucide-react';
import Speech2SpeechChat from '@/components/Speech2SpeechChat';

const VoiceChat = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 flex items-center justify-between bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/chat')}
            className="hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">OnyxGPT.Speak</h1>
              <p className="text-xs text-muted-foreground">AI voice chat and conversion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Speech2SpeechChat onClose={() => navigate('/chat')} />
      </div>
    </div>
  );
};

export default VoiceChat;
