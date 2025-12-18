import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { botService } from '@/services/botService';
import { Bot } from '@/types/chat';
import BotCard from '@/components/BotCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import MotionBackground from '@/components/MotionBackground';

const CATEGORIES = [
  'all',
  'general',
  'coding',
  'writing',
  'research',
  'creative',
  'tutoring',
  'business',
];

const BotsGallery = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const loadBots = async () => {
      try {
        setLoading(true);
        const botList = await botService.fetchBots(user?.id, selectedCategory);
        setBots(botList);
      } catch (error) {
        console.error('Error loading bots:', error);
        toast.error('Failed to load bots');
      } finally {
        setLoading(false);
      }
    };

    loadBots();
  }, [user?.id, selectedCategory]);

  const filteredBots = bots.filter((bot) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      bot.name.toLowerCase().includes(query) ||
      (bot.description?.toLowerCase().includes(query) ?? false)
    );
  });

  return (
    <div className="flex flex-col h-screen w-screen bg-background overflow-hidden">
      <MotionBackground />
      
      <Header
        showMenuButton={false}
        user={user}
        onSignOut={signOut}
      />

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Onyx Bots Gallery</h1>
            <p className="text-muted-foreground mb-6">
              Discover and use AI bots tailored for different tasks
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-6">
              <Button
                onClick={() => navigate('/bot/create')}
                className="gap-2"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Create Bot
              </Button>
              <Button
                onClick={() => navigate('/chat')}
                variant="outline"
                size="sm"
              >
                Back to Chat
              </Button>
            </div>
          </div>

          {/* Search & Filter Section */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search bots by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Bots Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredBots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBots.map((bot) => (
                <BotCard
                  key={bot.uuid}
                  bot={bot}
                  onClick={() => navigate(`/bot/${bot.uuid}`)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <p className="text-lg mb-2">No bots found</p>
              <p className="text-sm">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first bot to get started'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BotsGallery;
