import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AppSettings } from '@/types/chat';
import { getAllTextModels, IMAGE_MODELS } from '@/lib/models';
import { beautifyModelName, getCustomModels, addCustomModel, removeCustomModel } from '@/lib/model-utils';
import { getAllTriggers } from '@/lib/triggers';
import { toast } from 'sonner';
import { Download, Upload, LogOut, LogIn, Trash2, Plus, X, BarChart3 } from 'lucide-react';
import { ThemeCustomizer } from '@/components/ThemeCustomizer';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onExportChats: () => void;
  onImportChats: (file: File) => void;
  onClearAllData: () => void;
}

const SettingsPanel = ({
  settings,
  onUpdateSettings,
  onExportChats,
  onImportChats,
  onClearAllData,
}: SettingsPanelProps) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [isPuterSignedIn, setIsPuterSignedIn] = useState(false);
  const [customModelInput, setCustomModelInput] = useState('');
  const [customModels, setCustomModels] = useState<string[]>(getCustomModels());
  const [modelSearch, setModelSearch] = useState('');
  const [isTextModelOpen, setIsTextModelOpen] = useState(false);

  // Get all models including custom ones
  const ALL_TEXT_MODELS = getAllTextModels();
  
  // Filter models based on search
  const filteredModels = ALL_TEXT_MODELS.filter((model: any) => 
    model.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
    model.provider.toLowerCase().includes(modelSearch.toLowerCase()) ||
    model.id.toLowerCase().includes(modelSearch.toLowerCase())
  );

  const handleSave = () => {
    onUpdateSettings(localSettings);
    toast.success('Settings saved');
  };

  const handlePuterSignIn = async () => {
    try {
      // @ts-ignore - Puter is loaded via script tag
      await puter.auth.signIn();
      setIsPuterSignedIn(true);
      toast.success('Signed in to Puter');
    } catch (error) {
      toast.error('Failed to sign in to Puter');
    }
  };

  const handlePuterSignOut = async () => {
    try {
      // @ts-ignore
      await puter.auth.signOut();
      setIsPuterSignedIn(false);
      toast.success('Signed out from Puter');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportChats(file);
    }
  };

  const handleAddCustomModel = () => {
    if (!customModelInput.trim()) {
      toast.error('Please enter a model ID');
      return;
    }

    const modelId = customModelInput.trim();
    const prefix = localSettings.customModelPrefix || 'openrouter';
    const success = addCustomModel(modelId, prefix);
    
    if (success) {
      setCustomModels(getCustomModels());
      setCustomModelInput('');
      toast.success(`Added custom model: ${beautifyModelName(modelId)}`);
    } else {
      toast.error('Model already exists');
    }
  };

  const handleRemoveCustomModel = (modelId: string) => {
    removeCustomModel(modelId);
    setCustomModels(getCustomModels());
    toast.success('Custom model removed');
  };

  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden">
      <div className="max-w-6xl mx-auto p-3 md:p-6 space-y-6">
      <div className="space-y-2 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your AI models, theme, and data preferences</p>
        </div>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="settings">Preferences</TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
      {/* Theme Customization */}
      <ThemeCustomizer settings={localSettings} onUpdateSettings={onUpdateSettings} />

      {/* Puter Account */}
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Puter Account</h2>
          <p className="text-sm text-muted-foreground">
            Sign in to a Puter account to use AI features. Get 400M free tokens per month per account.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {!isPuterSignedIn ? (
            <Button onClick={handlePuterSignIn} size="lg" className="glow-blue">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In to Puter
            </Button>
          ) : (
            <Button onClick={handlePuterSignOut} variant="outline" size="lg">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          )}
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.open('https://puter.com', '_blank')}
          >
            Create New Account
          </Button>
        </div>
        
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm"><strong>Check Usage:</strong> Go to puter.com → Settings → Usage</p>
        </div>
      </Card>



      {/* Model Selection */}
      <Card className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">AI Models</h2>
          <p className="text-sm text-muted-foreground">Choose your preferred AI models and configure parameters</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="text-model">Text Model (Standard)</Label>
            <Select
              open={isTextModelOpen}
              onOpenChange={setIsTextModelOpen}
              value={localSettings.textModel}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, textModel: value })
              }
            >
              <SelectTrigger id="text-model" className="bg-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                className="max-h-[400px]"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <div className="px-2 pb-2 sticky top-0 bg-popover z-10">
                  <Input
                    placeholder="Search models..."
                    value={modelSearch}
                    onChange={(e) => setModelSearch(e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onFocusCapture={(e) => e.stopPropagation()}
                    inputMode="search"
                    className="h-8 text-sm"
                  />
                </div>
                {filteredModels.filter((model: any) => !model.isCustom && model.id.includes('venice')).length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">🐬 Uncensored Model (OpenRouter)</div>
                    {filteredModels.filter((model: any) => !model.isCustom && model.id.includes('venice')).map((model: any) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </>
                )}
                {filteredModels.filter((model: any) => !model.isCustom && !model.id.includes('venice') && (model.id.includes('gpt-5') || model.id.includes('claude-sonnet-4.5') || model.id.includes('gemini-2.5-pro') || model.id.includes('deepseek-r1') || model.id.includes('grok-3') || model.id.includes('llama-4') || model.id.includes('qwen3-max') || model.id.includes('sonar-pro'))).length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">⚡ Featured Models (Puter JS)</div>
                    {filteredModels.filter((model: any) => !model.isCustom && !model.id.includes('venice') && (model.id.includes('gpt-5') || model.id.includes('claude-sonnet-4.5') || model.id.includes('gemini-2.5-pro') || model.id.includes('deepseek-r1') || model.id.includes('grok-3') || model.id.includes('llama-4') || model.id.includes('qwen3-max') || model.id.includes('sonar-pro'))).map((model: any) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name} ({model.provider})
                      </SelectItem>
                    ))}
                  </>
                )}
                {filteredModels.filter((model: any) => !model.isCustom && !model.id.includes('venice') && !model.id.includes('gpt-5') && !model.id.includes('claude-sonnet-4.5') && !model.id.includes('gemini-2.5-pro') && !model.id.includes('deepseek-r1') && !model.id.includes('grok-3') && !model.id.includes('llama-4') && !model.id.includes('qwen3-max') && !model.id.includes('sonar-pro')).length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">🚀 Other Models (Puter JS)</div>
                    {filteredModels.filter((model: any) => !model.isCustom && !model.id.includes('venice') && !model.id.includes('gpt-5') && !model.id.includes('claude-sonnet-4.5') && !model.id.includes('gemini-2.5-pro') && !model.id.includes('deepseek-r1') && !model.id.includes('grok-3') && !model.id.includes('llama-4') && !model.id.includes('qwen3-max') && !model.id.includes('sonar-pro')).map((model: any) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name} ({model.provider})
                      </SelectItem>
                    ))}
                  </>
                )}
                {filteredModels.length === 0 && (
                  <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                    No models found
                  </div>
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              🐬 Venice model uses OpenRouter (requires API key). All others use Puter JS.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-model-select">Text Model (Custom) ✨</Label>
            <Select
              value={customModels.includes(localSettings.textModel) ? localSettings.textModel : ''}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, textModel: value })
              }
            >
              <SelectTrigger id="custom-model-select" className="bg-input">
                <SelectValue placeholder="Select custom model" />
              </SelectTrigger>
              <SelectContent className="max-h-[400px]">
                {customModels.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No custom models added yet
                  </SelectItem>
                ) : (
                  customModels.map((modelId) => (
                    <SelectItem key={modelId} value={modelId}>
                      {beautifyModelName(modelId)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="image-model">Image Model</Label>
            <Select
              value={localSettings.imageModel}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, imageModel: value })
              }
            >
              <SelectTrigger id="image-model" className="bg-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name} - {model.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Custom Model Management */}
        <div className="border-t border-border pt-6 space-y-4">
          <div>
            <Label className="text-base font-semibold">Custom Model API Prefix</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Choose which API provider to use when adding custom models.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div 
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                localSettings.customModelPrefix === 'openrouter' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-border hover:border-blue-500/50'
              }`}
              onClick={() => setLocalSettings({ ...localSettings, customModelPrefix: 'openrouter' })}
            >
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                  {localSettings.customModelPrefix === 'openrouter' && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">OpenRouter</p>
                  <p className="text-xs text-muted-foreground">openrouter: prefix</p>
                </div>
              </div>
            </div>

            <div 
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                localSettings.customModelPrefix === 'togetherai' 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-border hover:border-green-500/50'
              }`}
              onClick={() => setLocalSettings({ ...localSettings, customModelPrefix: 'togetherai' })}
            >
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                  {localSettings.customModelPrefix === 'togetherai' && (
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">Together AI</p>
                  <p className="text-xs text-muted-foreground">togetherai: prefix</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <Label className="text-base font-semibold">Add Custom Model</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Add any custom model ID supported by your selected API provider.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="model-name (e.g. custom-model-v1)"
              value={customModelInput}
              onChange={(e) => setCustomModelInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomModel()}
              className="bg-input flex-1"
            />
            <Button onClick={handleAddCustomModel} className="glow-blue shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Model
            </Button>
          </div>
          
          {/* Custom Models List */}
          {customModels.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Your Custom Models ({customModels.length}):</Label>
              <div className="grid gap-2 max-h-[200px] overflow-y-auto">
                {customModels.map((modelId) => (
                  <div
                    key={modelId}
                    className="flex items-center justify-between bg-secondary/50 hover:bg-secondary/70 transition-colors rounded-lg p-3 text-sm group"
                  >
                    <span className="truncate flex-1 font-mono text-xs">{beautifyModelName(modelId)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 ml-2 opacity-60 group-hover:opacity-100"
                      onClick={() => handleRemoveCustomModel(modelId)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Model Parameters */}
        <div className="border-t border-border pt-6 space-y-6">
          <div>
            <Label className="text-base font-semibold">Model Parameters</Label>
            <p className="text-xs text-muted-foreground mt-1">Fine-tune AI behavior and response generation</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="temperature">Temperature</Label>
                <span className="text-sm font-medium">{localSettings.temperature}</span>
              </div>
              <Slider
                id="temperature"
                value={[localSettings.temperature]}
                onValueChange={([value]) =>
                  setLocalSettings({ ...localSettings, temperature: value })
                }
                min={0}
                max={2}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Lower = more focused and deterministic, Higher = more creative and random
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-tokens">Max Tokens</Label>
              <Input
                id="max-tokens"
                type="number"
                value={localSettings.maxTokens}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, maxTokens: parseInt(e.target.value) })
                }
                className="bg-input"
              />
              <p className="text-xs text-muted-foreground">
                Maximum length of generated responses
              </p>
            </div>
          </div>
        </div>



        {/* Advanced Options */}
        <div className="border-t border-border pt-6 space-y-4">
          <div>
            <Label className="text-base font-semibold">Advanced Options</Label>
            <p className="text-xs text-muted-foreground mt-1">Configure advanced AI behavior and privacy settings</p>
          </div>

          {/* Custom System Prompt */}
          <div className="space-y-3 p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="custom-prompt" className="text-base font-medium cursor-pointer flex items-center gap-2">
                  🤖 Custom System Prompt
                </Label>
                <p className="text-xs text-muted-foreground">
                  Override default AI behavior with your own system instructions
                </p>
              </div>
              <Switch
                id="custom-prompt-toggle"
                checked={localSettings.useCustomSystemPrompt || false}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, useCustomSystemPrompt: checked })
                }
              />
            </div>
            
            {localSettings.useCustomSystemPrompt && (
              <div className="pt-2 space-y-2">
                <textarea
                  id="custom-prompt"
                  placeholder="Enter your custom system prompt here..."
                  value={localSettings.customSystemPrompt || ''}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, customSystemPrompt: e.target.value })
                  }
                  className="w-full min-h-[120px] bg-background border border-border rounded-md p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground">
                  This will be prepended to all AI requests. Use this to customize the AI's personality, tone, or specific behaviors.
                </p>
              </div>
            )}
          </div>

          {/* Streaming Toggle */}
          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="streaming" className="text-base font-medium cursor-pointer flex items-center gap-2">
                ⚡ Enable Streaming Responses
              </Label>
              <p className="text-xs text-muted-foreground">
                Stream AI responses in real-time as they're generated (recommended for faster feedback)
              </p>
            </div>
            <Switch
              id="streaming"
              checked={localSettings.streamingEnabled !== false}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, streamingEnabled: checked })
              }
            />
          </div>

          {/* Debug Logs */}
          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="debug-logs" className="text-base font-medium cursor-pointer">
                🐛 Enable Debug Logs
              </Label>
              <p className="text-xs text-muted-foreground">
                Log detailed API requests, responses, and errors to browser console for troubleshooting
              </p>
            </div>
            <Switch
              id="debug-logs"
              checked={localSettings.enableDebugLogs || false}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, enableDebugLogs: checked })
              }
            />
          </div>
        </div>

        {/* Speech Settings */}
        <div className="border-t border-border pt-6 space-y-4">
          <div>
            <Label className="text-base font-semibold">🎙️ Speech & Audio Settings</Label>
            <p className="text-xs text-muted-foreground mt-1">Configure text-to-speech and voice input options</p>
          </div>

          {/* Speech Enabled Toggle */}
          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="speech-enabled" className="text-base font-medium cursor-pointer flex items-center gap-2">
                🔊 Enable Text-to-Speech
              </Label>
              <p className="text-xs text-muted-foreground">
                Listen to AI responses using the speak button below each message
              </p>
            </div>
            <Switch
              id="speech-enabled"
              checked={localSettings.speechEnabled || false}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, speechEnabled: checked })
              }
            />
          </div>

          {/* Speech Voice Selection */}
          {localSettings.speechEnabled && (
            <div className="space-y-2">
              <Label htmlFor="speech-voice">Voice</Label>
              <Select
                value={localSettings.speechVoice || 'nova'}
                onValueChange={(value) =>
                  setLocalSettings({ ...localSettings, speechVoice: value as any })
                }
              >
                <SelectTrigger id="speech-voice" className="bg-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alloy">
                    Alloy - Neutral, professional
                  </SelectItem>
                  <SelectItem value="echo">
                    Echo - Deep, resonant
                  </SelectItem>
                  <SelectItem value="fable">
                    Fable - Storyteller vibe
                  </SelectItem>
                  <SelectItem value="onyx">
                    Onyx - Warm, rich
                  </SelectItem>
                  <SelectItem value="nova">
                    Nova - Bright, friendly
                  </SelectItem>
                  <SelectItem value="shimmer">
                    Shimmer - Soft, melodic
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose your preferred voice for text-to-speech
              </p>
            </div>
          )}

          {/* Auto-Play Speech Toggle */}
          {localSettings.speechEnabled && (
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="auto-play-speech" className="text-base font-medium cursor-pointer flex items-center gap-2">
                  ▶️ Auto-Play Response Audio
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically play audio for all AI responses
                </p>
              </div>
              <Switch
                id="auto-play-speech"
                checked={localSettings.autoPlaySpeech || false}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, autoPlaySpeech: checked })
                }
              />
            </div>
          )}

          {/* Speech Info */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 space-y-2">
            <p className="text-sm"><strong>🎤 Voice Input:</strong> Click the mic button next to the send button to record and transcribe your message</p>
            <p className="text-sm"><strong>🔊 Response Audio:</strong> Click the speaker button under any AI response to listen to it</p>
            <p className="text-sm text-muted-foreground text-xs">Uses Pollinations AI API for speech generation and transcription</p>
          </div>
        </div>



        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} size="lg" className="glow-blue">
            Save Settings
          </Button>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Data Management</h2>
          <p className="text-sm text-muted-foreground">Export, import, or clear your chat data</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={onExportChats} variant="outline" size="lg">
            <Download className="w-4 h-4 mr-2" />
            Export All Chats
          </Button>
          <Button variant="outline" size="lg" onClick={() => document.getElementById('import-file')?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Import Chats
          </Button>
          <input
            id="import-file"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </div>

        <div className="border-t border-destructive/20 pt-4 mt-4">
          <Button
            variant="destructive"
            size="lg"
            onClick={() => {
              if (confirm('⚠️ This will permanently delete ALL your data including chats, settings, and custom models. This action cannot be undone. Are you absolutely sure?')) {
                onClearAllData();
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Data
          </Button>
        </div>
      </Card>

      {/* Rate Limit Info */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h2 className="text-xl font-semibold mb-3">💡 Rate Limit Information</h2>
        <div className="space-y-3 text-sm">
          <div className="bg-background/50 rounded-lg p-4 space-y-2">
            <p className="font-semibold text-destructive">
              Error: "Failed to get response from AI"
            </p>
            <p>
              This means you've exceeded the 400 million token limit. Create a new Puter account to
              get another 400M tokens instantly.
            </p>
          </div>
          <div className="flex items-center gap-2 text-primary font-medium">
            <span>📊 Track your usage:</span>
            <a 
              href="https://puter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              puter.com → Settings → Usage
            </a>
          </div>
        </div>
        </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
         <div className="space-y-4">
           <div>
             <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
             <p className="text-muted-foreground">Track your chat activity and model usage</p>
           </div>
           <AnalyticsDashboard />
         </div>
        </TabsContent>
        </Tabs>
        </div>
        </div>
        );
        };

        export default SettingsPanel;
