import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  Copy,
  MoreVertical,
  Bookmark,
  BookmarkCheck,
  Share2,
  Trash2,
  Edit2,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedChatMessageProps {
  message: Message;
  isLoading?: boolean;
  onBookmark?: (messageId: string) => void;
  onShare?: (messageId: string) => void;
  onRegenerate?: (messageId: string) => void;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  isBookmarked?: boolean;
  renderContent?: (content: string) => React.ReactNode;
}

export default function EnhancedChatMessage({
  message,
  isLoading = false,
  onBookmark,
  onShare,
  onRegenerate,
  onEdit,
  onDelete,
  isBookmarked = false,
  renderContent,
}: EnhancedChatMessageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [bookmarkState, setBookmarkState] = useState(isBookmarked);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    toast.success('Message copied to clipboard');
  };

  const handleBookmark = async () => {
    try {
      if (!bookmarkState) {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            message_id: message.id,
            message_content: message.content,
          });

        if (error) throw error;
        setBookmarkState(true);
        toast.success('Message bookmarked');
      } else {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('message_id', message.id);

        if (error) throw error;
        setBookmarkState(false);
        toast.success('Bookmark removed');
      }

      onBookmark?.(message.id);
    } catch (error) {
      console.error('Error managing bookmark:', error);
      toast.error('Failed to manage bookmark');
    }
  };

  const isUserMessage = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-3 w-full py-3 px-4 rounded-lg transition-colors duration-200',
        isUserMessage
          ? 'bg-blue-50 dark:bg-blue-950/20 ml-auto mr-0 max-w-[85%] justify-end'
          : 'bg-muted/50 hover:bg-muted/80',
        isHovered && !isUserMessage && 'bg-muted'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div className="text-sm leading-relaxed break-words">
          {renderContent ? renderContent(message.content) : message.content}
        </div>

        {/* Message Metadata */}
        {message.timestamp && (
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        )}

        {/* Trigger Tags */}
        {message.triggers && message.triggers.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-2">
            {message.triggers.map((trigger) => (
              <span
                key={trigger}
                className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded"
              >
                #{trigger}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!isLoading && (
        <div
          className={cn(
            'flex gap-1 flex-shrink-0 opacity-0 transition-opacity duration-200',
            isHovered && 'opacity-100'
          )}
        >
          {/* Bookmark Button */}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={handleBookmark}
            title={bookmarkState ? 'Remove bookmark' : 'Bookmark message'}
          >
            {bookmarkState ? (
              <BookmarkCheck className="h-4 w-4 text-amber-500 fill-amber-500" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>

          {/* Copy Button */}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={copyToClipboard}
            title="Copy message"
          >
            <Copy className="h-4 w-4" />
          </Button>

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                title="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isUserMessage ? (
                <>
                  <DropdownMenuItem
                    onClick={() => onEdit?.(message.id, message.content)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => onRegenerate?.(message.id)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Regenerate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onShare?.(message.id)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuItem
                onClick={() => onDelete?.(message.id)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
