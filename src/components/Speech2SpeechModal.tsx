import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Speech2SpeechChat from '@/components/Speech2SpeechChat';

interface Speech2SpeechModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const Speech2SpeechModal = ({ isOpen, onOpenChange }: Speech2SpeechModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] p-0 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <Speech2SpeechChat onClose={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Speech2SpeechModal;
