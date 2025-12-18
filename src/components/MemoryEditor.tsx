import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Memory } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Save, Brain, Search, Tag, Calendar, AlertCircle, Filter, X } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const memorySchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Title cannot be empty'),
  // No max length - unlimited title
  content: z.string()
    .trim()
    .min(1, 'Content cannot be empty')
    // No max length - unlimited content
});

const PRESET_CATEGORIES = [
  'Personal',
  'Work',
  'Preferences',
  'Skills',
  'Goals',
  'Projects',
  'Health',
  'Notes',
  'Other'
];

const ORGANIZATIONS = [
  'Personal',
  'Work',
  'Education',
  'Freelance',
  'Startup',
  'Enterprise',
  'Other'
];

const IMPORTANCE_COLORS = {
  low: 'bg-blue-500/20 text-blue-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-red-500/20 text-red-400'
};

const MemoryEditor = () => {
  const [memories, setMemories] = useState<Memory[]>(storage.getMemories());
  const [filteredMemories, setFilteredMemories] = useState<Memory[]>(memories);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<string>('Personal');
  const [newOrganization, setNewOrganization] = useState<string>('Personal');
  const [newImportance, setNewImportance] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTags, setNewTags] = useState('');
  const [newExpiresIn, setNewExpiresIn] = useState<string>('never');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterImportance, setFilterImportance] = useState<string>('all');
  const [filterOrganization, setFilterOrganization] = useState<string>('all');
  const [editCategory, setEditCategory] = useState<string>('');
  const [editOrganization, setEditOrganization] = useState<string>('');
  const [editImportance, setEditImportance] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    // Auto-clean expired memories
    storage.cleanExpiredMemories();
    setMemories(storage.getMemories());
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = memories;

    if (searchQuery) {
      filtered = storage.searchMemories(searchQuery);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(m => m.category === filterCategory);
    }

    if (filterImportance !== 'all') {
      filtered = filtered.filter(m => m.importance === filterImportance);
    }

    if (filterOrganization !== 'all') {
      filtered = filtered.filter(m => m.organization === filterOrganization);
    }

    setFilteredMemories(filtered);
  }, [searchQuery, filterCategory, filterImportance, filterOrganization, memories]);

  const calculateExpiresAt = (expiresIn: string): number | undefined => {
    if (expiresIn === 'never') return undefined;
    
    const now = Date.now();
    const durations: Record<string, number> = {
      '1day': 24 * 60 * 60 * 1000,
      '1week': 7 * 24 * 60 * 60 * 1000,
      '1month': 30 * 24 * 60 * 60 * 1000,
      '3months': 90 * 24 * 60 * 60 * 1000,
      '6months': 180 * 24 * 60 * 60 * 1000,
      '1year': 365 * 24 * 60 * 60 * 1000
    };
    
    return now + (durations[expiresIn] || 0);
  };

  const handleAdd = () => {
    const result = memorySchema.safeParse({ title: newTitle, content: newContent });
    
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    const tags = newTags.split(',').map(t => t.trim()).filter(Boolean);

    const memory: Memory = {
      id: Date.now().toString(),
      title: result.data.title,
      content: result.data.content,
      timestamp: Date.now(),
      category: newCategory,
      importance: newImportance,
      tags: tags.length > 0 ? tags : undefined,
      expiresAt: calculateExpiresAt(newExpiresIn),
      autoExtracted: false,
      organization: newOrganization || 'Personal'
    };

    storage.addMemory(memory);
    setMemories([memory, ...memories]);
    setNewTitle('');
    setNewContent('');
    setNewCategory('Personal');
    setNewOrganization('Personal');
    setNewImportance('medium');
    setNewTags('');
    setNewExpiresIn('never');
    toast.success('Memory added');
  };

  const handleUpdate = (id: string, title: string, content: string, category: string, importance: 'low' | 'medium' | 'high', tags: string[], expiresAt?: number, organization?: string) => {
    const result = memorySchema.safeParse({ title, content });
    
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    storage.updateMemory(id, { 
      title: result.data.title, 
      content: result.data.content,
      category,
      importance,
      tags: tags.length > 0 ? tags : undefined,
      expiresAt,
      organization: organization || 'Personal'
    });
    
    setMemories(storage.getMemories());
    setEditingId(null);
    toast.success('Memory updated');
  };

  const handleDelete = (id: string) => {
    storage.deleteMemory(id);
    setMemories(storage.getMemories());
    toast.success('Memory deleted');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterCategory('all');
    setFilterImportance('all');
    setFilterOrganization('all');
  };

  const categories = storage.getMemoryCategories();
  const hasActiveFilters = searchQuery || filterCategory !== 'all' || filterImportance !== 'all' || filterOrganization !== 'all';

  const getCategoryStats = () => {
    const stats: Record<string, number> = {};
    memories.forEach(m => {
      const cat = m.category || 'Uncategorized';
      stats[cat] = (stats[cat] || 0) + 1;
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b border-border p-4 animate-fadeIn">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Enhanced Memory System</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Store, organize, and manage AI memory with categories, tags, search, and expiration
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="memories" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="memories">Memories ({memories.length})</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-4">
            <Card className="p-4 animate-slideUp glow-blue">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add New Memory
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Title</label>
                  <Input
                    placeholder="e.g., 'Favorite Color', 'Job Title'"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Content</label>
                  <Textarea
                    placeholder="e.g., 'Blue', 'Software Engineer'"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div>
                     <label className="text-sm text-muted-foreground mb-1 block">Category</label>
                     <Select value={newCategory} onValueChange={setNewCategory}>
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         {PRESET_CATEGORIES.map(cat => (
                           <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>

                   <div>
                     <label className="text-sm text-muted-foreground mb-1 block">Importance</label>
                     <Select value={newImportance} onValueChange={(v: any) => setNewImportance(v)}>
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="low">Low</SelectItem>
                         <SelectItem value="medium">Medium</SelectItem>
                         <SelectItem value="high">High</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 </div>

                 <div>
                   <label className="text-sm text-muted-foreground mb-1 block">Organization</label>
                   <Select value={newOrganization} onValueChange={setNewOrganization}>
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       {ORGANIZATIONS.map(org => (
                         <SelectItem key={org} value={org}>{org}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Tags (comma-separated)</label>
                  <Input
                    placeholder="e.g., important, work, personal"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Expires In</label>
                  <Select value={newExpiresIn} onValueChange={setNewExpiresIn}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="1day">1 Day</SelectItem>
                      <SelectItem value="1week">1 Week</SelectItem>
                      <SelectItem value="1month">1 Month</SelectItem>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleAdd} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Memory
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="memories" className="space-y-4">
            {/* Search and Filters */}
            <Card className="p-4">
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search memories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                   <Select value={filterCategory} onValueChange={setFilterCategory}>
                     <SelectTrigger className="flex-1 min-w-[150px]">
                       <SelectValue placeholder="Category" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">All Categories</SelectItem>
                       {categories.map(cat => (
                         <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>

                   <Select value={filterImportance} onValueChange={setFilterImportance}>
                     <SelectTrigger className="flex-1 min-w-[150px]">
                       <SelectValue placeholder="Importance" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">All Importance</SelectItem>
                       <SelectItem value="high">High</SelectItem>
                       <SelectItem value="medium">Medium</SelectItem>
                       <SelectItem value="low">Low</SelectItem>
                     </SelectContent>
                   </Select>

                   <Select value={filterOrganization} onValueChange={setFilterOrganization}>
                     <SelectTrigger className="flex-1 min-w-[150px]">
                       <SelectValue placeholder="Organization" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">All Organizations</SelectItem>
                       {ORGANIZATIONS.map(org => (
                         <SelectItem key={org} value={org}>{org}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>

                   {hasActiveFilters && (
                     <Button variant="outline" size="icon" onClick={clearFilters}>
                       <X className="w-4 h-4" />
                     </Button>
                   )}
                 </div>
              </div>
            </Card>

            {/* Memories List */}
            <div className="space-y-3">
              {filteredMemories.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <AlertCircle className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    {hasActiveFilters ? 'No memories match your filters' : 'No memories stored yet'}
                  </p>
                </div>
              ) : (
                filteredMemories.map((memory) => {
                  const isExpired = memory.expiresAt && memory.expiresAt < Date.now();
                  const daysUntilExpiry = memory.expiresAt 
                    ? Math.ceil((memory.expiresAt - Date.now()) / (1000 * 60 * 60 * 24))
                    : null;

                  return (
                    <Card key={memory.id} className={`p-4 animate-slideUp hover:shadow-lg transition-all ${isExpired ? 'opacity-50' : ''}`}>
                      {editingId === memory.id ? (
                        <div className="space-y-3">
                          <Input
                            defaultValue={memory.title || memory.key}
                            id={`title-${memory.id}`}
                            placeholder="Title"
                          />
                          <Textarea
                            defaultValue={memory.content || memory.value}
                            id={`content-${memory.id}`}
                            rows={2}
                            placeholder="Content"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Select value={editCategory} onValueChange={setEditCategory}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {PRESET_CATEGORIES.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select value={editImportance} onValueChange={(v: any) => setEditImportance(v)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Select value={editOrganization} onValueChange={setEditOrganization}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ORGANIZATIONS.map(org => (
                                <SelectItem key={org} value={org}>{org}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            defaultValue={memory.tags?.join(', ') || ''}
                            placeholder="Tags (comma-separated)"
                            id={`tags-${memory.id}`}
                          />
                          <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                  const title = (document.getElementById(`title-${memory.id}`) as HTMLInputElement).value;
                                  const content = (document.getElementById(`content-${memory.id}`) as HTMLTextAreaElement).value;
                                  const tagsInput = (document.getElementById(`tags-${memory.id}`) as HTMLInputElement).value;
                                  const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
                                  handleUpdate(memory.id, title, content, editCategory, editImportance, tags, memory.expiresAt, editOrganization);
                                }}
                               className="flex-1"
                             >
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingId(null)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">{memory.title || memory.key}</h3>
                              {memory.category && (
                                <Badge variant="outline" className="text-xs">
                                  {memory.category}
                                </Badge>
                              )}
                              {memory.organization && (
                                <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-400">
                                  {memory.organization}
                                </Badge>
                              )}
                              {memory.importance && (
                                <Badge className={`text-xs ${IMPORTANCE_COLORS[memory.importance]}`}>
                                  {memory.importance}
                                </Badge>
                              )}
                              {memory.autoExtracted && (
                                <Badge variant="secondary" className="text-xs">
                                  Auto
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {new Date(memory.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <p className="text-sm mb-3 whitespace-pre-wrap">{memory.content || memory.value}</p>
                          
                          {memory.tags && memory.tags.length > 0 && (
                            <div className="flex gap-1 flex-wrap mb-3">
                              {memory.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {memory.expiresAt && (
                            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {isExpired ? (
                                <span className="text-red-500">Expired</span>
                              ) : (
                                <span>Expires in {daysUntilExpiry} days</span>
                              )}
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <Button
                               variant="outline"
                               size="sm"
                               onClick={() => {
                                 setEditingId(memory.id);
                                 setEditCategory(memory.category || 'Personal');
                                 setEditOrganization(memory.organization || 'Personal');
                                 setEditImportance(memory.importance || 'medium');
                               }}
                               className="flex-1"
                             >
                               Edit
                             </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(memory.id)}
                              className="flex-1"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <Card className="p-4">
              <h2 className="font-semibold mb-4">Memory Statistics</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Total Memories</p>
                  <p className="text-3xl font-bold">{memories.length}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">By Category</p>
                  <div className="space-y-2">
                    {Object.entries(categoryStats).map(([cat, count]) => (
                      <div key={cat} className="flex justify-between items-center">
                        <span className="text-sm">{cat}</span>
                        <Badge>{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">By Importance</p>
                  <div className="space-y-2">
                    {(['high', 'medium', 'low'] as const).map(imp => {
                      const count = memories.filter(m => m.importance === imp).length;
                      return (
                        <div key={imp} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{imp}</span>
                          <Badge className={IMPORTANCE_COLORS[imp]}>{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Auto-Extracted</p>
                  <p className="text-2xl font-bold">
                    {memories.filter(m => m.autoExtracted).length}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Expiring Soon (within 7 days)</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {memories.filter(m => {
                      if (!m.expiresAt) return false;
                      const daysUntil = (m.expiresAt - Date.now()) / (1000 * 60 * 60 * 24);
                      return daysUntil > 0 && daysUntil <= 7;
                    }).length}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MemoryEditor;
