import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Zap, Shield, Globe, Image, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-block">
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 glow-blue">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">No API Keys Required</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            OnyxGPT
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Access <span className="text-primary font-semibold">500+ AI models</span> from OpenAI, Anthropic, Google, and more.
            <br />
            Zero setup. Zero API keys. Just pure AI power.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Link to="/chat">
              <Button size="lg" className="glow-blue-strong text-lg px-8 py-6">
                Start Chatting Free
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <Card className="p-6 border-primary/20 hover:border-primary/40 transition-all hover:glow-blue animate-slide-up">
            <MessageSquare className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">500+ Text Models</h3>
            <p className="text-muted-foreground">
              GPT-5, Claude Opus 4, Gemini 2.5 Pro, DeepSeek R1, Grok 3, Llama 4, and hundreds more
            </p>
          </Card>

          <Card className="p-6 border-primary/20 hover:border-primary/40 transition-all hover:glow-blue animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Image className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Image Generation</h3>
            <p className="text-muted-foreground">
              6 powerful image models including Flux, Turbo, and SeeDream. Just type /img to create
            </p>
          </Card>

          <Card className="p-6 border-primary/20 hover:border-primary/40 transition-all hover:glow-blue animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Globe className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Vision & Search</h3>
            <p className="text-muted-foreground">
              Upload images for analysis, enable web search, and use deep research on supported models
            </p>
          </Card>
        </div>

        {/* User Pays Concept */}
        <div className="mt-20 max-w-4xl mx-auto">
          <Card className="p-8 border-primary/30 bg-card/50 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">How It Works: User Pays Concept</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    This app uses <strong className="text-foreground">Puter.js</strong>, which provides free access to AI models through their platform.
                    You get <strong className="text-primary">400 million tokens per month</strong> completely free.
                  </p>
                  <p>
                    <strong className="text-foreground">No credit cards.</strong> No API keys. Just sign in with a Puter account and start using world-class AI models.
                  </p>
                  <p className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <span><strong>Rate Limit Info:</strong> If you see "Failed to get response from AI", you've used your monthly quota. Simply create a new Puter account at puter.com to get another 400M tokens.</span>
                  </p>
                  <p className="text-sm bg-primary/10 border border-primary/20 rounded-lg p-3 mt-4">
                    <strong>Check Your Usage:</strong> Go to puter.com → Settings → Usage to track your token consumption
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Model List */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Featured AI Providers</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {['OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'xAI', 'Meta', 'Mistral', 'Qwen', 'Perplexity', 'Microsoft'].map((provider) => (
              <div key={provider} className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/40 transition-all">
                <span className="font-medium">{provider}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link to="/chat">
            <Button size="lg" className="glow-blue-strong text-lg px-12 py-6">
              Launch OnyxGPT
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
