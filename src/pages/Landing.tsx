import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Sparkles, Zap, Globe, Shield, Image as ImageIcon, Brain } from "lucide-react";
import { SEO } from "@/components/SEO";

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      navigate('/chat');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 overflow-hidden">
      <SEO
        title="OnyxGPT: 500+ AI Models | ChatGPT & Claude Alternative"
        description="Access 500+ AI models with higher rate limits than ChatGPT. All ChatGPT features plus vision, image generation, and web search. A powerful OpenAI, Claude, Perplexity alternative."
        canonical="https://f65a04f8-7aee-4309-9141-8488d933011b.lovableproject.com/"
        keywords={["OpenAI", "ChatGPT alternative", "Claude alternative", "Perplexity alternative", "AI chat", "AI models", "higher rate limits"]}
      />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center space-y-8 md:space-y-12 animate-fade-in">
          {/* Hero Section */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent animate-gradient">
              OnyxGPT — 500+ AI Models | ChatGPT, Claude, Perplexity Alternative
            </h1>
            
            <p className="text-xl md:text-3xl font-semibold text-foreground max-w-4xl mx-auto">
              Higher rate limits than ChatGPT. All ChatGPT features—plus vision, images, and web search.
            </p>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Access cutting-edge AI from OpenAI, Google, Anthropic, xAI, Meta, and more—all in one place
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 glow-blue-strong"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/chat")}
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Try as Guest
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16">
            <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary transition-all duration-300 hover:glow-blue animate-scale-in">
              <Brain className="w-12 h-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Advanced Reasoning</h3>
              <p className="text-muted-foreground">GPT-5, Claude Sonnet 4.5, Gemini 2.5 Pro, DeepSeek R1</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary transition-all duration-300 hover:glow-blue animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <Zap className="w-12 h-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">GPT-5 Mini, Gemini Flash, Claude Haiku for instant responses</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary transition-all duration-300 hover:glow-blue animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <ImageIcon className="w-12 h-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Vision AI</h3>
              <p className="text-muted-foreground">Upload images and get detailed analysis with multimodal AI</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary transition-all duration-300 hover:glow-blue animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <Globe className="w-12 h-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Web Search</h3>
              <p className="text-muted-foreground">Real-time information with deep search capabilities</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary transition-all duration-300 hover:glow-blue animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <Shield className="w-12 h-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Uncensored Models</h3>
              <p className="text-muted-foreground">Dolphin Mistral Venice and other unrestricted AI models</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary transition-all duration-300 hover:glow-blue animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <Sparkles className="w-12 h-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Image Generation</h3>
              <p className="text-muted-foreground">Create stunning visuals with Flux, Kontext, and more</p>
            </div>
          </div>

          {/* Model Providers */}
          <div className="mt-16 space-y-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Powered By Leading AI Providers</p>
            <div className="flex flex-wrap justify-center gap-6 text-muted-foreground text-lg font-medium">
              <span className="hover:text-primary transition-colors">OpenAI</span>
              <span className="hover:text-primary transition-colors">Google</span>
              <span className="hover:text-primary transition-colors">Anthropic</span>
              <span className="hover:text-primary transition-colors">xAI</span>
              <span className="hover:text-primary transition-colors">Meta</span>
              <span className="hover:text-primary transition-colors">DeepSeek</span>
              <span className="hover:text-primary transition-colors">Perplexity</span>
              <span className="hover:text-primary transition-colors">Qwen</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
