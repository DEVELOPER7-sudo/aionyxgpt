import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  bold,
  italic,
  strikethrough,
  createLink,
  createCodeBlock,
  createHeading,
  createUnorderedList,
  createOrderedList,
  createBlockquote,
  createImage,
  getWordCount,
  getCharacterCount,
  estimateReadingTime,
  estimateTokenCount,
  stripMarkdown,
  DocumentTemplate,
  codeExamples,
} from '@/lib/markdown-utils';
import {
  Bold,
  Italic,
  Code,
  Link,
  Image,
  List,
  Heading2,
  Quote,
  Copy,
  Eye,
  FileText,
} from 'lucide-react';

interface MarkdownEditorProps {
  onContentChange?: (content: string) => void;
  initialContent?: string;
}

export const MarkdownEditor = ({ onContentChange, initialContent = '' }: MarkdownEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const updateContent = (newContent: string) => {
    setContent(newContent);
    onContentChange?.(newContent);
  };

  const insertMarkdown = (markdown: string) => {
    const textarea = document.querySelector('textarea[data-markdown]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);

      let newContent = content.substring(0, start);
      newContent += markdown.replace('{selected}', selectedText);
      newContent += content.substring(end);

      updateContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + markdown.indexOf('{selected}');
        textarea.selectionEnd = start + markdown.indexOf('{selected}') + selectedText.length;
      }, 0);
    }
  };

  const applyTemplate = (templateKey: string) => {
    const templates = DocumentTemplate as any;
    if (templates[templateKey]) {
      updateContent(templates[templateKey]());
      setSelectedTemplate(templateKey);
    }
  };

  const insertCodeExample = (exampleKey: string) => {
    const examples = codeExamples as any;
    if (examples[exampleKey]) {
      const example = examples[exampleKey]();
      updateContent(content + '\n\n' + example);
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(content);
    alert('Markdown copied to clipboard!');
  };

  const wordCount = getWordCount(content);
  const charCount = getCharacterCount(content);
  const readingTime = estimateReadingTime(content);
  const tokenCount = estimateTokenCount(content);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Markdown Editor</CardTitle>
          <CardDescription>Create and format markdown content with rich utilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            {/* Editor Tab */}
            <TabsContent value="editor" className="space-y-4">
              {/* Formatting Toolbar */}
              <div className="flex flex-wrap gap-2 pb-4 border-b">
                <div className="flex gap-1 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertMarkdown(`**{selected}**`)}
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertMarkdown(`*{selected}*`)}
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertMarkdown(`~~{selected}~~`)}
                    title="Strikethrough"
                  >
                    <s>S</s>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertMarkdown('`{selected}`')}
                    title="Inline Code"
                  >
                    <Code className="w-4 h-4" />
                  </Button>
                </div>

                <div className="border-l mx-1" />

                <div className="flex gap-1 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertMarkdown('## {selected}')}
                    title="Heading"
                  >
                    <Heading2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertMarkdown('- {selected}')}
                    title="Bullet List"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertMarkdown('> {selected}')}
                    title="Blockquote"
                  >
                    <Quote className="w-4 h-4" />
                  </Button>
                </div>

                <div className="border-l mx-1" />

                <div className="flex gap-1 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertMarkdown('[{selected}](url)')}
                    title="Link"
                  >
                    <Link className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertMarkdown('![alt text](image-url)')}
                    title="Image"
                  >
                    <Image className="w-4 h-4" />
                  </Button>
                </div>

                <div className="border-l mx-1 ml-auto" />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyMarkdown}
                  title="Copy Markdown"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              {/* Text Area */}
              <textarea
                data-markdown="true"
                value={content}
                onChange={(e) => updateContent(e.target.value)}
                placeholder="Enter your markdown content here..."
                className="w-full h-96 p-4 border rounded-md font-mono text-sm resize-none"
              />

              {/* Statistics */}
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                  <div className="font-semibold">{wordCount}</div>
                  <div className="text-xs text-muted-foreground">Words</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                  <div className="font-semibold">{charCount}</div>
                  <div className="text-xs text-muted-foreground">Characters</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                  <div className="font-semibold">{readingTime} min</div>
                  <div className="text-xs text-muted-foreground">Read Time</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                  <div className="font-semibold">{tokenCount}</div>
                  <div className="text-xs text-muted-foreground">Tokens (est.)</div>
                </div>
              </div>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap break-words">
                    {stripMarkdown(content) || 'No content to preview'}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Formats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        insertMarkdown(
                          `${createCodeBlock('console.log("Hello");', 'javascript')}`,
                        )
                      }
                    >
                      Code Block
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        insertMarkdown(
                          `\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n`,
                        )
                      }
                    >
                      Table
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => insertMarkdown('- [ ] Task 1\n- [ ] Task 2\n')}
                    >
                      Checklist
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => insertMarkdown('---')}
                    >
                      Horizontal Rule
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Code Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => insertCodeExample('hello_world_js')}
                  >
                    Hello World (JavaScript)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => insertCodeExample('hello_world_python')}
                  >
                    Hello World (Python)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => insertCodeExample('react_hook_example')}
                  >
                    React Hook Example
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => insertCodeExample('async_await_example')}
                  >
                    Async/Await Example
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Document Templates</CardTitle>
                  <CardDescription>Start with a pre-built template</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <Button
                    variant={selectedTemplate === 'README' ? 'default' : 'outline'}
                    size="sm"
                    className="justify-start"
                    onClick={() => applyTemplate('README')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    README Template
                  </Button>
                  <Button
                    variant={selectedTemplate === 'CHANGELOG' ? 'default' : 'outline'}
                    size="sm"
                    className="justify-start"
                    onClick={() => applyTemplate('CHANGELOG')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    CHANGELOG Template
                  </Button>
                  <Button
                    variant={selectedTemplate === 'API_DOC' ? 'default' : 'outline'}
                    size="sm"
                    className="justify-start"
                    onClick={() => applyTemplate('API_DOC')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    API Documentation
                  </Button>
                  <Button
                    variant={selectedTemplate === 'BUG_REPORT' ? 'default' : 'outline'}
                    size="sm"
                    className="justify-start"
                    onClick={() => applyTemplate('BUG_REPORT')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Bug Report
                  </Button>
                  <Button
                    variant={selectedTemplate === 'FEATURE_REQUEST' ? 'default' : 'outline'}
                    size="sm"
                    className="justify-start"
                    onClick={() => applyTemplate('FEATURE_REQUEST')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Feature Request
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarkdownEditor;
