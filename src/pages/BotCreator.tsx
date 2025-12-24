import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { botService } from '@/services/botService';
import { BotConfig, Bot } from '@/types/chat';
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
import { Loader2, ArrowLeft, Upload, Trash2 } from 'lucide-react';
import { generateRandomUsername } from '@/lib/username-generator';
import { useTheme } from '@/hooks/useTheme';

const CATEGORIES = [
  'general',
  'coding',
  'writing',
  'research',
  'creative',
  'tutoring',
  'business',
];

const MODELS = [
  { id: 'gpt-5', name: 'GPT-5' },
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'claude-sonnet', name: 'Claude Sonnet 4.5' },
  { id: 'gemini-2-5-pro', name: 'Gemini 2.5 Pro' },
  { id: 'deepseek-r1', name: 'DeepSeek R1' },
  { id: 'grok-3', name: 'Grok 3' },
  { id: 'custom', name: 'Custom Model' },
];

const BotCreator = () => {
  const navigate = useNavigate();
  const { uuid } = useParams<{ uuid?: string }>();
  const { user, signOut, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingBot, setLoadingBot] = useState(!!uuid);
  const [pfpFile, setPfpFile] = useState<File | null>(null);
  const [pfpPreview, setPfpPreview] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [existingBot, setExistingBot] = useState<Bot | null>(null);
  const [customModelId, setCustomModelId] = useState<string>('');

  // Apply main app theme from user settings
  useTheme();

  const [formData, setFormData] = useState<BotConfig>({
    name: '',
    description: '',
    category: 'general',
    systemPrompt: '',
    model_id: 'gpt-5',
    visibility: 'private',
    capabilities: {
      memory: false,
      files: false,
      tools: [],
    },
  });

  // Load existing bot if editing
  useEffect(() => {
    if (uuid) {
      const loadBot = async () => {
        try {
          const bot = await botService.fetchBotByUuid(uuid, user?.id);
          if (!bot || bot.creator_id !== user?.id) {
            toast.error('You do not have permission to edit this bot');
            navigate('/bots');
            return;
          }
          setExistingBot(bot);
          setIsEditing(true);
          setFormData({
            name: bot.name,
            description: bot.description || '',
            category: bot.category || 'general',
            systemPrompt: bot.system_prompt,
            model_id: bot.model_id,
            visibility: bot.visibility as 'private' | 'public' | 'unlisted',
            capabilities: bot.capabilities,
            pfpUrl: bot.pfp_url,
          });
          setPfpPreview(bot.pfp_url || '');
          setLoadingBot(false);
        } catch (error) {
          console.error('Error loading bot:', error);
          toast.error('Failed to load bot');
          navigate('/bots');
        }
      };
      loadBot();
    }
  }, [uuid, user?.id, navigate]);

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('You must be logged in to create a bot');
      navigate('/bots');
    }
  }, [user, authLoading, navigate]);

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

    // Validate model selection
    let finalModelId = formData.model_id;
    if (formData.model_id === 'custom') {
      if (!customModelId.trim()) {
        toast.error('Please enter a custom model ID');
        return;
      }
      finalModelId = customModelId.trim();
    }

    setLoading(true);

    try {
      let bot;
      const botConfig = { ...formData, model_id: finalModelId };

      if (isEditing && existingBot) {
        // Update existing bot
        bot = await botService.updateBot(
          existingBot.uuid,
          botConfig,
          user.id,
          pfpFile || undefined
        );
        toast.success('Bot updated successfully');
      } else {
        // Create new bot
        const creatorUsername = generateRandomUsername();
        bot = await botService.createBot(
          botConfig,
          user.id,
          creatorUsername,
          pfpFile || undefined
        );
        toast.success('Bot created successfully');
      }

      navigate(`/bot/${bot.uuid}`);
    } catch (error: any) {
      console.error('Error saving bot:', error);
      const errorMessage = error?.message || (isEditing ? 'Failed to update bot' : 'Failed to create bot');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBot = async () => {
    if (!existingBot || !user?.id) return;

    if (!window.confirm('Are you sure you want to delete this bot? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await botService.deleteBot(existingBot.uuid, user.id);
      toast.success('Bot deleted successfully');
      navigate('/bots');
    } catch (error) {
      console.error('Error deleting bot:', error);
      toast.error('Failed to delete bot');
    } finally {
      setLoading(false);
    }
  };

  if (loadingBot) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold mb-2">
              {isEditing ? 'Edit Bot' : 'Create a New Bot'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing
                ? 'Update your bot\'s configuration and behavior'
                : 'Build a custom AI bot with your own system prompt and capabilities'
              }
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

                <div className="grid grid-cols-3 gap-4">
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
                    <Label htmlFor="model">Model *</Label>
                    <Select
                      value={formData.model_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, model_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MODELS.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
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

                {/* Custom Model Input */}
                {formData.model_id === 'custom' && (
                  <div>
                    <Label htmlFor="customModel">Custom Model ID *</Label>
                    <Input
                      id="customModel"
                      placeholder="e.g., openrouter:anthropic/claude-3-opus"
                      value={customModelId}
                      onChange={(e) => setCustomModelId(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter the full model ID from your AI provider
                    </p>
                  </div>
                )}
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
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Bot' : 'Create Bot'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/bots')}
              >
                Cancel
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  disabled={loading}
                  onClick={handleDeleteBot}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BotCreator;
