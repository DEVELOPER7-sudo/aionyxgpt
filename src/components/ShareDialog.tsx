import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  Share2,
  Copy,
  Lock,
  Globe,
  MoreVertical,
  Trash2,
  Clock,
  Users,
  MessageCircle,
  SmilePlus,
  LinkIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface ShareLink {
  id: string;
  chat_id: string;
  share_token: string;
  created_by: string;
  is_public: boolean;
  password?: string;
  expires_at?: string;
  created_at: string;
  access_count: number;
}

interface Comment {
  id: string;
  message_id: string;
  user_id: string;
  content: string;
  created_at: string;
  reactions: { [emoji: string]: number };
}

interface ShareDialogProps {
  chatId: string;
  chatTitle?: string;
}

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '🤔', '🎉', '👏', '🔥', '✨'];

export default function ShareDialog({ chatId, chatTitle }: ShareDialogProps) {
  const [shares, setShares] = useState<ShareLink[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [requirePassword, setRequirePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [expiresIn, setExpiresIn] = useState<'never' | '7d' | '30d' | '90d'>(
    'never'
  );
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (isDialogOpen) {
      loadShares();
      loadComments();
    }
  }, [isDialogOpen, chatId]);

  const loadShares = async () => {
    try {
      const { data, error } = await supabase
        .from('shared_chats')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShares(data || []);
    } catch (error) {
      console.error('Error loading shares:', error);
    }
  };

  const loadComments = async () => {
    try {
      const { data: messages } = await supabase
        .from('messages')
        .select('id')
        .eq('chat_id', chatId)
        .limit(1);

      if (!messages || messages.length === 0) return;

      const { data, error } = await supabase
        .from('message_comments')
        .select('*')
        .in('message_id', messages.map((m) => m.id));

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const createShare = async () => {
    try {
      setIsLoading(true);

      const shareToken = Math.random().toString(36).substring(2, 15);
      let expiresAt = null;

      if (expiresIn !== 'never') {
        const daysMap = { '7d': 7, '30d': 30, '90d': 90 };
        const expiresDate = new Date();
        expiresDate.setDate(
          expiresDate.getDate() + daysMap[expiresIn as keyof typeof daysMap]
        );
        expiresAt = expiresDate.toISOString();
      }

      const { data, error } = await supabase
        .from('shared_chats')
        .insert({
          chat_id: chatId,
          share_token: shareToken,
          is_public: isPublic,
          password: requirePassword ? password : null,
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) throw error;

      setShares([data, ...shares]);
      setIsPublic(false);
      setRequirePassword(false);
      setPassword('');
      setExpiresIn('never');
      toast.success('Share link created');
    } catch (error) {
      console.error('Error creating share:', error);
      toast.error('Failed to create share link');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteShare = async (shareId: string) => {
    try {
      const { error } = await supabase
        .from('shared_chats')
        .delete()
        .eq('id', shareId);

      if (error) throw error;
      setShares(shares.filter((s) => s.id !== shareId));
      toast.success('Share link revoked');
    } catch (error) {
      console.error('Error deleting share:', error);
      toast.error('Failed to revoke share link');
    }
  };

  const copyShareLink = (shareToken: string) => {
    const url = `${window.location.origin}/share/${shareToken}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const addComment = async (messageId: string) => {
    if (!newComment.trim()) return;

    try {
      const { data, error } = await supabase
        .from('message_comments')
        .insert({
          message_id: messageId,
          content: newComment,
        })
        .select()
        .single();

      if (error) throw error;
      setComments([...comments, data]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const addReaction = async (commentId: string, emoji: string) => {
    try {
      const comment = comments.find((c) => c.id === commentId);
      if (!comment) return;

      const reactions = { ...comment.reactions };
      reactions[emoji] = (reactions[emoji] || 0) + 1;

      const { error } = await supabase
        .from('message_comments')
        .update({ reactions })
        .eq('id', commentId);

      if (error) throw error;

      setComments(
        comments.map((c) => (c.id === commentId ? { ...c, reactions } : c))
      );
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Chat: {chatTitle}</DialogTitle>
          <DialogDescription>
            Create shareable links and collaborate with others
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="links" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="links">Share Links</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          {/* Share Links Tab */}
          <TabsContent value="links" className="space-y-4">
            {/* Create Share Form */}
            <div className="border border-border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Create New Share Link</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="public"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Globe className="h-4 w-4" />
                    Public Link
                  </Label>
                  <Switch
                    id="public"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Lock className="h-4 w-4" />
                    Require Password
                  </Label>
                  <Switch
                    id="password"
                    checked={requirePassword}
                    onCheckedChange={setRequirePassword}
                  />
                </div>

                {requirePassword && (
                  <Input
                    type="password"
                    placeholder="Set a password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                )}

                <div>
                  <Label htmlFor="expires" className="text-sm">
                    Expiration
                  </Label>
                  <select
                    id="expires"
                    value={expiresIn}
                    onChange={(e) =>
                      setExpiresIn(
                        e.target.value as 'never' | '7d' | '30d' | '90d'
                      )
                    }
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="never">Never expires</option>
                    <option value="7d">Expires in 7 days</option>
                    <option value="30d">Expires in 30 days</option>
                    <option value="90d">Expires in 90 days</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={createShare}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Creating...' : 'Create Share Link'}
              </Button>
            </div>

            {/* Share Links List */}
            <div className="space-y-2">
              <h3 className="font-semibold">Active Shares</h3>
              <ScrollArea className="h-[300px] border border-border rounded-lg p-4">
                {shares.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm">
                    No active shares
                  </p>
                ) : (
                  <div className="space-y-2">
                    {shares.map((share) => {
                      const shareUrl = `${window.location.origin}/share/${share.share_token}`;
                      const isExpired =
                        share.expires_at &&
                        new Date(share.expires_at) < new Date();

                      return (
                        <div
                          key={share.id}
                          className="bg-card border border-border rounded-lg p-3 space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 flex items-center gap-2">
                              {share.is_public ? (
                                <Globe className="h-4 w-4 text-primary" />
                              ) : (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground truncate">
                                  {shareUrl}
                                </p>
                                {share.expires_at && !isExpired && (
                                  <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                                    <Clock className="h-3 w-3" />
                                    Expires{' '}
                                    {new Date(
                                      share.expires_at
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                                {isExpired && (
                                  <p className="text-xs text-red-600">
                                    Expired
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={() => copyShareLink(share.share_token)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0"
                                  >
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => deleteShare(share.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Revoke
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {share.access_count} views
                            </span>
                            {share.password && (
                              <span className="text-xs bg-amber-10 text-amber-600 px-2 py-1 rounded">
                                Password protected
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-4">
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="space-y-2">
                <Label>Add Comment</Label>
                <textarea
                  placeholder="Add your comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                  rows={3}
                />
              </div>
              <Button
                onClick={() => addComment(chatId)}
                disabled={!newComment.trim()}
                size="sm"
                className="w-full"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </div>

            {/* Comments List */}
            <ScrollArea className="h-[300px] border border-border rounded-lg p-4">
              {comments.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm">
                  No comments yet
                </p>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-card border border-border rounded-lg p-3 space-y-2"
                    >
                      <p className="text-sm break-words">{comment.content}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleString()}
                        </p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2"
                            >
                              <SmilePlus className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {EMOJI_REACTIONS.map((emoji) => (
                              <DropdownMenuItem
                                key={emoji}
                                onClick={() =>
                                  addReaction(comment.id, emoji)
                                }
                              >
                                {emoji}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {Object.keys(comment.reactions || {}).length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {Object.entries(comment.reactions).map(
                            ([emoji, count]) => (
                              <span
                                key={emoji}
                                className="text-xs bg-secondary px-2 py-1 rounded cursor-pointer hover:bg-secondary/80"
                                onClick={() =>
                                  addReaction(comment.id, emoji)
                                }
                              >
                                {emoji} {count}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
