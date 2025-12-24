import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, RefreshCw, Pause, Play, Image as ImageIcon, MessageSquare } from 'lucide-react';

const IMAGE_PROMPTS = [
  "futuristic city skyline at sunset cyberpunk",
  "magical forest with glowing mushrooms fantasy",
  "astronaut floating in colorful nebula space",
  "underwater kingdom with bioluminescent creatures",
  "steampunk clockwork dragon mechanical",
  "zen garden with cherry blossoms japanese",
  "crystal cave with rainbow light reflections",
  "ancient temple ruins overgrown with nature",
];

const TEXT_PROMPTS = [
  "Write a haiku about artificial intelligence",
  "Give me a fun fact about space",
  "Write a short poem about the ocean",
  "Share an inspiring quote about creativity",
  "Tell me something interesting about nature",
  "Write a limerick about programming",
];

interface FeedImage {
  url: string;
  prompt: string;
  timestamp: number;
  loaded: boolean;
  error: boolean;
}

interface FeedText {
  content: string;
  prompt: string;
  timestamp: number;
}

const PollinationsFeed = () => {
  const [images, setImages] = useState<FeedImage[]>([]);
  const [texts, setTexts] = useState<FeedText[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingTexts, setLoadingTexts] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState<'images' | 'text'>('images');

  const fetchImage = useCallback(async () => {
    if (isPaused) return;
    
    const prompt = IMAGE_PROMPTS[Math.floor(Math.random() * IMAGE_PROMPTS.length)];
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=${seed}&nologo=true`;
    
    const newImage: FeedImage = {
      url: imageUrl,
      prompt,
      timestamp: Date.now(),
      loaded: false,
      error: false,
    };
    
    setImages(prev => [newImage, ...prev].slice(0, 6));
  }, [isPaused]);

  const handleImageLoad = (timestamp: number) => {
    setImages(prev => prev.map(img => 
      img.timestamp === timestamp ? { ...img, loaded: true } : img
    ));
  };

  const handleImageError = (timestamp: number) => {
    setImages(prev => prev.map(img => 
      img.timestamp === timestamp ? { ...img, error: true } : img
    ));
  };

  const fetchText = useCallback(async () => {
    if (isPaused) return;
    
    setLoadingTexts(true);
    try {
      const prompt = TEXT_PROMPTS[Math.floor(Math.random() * TEXT_PROMPTS.length)];
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
      const content = await response.text();
      
      const newText: FeedText = {
        content,
        prompt,
        timestamp: Date.now(),
      };
      
      setTexts(prev => [newText, ...prev].slice(0, 6));
    } catch (error) {
      console.error('Error fetching text:', error);
    } finally {
      setLoadingTexts(false);
    }
  }, [isPaused]);

  const refreshFeed = useCallback(() => {
    if (activeTab === 'images') {
      setLoadingImages(true);
      fetchImage();
      setTimeout(() => setLoadingImages(false), 1000);
    } else {
      fetchText();
    }
  }, [activeTab, fetchImage, fetchText]);

  // Initial load
  useEffect(() => {
    setLoadingImages(true);
    // Load initial images
    for (let i = 0; i < 3; i++) {
      setTimeout(() => fetchImage(), i * 500);
    }
    setTimeout(() => setLoadingImages(false), 2000);
    
    // Load initial texts
    fetchText();
  }, []);

  // Auto-refresh every 8 seconds
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      if (activeTab === 'images') {
        fetchImage();
      } else {
        fetchText();
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [isPaused, activeTab, fetchImage, fetchText]);

  return (
    <div className="w-full max-w-6xl mx-auto mt-16">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Live AI Generation Feed
        </h2>
        <p className="text-muted-foreground">
          Real-time AI-generated content powered by Pollinations.ai
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'images' | 'text')} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="images" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Images
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Text
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-2"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshFeed}
              disabled={loadingImages || loadingTexts}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${(loadingImages || loadingTexts) ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <TabsContent value="images" className="mt-0">
          {loadingImages && images.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img, index) => (
                <Card key={img.timestamp + index} className="overflow-hidden group hover:border-primary transition-all duration-300">
                  <CardContent className="p-0 relative aspect-square">
                    {!img.loaded && !img.error && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    )}
                    {img.error ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
                        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                        <p className="text-sm">Failed to load</p>
                      </div>
                    ) : (
                      <img
                        src={img.url}
                        alt={img.prompt}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${img.loaded ? 'opacity-100' : 'opacity-0'}`}
                        loading="lazy"
                        onLoad={() => handleImageLoad(img.timestamp)}
                        onError={() => handleImageError(img.timestamp)}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <p className="text-sm text-foreground line-clamp-2">{img.prompt}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="text" className="mt-0">
          {loadingTexts && texts.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {texts.map((text, index) => (
                <Card key={text.timestamp + index} className="hover:border-primary transition-all duration-300">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-2 italic">"{text.prompt}"</p>
                    <p className="text-foreground whitespace-pre-wrap">{text.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PollinationsFeed;
