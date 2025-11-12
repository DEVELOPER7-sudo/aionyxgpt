import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Bot,
  Globe,
  Lock,
  Play,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CustomBot } from '@/types/chat';
import {
  getAllBots,
  addBot,
  updateBot,
  deleteBot,
  exportBots,
  importBots,
  incrementBotUsage,
} from '@/lib/custom-bots';

interface CustomBotsManagerProps {
  onSelectBot?: (bot: CustomBot) => void;
}

const CustomBotsManager = ({ onSelectBot }: CustomBotsManagerProps) => {
  const [bots, setBots] = useState<CustomBot[]>(getAllBots());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<CustomBot | null>(null);
  const [filterPublic, setFilterPublic] = useState<'all' | 'public' | 'private'>('all');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    systemPrompt: '',
    logo: '',
    category: 'General',
    isPublic: true,
  });

  const categories = [
    'General',
    'Coding',
    'Writing',
    'Research',
    'Education',
    'Business',
    'Creative',
    'Entertainment',
    'Other',
  ];

  const refreshBots = () => {
    setBots(getAllBots());
  };

  const handleAddNew = () => {
    setEditingBot(null);
    setFormData({
      name: '',
      description: '',
      systemPrompt: '',
      logo: '',
      category: 'General',
      isPublic: true,
    });
    setDialogOpen(true);
  };

  const handleEdit = (bot: CustomBot) => {
    setEditingBot(bot);
    setFormData({
      name: bot.name,
      description: bot.description,
      systemPrompt: bot.systemPrompt,
      logo: bot.logo || '',
      category: bot.category || 'General',
      isPublic: bot.isPublic,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    try {
      if (!formData.name.trim()) {
        toast.error('Bot name is required');
        return;
      }
      if (!formData.systemPrompt.trim()) {
        toast.error('System prompt is required');
        return;
      }

      if (editingBot) {
        updateBot(editingBot.id, {
          name: formData.name,
          description: formData.description,
          systemPrompt: formData.systemPrompt,
          logo: formData.logo || undefined,
          category: formData.category,
          isPublic: formData.isPublic,
        });
        toast.success('Bot updated successfully');
      } else {
        addBot({
          name: formData.name,
          description: formData.description,
          systemPrompt: formData.systemPrompt,
          logo: formData.logo || undefined,
          category: formData.category,
          isPublic: formData.isPublic,
        });
        toast.success('Bot created successfully');
      }

      refreshBots();
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save bot');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this bot?')) {
      deleteBot(id);
      toast.success('Bot deleted');
      refreshBots();
    }
  };

  const handleUseBot = (bot: CustomBot) => {
    incrementBotUsage(bot.id);
    refreshBots();
    onSelectBot?.(bot);
    toast.success(`Using ${bot.name}`);
  };

  const handleExport = () => {
    exportBots();
    toast.success('Bots exported successfully');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importBots(file);
      refreshBots();
      toast.success('Bots imported successfully');
    } catch (error) {
      toast.error('Failed to import bots');
    }
    e.target.value = '';
  };

  const filteredBots = bots.filter(bot => {
    if (filterPublic === 'public') return bot.isPublic;
    if (filterPublic === 'private') return !bot.isPublic;
    return true;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Bot className="w-6 h-6" />
              Custom Bots
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage your AI-powered custom bots
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" asChild>
              <label className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Import
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImport}
                />
              </label>
            </Button>
            <Button onClick={handleAddNew} className="glow-blue">
              <Plus className="w-4 h-4 mr-2" />
              Create Bot
            </Button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <Button
            variant={filterPublic === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterPublic('all')}
          >
            All ({bots.length})
          </Button>
          <Button
            variant={filterPublic === 'public' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterPublic('public')}
          >
            <Globe className="w-3 h-3 mr-1" />
            Public ({bots.filter(b => b.isPublic).length})
          </Button>
          <Button
            variant={filterPublic === 'private' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterPublic('private')}
          >
            <Lock className="w-3 h-3 mr-1" />
            Private ({bots.filter(b => !b.isPublic).length})
          </Button>
        </div>
      </div>

      {/* Bot Cards */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {filteredBots.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No custom bots yet. Create your first one!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBots.map(bot => (
                <Card
                  key={bot.id}
                  className="p-4 hover:shadow-lg transition-all border-2 hover:border-primary/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {bot.logo ? (
                        <img src={bot.logo} alt={bot.name} className="w-12 h-12 rounded-lg" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                          <Bot className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-base">{bot.name}</h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          {bot.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant={bot.isPublic ? 'default' : 'secondary'} className="text-xs">
                      {bot.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {bot.description || 'No description'}
                  </p>

                  <div className="bg-muted/50 rounded p-2 mb-3">
                    <p className="text-xs text-muted-foreground font-mono line-clamp-3">
                      {bot.systemPrompt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>Used {bot.usageCount || 0} times</span>
                    <span>
                      {new Date(bot.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleUseBot(bot)}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Use Bot
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(bot)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(bot.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBot ? 'Edit Custom Bot' : 'Create Custom Bot'}
            </DialogTitle>
            <DialogDescription>
              {editingBot
                ? 'Modify your custom bot settings'
                : 'Create a new AI bot with custom system prompts'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Bot Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Code Helper Pro"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of what this bot does"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="logo">Logo URL (optional)</Label>
              <Input
                id="logo"
                value={formData.logo}
                onChange={e => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <Label htmlFor="systemPrompt">System Prompt *</Label>
              <Textarea
                id="systemPrompt"
                value={formData.systemPrompt}
                onChange={e => setFormData({ ...formData, systemPrompt: e.target.value })}
                placeholder="You are a helpful assistant specialized in..."
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This prompt defines the bot's behavior and personality
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isPublic">Make Public</Label>
                <p className="text-xs text-muted-foreground">
                  Allow others to discover and use this bot
                </p>
              </div>
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPublic: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="glow-blue">
              {editingBot ? 'Save Changes' : 'Create Bot'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomBotsManager;
