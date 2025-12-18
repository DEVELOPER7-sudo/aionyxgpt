import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { botService } from '@/services/botService';
import { BotConfig } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import Header from '@/components/Header';
import MotionBackground from '@/components/MotionBackground';
import { Loader2, ArrowLeft, Upload } from 'lucide-react';

const CATEGORIES = [
  'general',
  'coding',
  'writing',
  'research',
  'creative',
  'tutoring',
  'business',
];

const BotCreator = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pfpFile, setPfpFile] = useState<File | null>(null);
  const [pfpPreview, setPfpPreview] = useState<string>('');

  const [formData, setFormData] = useState<BotConfig>({
    name: '',
    description: '',
    category: 'general',
    systemPrompt: '',
    visibility: 'private',
    capabilities: {
      memory: false,
      files: false,
      tools: [],
    },
  });

  const handlePfpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPfpFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPfpPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Bot name is required');
      return;
    }

    if (!formData.systemPrompt.trim()) {
      toast.error('System prompt is required');
      return;
    }

    if (!user?.id) {
      toast.error('You must be logged in to create a bot');
      return;
    }

    setLoading(true);

    try {
      const bot = await botService.createBot(formData, user.id, pfpFile || undefined);
      toast.success('Bot created successfully');
      navigate(`/bot/${bot.uuid}`);
    } catch (error) {
      console.error('Error creating bot:', error);
      toast.error('Failed to create bot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-background overflow-hidden">
      <MotionBackground />

      <Header showMenuButton={false} user={user} onSignOut={signOut} />

      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={() => navigate('/bots')}
              variant="ghost"
              size="sm"
              className="gap-2 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Gallery
            </Button>
            <h1 className="text-3xl font-bold mb-2">Create a New Bot</h1>
            <p className="text-muted-foreground">
              Build a custom AI bot with your own system prompt and capabilities
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bot Avatar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bot Avatar</CardTitle>
                <CardDescription>Upload a profile picture for your bot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {pfpPreview ? (
                    <img
                      src={pfpPreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {formData.name.charAt(0).toUpperCase() || 'B'}
                    </div>
                  )}
                  <label className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2 cursor-pointer"
                      asChild
                    >
                      <span>
                        <Upload className="w-4 h-4" />
                        Choose Image
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePfpChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Bot Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Code Assistant, Writing Coach"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="What does this bot do? Who is it for?"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select
                      value={formData.visibility}
                      onValueChange={(value: any) =>
                        setFormData({
                          ...formData,
                          visibility: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private (Only you)</SelectItem>
                        <SelectItem value="unlisted">Unlisted (Link only)</SelectItem>
                        <SelectItem value="public">Public (Gallery)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Prompt */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Prompt *</CardTitle>
                <CardDescription>
                  Define how your bot behaves and what it specializes in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="You are a helpful AI assistant that specializes in..."
                  value={formData.systemPrompt}
                  onChange={(e) =>
                    setFormData({ ...formData, systemPrompt: e.target.value })
                  }
                  rows={6}
                  required
                />
              </CardContent>
            </Card>

            {/* Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Capabilities</CardTitle>
                <CardDescription>
                  Enable features for this bot
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="memory"
                    checked={formData.capabilities.memory}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        capabilities: {
                          ...formData.capabilities,
                          memory: checked as boolean,
                        },
                      })
                    }
                  />
                  <Label
                    htmlFor="memory"
                    className="font-normal cursor-pointer flex-1"
                  >
                    Memory
                    <p className="text-xs text-muted-foreground">
                      Enable user memory and context persistence
                    </p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="files"
                    checked={formData.capabilities.files}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        capabilities: {
                          ...formData.capabilities,
                          files: checked as boolean,
                        },
                      })
                    }
                  />
                  <Label
                    htmlFor="files"
                    className="font-normal cursor-pointer flex-1"
                  >
                    File Upload
                    <p className="text-xs text-muted-foreground">
                      Allow users to upload files for analysis
                    </p>
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="gap-2 flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Bot'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/bots')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BotCreator;
