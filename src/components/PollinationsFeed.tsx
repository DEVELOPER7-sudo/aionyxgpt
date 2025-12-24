import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, RefreshCw, Pause, Play, Image as ImageIcon, MessageSquare, RotateCcw, AlertCircle } from 'lucide-react';

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
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  loaded: boolean;
  error: boolean;
  retryCount: number;
}

interface FeedText {
  id: string;
  content: string;
  prompt: string;
  timestamp: number;
  loading: boolean;
  error: boolean;
}

const PollinationsFeed = () => {
  const [images, setImages] = useState<FeedImage[]>([]);
  const [texts, setTexts] = useState<FeedText[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingTexts, setLoadingTexts] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState<'images' | 'text'>('images');

  const generateImageId = () => `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const generateTextId = () => `txt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const fetchImage = useCallback(async () => {
    if (isPaused) return;
    
    const prompt = IMAGE_PROMPTS[Math.floor(Math.random() * IMAGE_PROMPTS.length)];
    const seed = Math.floor(Math.random() * 1000000);
    const timestamp = Date.now();
    // Add cache buster and quality params for better loading
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=${seed}&nologo=true&t=${timestamp}`;
    
    const newImage: FeedImage = {
      id: generateImageId(),
      url: imageUrl,
      prompt,
      timestamp,
      loaded: false,
      error: false,
      retryCount: 0,
    };
    
    setImages(prev => [newImage, ...prev].slice(0, 6));
  }, [isPaused]);

  const handleImageLoad = (id: string) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, loaded: true, error: false } : img
    ));
  };

  const handleImageError = (id: string) => {
    setImages(prev => prev.map(img => {
      if (img.id === id) {
        // Auto-retry up to 2 times with new seed
        if (img.retryCount < 2) {
          const newSeed = Math.floor(Math.random() * 1000000);
          const newUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(img.prompt)}?width=512&height=512&seed=${newSeed}&nologo=true&t=${Date.now()}`;
          return { ...img, url: newUrl, retryCount: img.retryCount + 1, loaded: false, error: false };
        }
        return { ...img, error: true };
      }
      return img;
    }));
  };

  const retryImage = (id: string) => {
    setImages(prev => prev.map(img => {
      if (img.id === id) {
        const newSeed = Math.floor(Math.random() * 1000000);
        const newUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(img.prompt)}?width=512&height=512&seed=${newSeed}&nologo=true&t=${Date.now()}`;
        return { ...img, url: newUrl, loaded: false, error: false, retryCount: 0 };
      }
      return img;
    }));
  };

  const fetchText = useCallback(async () => {
    if (isPaused) return;
    
    const id = generateTextId();
    const prompt = TEXT_PROMPTS[Math.floor(Math.random() * TEXT_PROMPTS.length)];
    
    // Add placeholder entry while loading
    const newText: FeedText = {
      id,
      content: '',
      prompt,
      timestamp: Date.now(),
      loading: true,
      error: false,
    };
    
    setTexts(prev => [newText, ...prev].slice(0, 6));
    setLoadingTexts(true);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
      
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const content = await response.text();
      
      if (!content || content.trim().length === 0) {
        throw new Error('Empty response');
      }
      
      setTexts(prev => prev.map(t => 
        t.id === id ? { ...t, content, loading: false, error: false } : t
      ));
    } catch (error) {
      console.error('Error fetching text:', error);
      setTexts(prev => prev.map(t => 
        t.id === id ? { ...t, loading: false, error: true } : t
      ));
    } finally {
      setLoadingTexts(false);
    }
  }, [isPaused]);

  const retryText = async (id: string) => {
    const text = texts.find(t => t.id === id);
    if (!text) return;
    
    setTexts(prev => prev.map(t => 
      t.id === id ? { ...t, loading: true, error: false } : t
    ));
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(text.prompt)}`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const content = await response.text();
      
      if (!content || content.trim().length === 0) {
        throw new Error('Empty response');
      }
      
      setTexts(prev => prev.map(t => 
        t.id === id ? { ...t, content, loading: false, error: false } : t
      ));
    } catch (error) {
      setTexts(prev => prev.map(t => 
        t.id === id ? { ...t, loading: false, error: true } : t
      ));
    }
  };

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
    // Load initial images with stagger
    for (let i = 0; i < 3; i++) {
      setTimeout(() => fetchImage(), i * 800);
    }
    setTimeout(() => setLoadingImages(false), 3000);
    
    // Load initial texts
    fetchText();
  }, []);

  // Auto-refresh every 10 seconds (increased for stability)
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      if (activeTab === 'images') {
        fetchImage();
      } else {
        fetchText();
      }
    }, 10000);
    
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
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
              <p>No images yet. Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img) => (
                <Card key={img.id} className="overflow-hidden group hover:border-primary transition-all duration-300">
                  <CardContent className="p-0 relative aspect-square bg-muted">
                    {!img.loaded && !img.error && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted z-10">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                        <p className="text-xs text-muted-foreground">Generating...</p>
                      </div>
                    )}
                    {img.error ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground z-10">
                        <AlertCircle className="w-10 h-10 mb-2 text-destructive/70" />
                        <p className="text-sm mb-3">Failed to generate</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => retryImage(img.id)}
                          className="flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Retry
                        </Button>
                      </div>
                    ) : (
                      <img
                        src={img.url}
                        alt={img.prompt}
                        className={`w-full h-full object-cover transition-opacity duration-500 ${img.loaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => handleImageLoad(img.id)}
                        onError={() => handleImageError(img.id)}
                      />
                    )}
                    {img.loaded && !img.error && (
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <p className="text-sm text-foreground line-clamp-2">{img.prompt}</p>
                      </div>
                    )}
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
          ) : texts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
              <p>No text yet. Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {texts.map((text) => (
                <Card key={text.id} className="hover:border-primary transition-all duration-300">
                  <CardContent className="p-4 min-h-[120px]">
                    <p className="text-sm text-muted-foreground mb-2 italic">"{text.prompt}"</p>
                    {text.loading ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Generating response...</span>
                      </div>
                    ) : text.error ? (
                      <div className="flex flex-col items-start gap-2">
                        <p className="text-sm text-destructive/80 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Failed to generate
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => retryText(text.id)}
                          className="flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Retry
                        </Button>
                      </div>
                    ) : (
                      <p className="text-foreground whitespace-pre-wrap">{text.content}</p>
                    )}
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