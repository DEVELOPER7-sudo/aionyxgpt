import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Copy, Eye, Copy as CopyIcon } from 'lucide-react';
import { Trigger, addTrigger, updateTrigger, deleteTrigger, getAllTriggers } from '@/lib/triggers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'Reasoning & Analysis',
  'Research & Information',
  'Planning & Organization',
  'Communication & Style',
];

interface CustomTriggerManagerProps {
  onTriggerChange?: () => void;
}

export const CustomTriggerManager = ({ onTriggerChange }: CustomTriggerManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null);
  const [triggers, setTriggers] = useState<Trigger[]>(getAllTriggers().filter(t => t.custom));
  
  const [formData, setFormData] = useState({
    trigger: '',
    category: '',
    systemInstruction: '',
    example: '',
  });

  const resetForm = () => {
    setFormData({
      trigger: '',
      category: '',
      systemInstruction: '',
      example: '',
    });
    setEditingTrigger(null);
    setIsEditing(false);
  };

  const handleOpenDialog = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleEdit = (trigger: Trigger) => {
    setFormData({
      trigger: trigger.trigger,
      category: trigger.category,
      systemInstruction: trigger.systemInstruction,
      example: trigger.example,
    });
    setEditingTrigger(trigger);
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!formData.trigger.trim() || !formData.category || !formData.systemInstruction.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const newTrigger: Trigger = {
        trigger: formData.trigger.trim(),
        category: formData.category as any,
        systemInstruction: formData.systemInstruction.trim(),
        example: formData.example.trim(),
        enabled: true,
        custom: true,
      };

      if (isEditing && editingTrigger) {
        updateTrigger(editingTrigger.trigger, newTrigger);
        toast.success(`Trigger "${newTrigger.trigger}" updated successfully`);
      } else {
        addTrigger(newTrigger);
        toast.success(`Custom trigger "${newTrigger.trigger}" created successfully`);
      }

      setTriggers(getAllTriggers().filter(t => t.custom));
      resetForm();
      setIsOpen(false);
      onTriggerChange?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save trigger');
    }
  };

  const handleDelete = (triggerName: string) => {
    if (window.confirm(`Delete custom trigger "${triggerName}"?`)) {
      try {
        deleteTrigger(triggerName);
        setTriggers(getAllTriggers().filter(t => t.custom));
        toast.success(`Trigger "${triggerName}" deleted successfully`);
        onTriggerChange?.();
      } catch (error) {
        toast.error('Failed to delete trigger');
      }
    }
  };

  const handleCopyInstruction = (instruction: string) => {
    navigator.clipboard.writeText(instruction);
    toast.success('Instruction copied to clipboard');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Reasoning & Analysis':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'Research & Information':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'Planning & Organization':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      case 'Communication & Style':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Reasoning & Analysis':
        return '🧩';
      case 'Research & Information':
        return '🔍';
      case 'Planning & Organization':
        return '📋';
      case 'Communication & Style':
        return '✨';
      default:
        return '⚡';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Custom Triggers</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage your custom triggers
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} className="gap-2">
              <Plus className="w-4 h-4" />
              New Trigger
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Custom Trigger' : 'Create Custom Trigger'}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? 'Update your custom trigger settings'
                  : 'Create a new custom trigger to enhance your AI responses'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="trigger-name" className="text-sm font-semibold">
                  Trigger Name *
                </Label>
                <Input
                  id="trigger-name"
                  placeholder="e.g., code-review, summarize-action"
                  value={formData.trigger}
                  onChange={(e) =>
                    setFormData({ ...formData, trigger: e.target.value })
                  }
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use lowercase letters, hyphens, or underscores
                </p>
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-semibold">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger id="category" className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        <span className="flex items-center gap-2">
                          {getCategoryIcon(cat)} {cat}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="instruction" className="text-sm font-semibold">
                  System Instruction *
                </Label>
                <Textarea
                  id="instruction"
                  placeholder="Describe how the AI should respond when this trigger is used..."
                  value={formData.systemInstruction}
                  onChange={(e) =>
                    setFormData({ ...formData, systemInstruction: e.target.value })
                  }
                  className="mt-1 min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Be specific about the desired behavior and response format
                </p>
              </div>

              <div>
                <Label htmlFor="example" className="text-sm font-semibold">
                  Example Usage
                </Label>
                <Input
                  id="example"
                  placeholder="e.g., Use 'code-review' to analyze code quality and suggest improvements"
                  value={formData.example}
                  onChange={(e) =>
                    setFormData({ ...formData, example: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {isEditing ? 'Update Trigger' : 'Create Trigger'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Custom Triggers List */}
      {triggers.length > 0 ? (
        <div className="grid gap-3">
          {triggers.map((trigger) => (
            <Card
              key={trigger.trigger}
              className={cn(
                'p-4 border-2 transition-all duration-200 hover:shadow-lg',
                getCategoryColor(trigger.category)
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getCategoryIcon(trigger.category)}</span>
                    <Badge
                      variant="outline"
                      className="font-mono font-bold"
                    >
                      {trigger.trigger}
                    </Badge>
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                      Custom
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{trigger.category}</p>
                  <p className="text-sm leading-relaxed">{trigger.example || 'No example provided'}</p>
                  
                  <div className="mt-3 p-2 bg-background/50 rounded border border-border">
                    <p className="text-xs text-muted-foreground font-mono break-words max-h-[100px] overflow-y-auto">
                      {trigger.systemInstruction}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyInstruction(trigger.systemInstruction)}
                    title="Copy instruction"
                  >
                    <CopyIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(trigger)}
                    title="Edit trigger"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(trigger.trigger)}
                    title="Delete trigger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center border-dashed">
          <p className="text-muted-foreground mb-4">No custom triggers yet</p>
          <Button onClick={handleOpenDialog} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Create Your First Custom Trigger
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CustomTriggerManager;
