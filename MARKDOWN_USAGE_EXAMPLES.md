# Markdown Utilities - Usage Examples

Complete guide to using the markdown utilities library, components, and hooks.

---

## Table of Contents
1. [Library Functions](#library-functions)
2. [React Components](#react-components)
3. [React Hook](#react-hook)
4. [Real-World Examples](#real-world-examples)
5. [Integration Patterns](#integration-patterns)

---

## Library Functions

### `src/lib/markdown-utils.ts`

#### Code Block Creation

```typescript
import { createCodeBlock, createInlineCode } from '@/lib/markdown-utils';

// Create a code block with syntax highlighting
const jsCode = createCodeBlock(
  'const greeting = "Hello, World!";',
  'javascript'
);
// Output: ```javascript\nconst greeting = "Hello, World!";\n```

// Create inline code
const inline = createInlineCode('npm install');
// Output: `npm install`
```

#### Text Formatting

```typescript
import { bold, italic, strikethrough, underline } from '@/lib/markdown-utils';

const formatted = `
${bold('Important')} and ${italic('emphasized')} text
${strikethrough('deprecated feature')}
${underline('underlined text')}
`;
```

#### Lists

```typescript
import { 
  createUnorderedList, 
  createOrderedList, 
  createChecklistItems,
  createNestedList 
} from '@/lib/markdown-utils';

// Unordered list
const features = createUnorderedList([
  'React 18',
  'TypeScript',
  'Tailwind CSS'
]);

// Ordered list
const steps = createOrderedList([
  'Install dependencies',
  'Configure environment',
  'Start development server'
]);

// Checklist
const tasks = createChecklistItems(
  ['Setup', 'Development', 'Testing', 'Deployment'],
  [true, true, false, false]
);

// Nested list
const nested = createNestedList([
  { text: 'Frontend', children: ['React', 'TypeScript', 'Tailwind'] },
  { text: 'Backend', children: ['Node.js', 'Express', 'PostgreSQL'] }
]);
```

#### Tables

```typescript
import { createMarkdownTable, createDataTable } from '@/lib/markdown-utils';

// Using createMarkdownTable
const table = createMarkdownTable(
  ['Feature', 'Status', 'Priority'],
  [
    { Feature: 'Auth', Status: 'Done', Priority: 'High' },
    { Feature: 'API', Status: 'In Progress', Priority: 'High' },
    { Feature: 'UI', Status: 'Planned', Priority: 'Medium' }
  ]
);

// Using createDataTable with API response
const apiData = [
  { id: 1, name: 'John', role: 'Developer' },
  { id: 2, name: 'Jane', role: 'Designer' }
];
const dataTable = createDataTable(['id', 'name', 'role'], apiData);
```

#### Headings

```typescript
import { createH1, createH2, createH3, createHeading } from '@/lib/markdown-utils';

// Quick heading functions
const title = createH1('My Project');
const section = createH2('Features');
const subsection = createH3('Core Features');

// Generic heading function
const customHeading = createHeading(4, 'Subsection');
```

#### Links & Images

```typescript
import { createLink, createImage, createImageLink } from '@/lib/markdown-utils';

// Create links
const link = createLink('Visit OpenRouter', 'https://openrouter.ai');
const linkWithTitle = createLink(
  'Docs',
  'https://docs.example.com',
  'Official Documentation'
);

// Create images
const image = createImage('App Screenshot', 'https://example.com/screenshot.png');
const imageWithTitle = createImage(
  'Logo',
  'https://example.com/logo.png',
  'Brand Logo'
);

// Clickable images
const clickableImage = createImageLink(
  'Banner',
  'https://example.com/banner.png',
  'https://example.com'
);
```

#### Blockquotes

```typescript
import { createBlockquote, createCallout } from '@/lib/markdown-utils';

// Simple blockquote
const quote = createBlockquote('This is a quotation worthy of emphasis');

// Callout boxes
const note = createCallout('note', 'This is an important note');
const warning = createCallout('warning', 'Be careful with this feature');
const tip = createCallout('tip', 'Pro tip: Use keyboard shortcuts');
const danger = createCallout('danger', 'This action cannot be undone');
```

#### Math & Equations

```typescript
import { createInlineMath, createBlockMath } from '@/lib/markdown-utils';

// Inline math
const equation1 = createInlineMath('E = mc^2');

// Block math
const equation2 = createBlockMath(`
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
`);

// In context
const content = `
The famous equation ${createInlineMath('E = mc^2')} 
demonstrates the relationship between energy and mass.

${createBlockMath('E^2 = (pc)^2 + (mc^2)^2')}
```

#### Parsing & Extraction

```typescript
import { 
  extractCodeBlocks, 
  extractHeadings, 
  extractLinks 
} from '@/lib/markdown-utils';

const markdown = `
# My Document

Here's some code:
\`\`\`javascript
console.log('hello');
\`\`\`

Check out [this link](https://example.com)
`;

// Extract all code blocks
const codes = extractCodeBlocks(markdown);
// [{ language: 'javascript', code: 'console.log("hello");' }]

// Extract all headings
const headings = extractHeadings(markdown);
// [{ level: 1, text: 'My Document' }]

// Extract all links
const links = extractLinks(markdown);
// [{ text: 'this link', url: 'https://example.com' }]
```

#### Statistics

```typescript
import { 
  getWordCount, 
  getCharacterCount, 
  estimateReadingTime, 
  estimateTokenCount 
} from '@/lib/markdown-utils';

const content = 'Your markdown content here...';

const words = getWordCount(content);        // 4
const chars = getCharacterCount(content);   // 35
const readTime = estimateReadingTime(content); // ~1 min
const tokens = estimateTokenCount(content);    // ~9 tokens
```

#### Conversion

```typescript
import { stripMarkdown, markdownToHtml } from '@/lib/markdown-utils';

const markdown = `# Title
**Bold** and *italic* text`;

// Convert to plain text
const plainText = stripMarkdown(markdown);
// "Title\nBold and italic text"

// Convert to HTML
const html = markdownToHtml(markdown);
// "<h1>Title</h1><p><strong>Bold</strong> and <em>italic</em> text</p>"
```

#### Templates

```typescript
import { DocumentTemplate, codeExamples } from '@/lib/markdown-utils';

// Get README template
const readmeTemplate = DocumentTemplate.README();

// Get CHANGELOG template
const changelogTemplate = DocumentTemplate.CHANGELOG();

// Get code example
const helloWorldJS = codeExamples.hello_world_js();
```

#### Validation

```typescript
import { isValidMarkdown, validateCodeBlock } from '@/lib/markdown-utils';

// Check if markdown is valid
const valid = isValidMarkdown('```\ncode\n```'); // true
const invalid = isValidMarkdown('```\ncode\n`'); // false

// Validate code block language
const result = validateCodeBlock('javascript', 'const x = 1;');
// { valid: true, language: 'javascript' }

const result2 = validateCodeBlock('invalid-lang', 'code');
// { valid: false, language: 'plaintext' }
```

---

## React Components

### MarkdownEditor Component

#### Basic Usage

```typescript
import { MarkdownEditor } from '@/components/MarkdownEditor';

export function MyEditorPage() {
  const handleContentChange = (content: string) => {
    console.log('Updated content:', content);
    // Save to state, API, etc.
  };

  return (
    <MarkdownEditor onContentChange={handleContentChange} />
  );
}
```

#### With Initial Content

```typescript
import { MarkdownEditor } from '@/components/MarkdownEditor';

export function EditDocument() {
  const initialContent = `# My Document

This is a **great** document!
`;

  return (
    <MarkdownEditor 
      initialContent={initialContent}
      onContentChange={(content) => saveDocument(content)}
    />
  );
}
```

#### In a Dialog

```typescript
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Button } from '@/components/ui/button';

export function CreateDocumentDialog() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');

  const handleSave = async () => {
    await saveDocument(content);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create Document</Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
          </DialogHeader>
          
          <MarkdownEditor 
            onContentChange={setContent}
            initialContent={content}
          />
          
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### MarkdownShowcase Component

#### Basic Usage

```typescript
import { MarkdownShowcase } from '@/components/MarkdownShowcase';

export function ToolsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Markdown Tools</h1>
      <MarkdownShowcase />
    </div>
  );
}
```

#### In Settings/Help Page

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarkdownShowcase } from '@/components/MarkdownShowcase';

export function HelpPage() {
  return (
    <Tabs defaultValue="markdown">
      <TabsList>
        <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
        <TabsTrigger value="markdown">Markdown Help</TabsTrigger>
        <TabsTrigger value="faq">FAQ</TabsTrigger>
      </TabsList>

      <TabsContent value="markdown">
        <MarkdownShowcase />
      </TabsContent>
    </Tabs>
  );
}
```

---

## React Hook

### useMarkdown Hook

#### Statistics Only

```typescript
import { useMarkdown } from '@/hooks/useMarkdown';
import { Card, CardContent } from '@/components/ui/card';

export function DocumentStats({ content }: { content: string }) {
  const { stats } = useMarkdown(content);

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{stats.words}</div>
          <p className="text-sm text-muted-foreground">Words</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{stats.characters}</div>
          <p className="text-sm text-muted-foreground">Characters</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{stats.readingTime}</div>
          <p className="text-sm text-muted-foreground">Min Read</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{stats.tokens}</div>
          <p className="text-sm text-muted-foreground">Tokens</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### With Formatting

```typescript
import { useMarkdown } from '@/hooks/useMarkdown';
import { Button } from '@/components/ui/button';
import { Bold, Italic } from 'lucide-react';

export function TextFormatter() {
  const [text, setText] = useState('Select text to format');
  const { bold, italic, codeBlock } = useMarkdown();

  const applyBold = () => {
    setText(bold(text));
  };

  const applyItalic = () => {
    setText(italic(text));
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-32 p-4 border rounded"
      />

      <div className="flex gap-2">
        <Button onClick={applyBold} size="sm">
          <Bold className="w-4 h-4" />
        </Button>
        <Button onClick={applyItalic} size="sm">
          <Italic className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
```

#### Complete Example

```typescript
import { useMarkdown } from '@/hooks/useMarkdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CompleteMarkdownApp() {
  const [content, setContent] = useState('');
  const markdown = useMarkdown(content);

  const handleInsertTable = () => {
    const table = markdown.table(
      ['Column 1', 'Column 2'],
      [
        { 'Column 1': 'Data 1', 'Column 2': 'Data 2' },
        { 'Column 1': 'Data 3', 'Column 2': 'Data 4' }
      ]
    );
    setContent(content + '\n' + table);
  };

  const handleConvertToHtml = () => {
    const html = markdown.toHtml();
    console.log('HTML:', html);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter markdown..."
        className="w-full h-64 p-4 border rounded"
      />

      <div className="grid grid-cols-4 gap-2 text-sm">
        <Card>
          <CardContent className="pt-4">
            <div className="font-bold">{markdown.stats.words}</div>
            <p className="text-xs text-muted-foreground">Words</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="font-bold">{markdown.stats.readingTime}m</div>
            <p className="text-xs text-muted-foreground">Read Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="font-bold">{markdown.stats.codeBlocks}</div>
            <p className="text-xs text-muted-foreground">Code Blocks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="font-bold">{markdown.stats.links}</div>
            <p className="text-xs text-muted-foreground">Links</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleInsertTable}>Insert Table</Button>
        <Button onClick={handleConvertToHtml} variant="outline">
          Convert to HTML
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Extracted Elements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <h4 className="font-semibold text-sm">Headings ({markdown.stats.headings})</h4>
            {markdown.extractHeadings().map((h, i) => (
              <div key={i} className="text-xs text-muted-foreground ml-2">
                {'  '.repeat(h.level - 1)}• {h.text}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Real-World Examples

### Blog Post Editor

```typescript
import { useState } from 'react';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useMarkdown } from '@/hooks/useMarkdown';
import { Button } from '@/components/ui/button';

export function BlogPostEditor() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const markdown = useMarkdown(content);

  const handlePublish = async () => {
    const post = {
      title,
      content,
      wordCount: markdown.stats.words,
      readingTime: markdown.stats.readingTime,
      headings: markdown.extractHeadings()
    };

    // Post to API
    await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(post)
    });
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post Title..."
        className="w-full text-3xl font-bold p-2 border-b"
      />

      <MarkdownEditor content={content} onContentChange={setContent} />

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {markdown.stats.words} words • {markdown.stats.readingTime} min read
        </div>
        <Button onClick={handlePublish}>Publish</Button>
      </div>
    </div>
  );
}
```

### Documentation Generator

```typescript
import { DocumentTemplate, createHeading, createUnorderedList } from '@/lib/markdown-utils';
import { Button } from '@/components/ui/button';

export function DocGenerator() {
  const generateApiDoc = (endpoints: string[]) => {
    let doc = DocumentTemplate.API_DOC();
    doc += '\n\n' + createHeading(2, 'Endpoints');

    endpoints.forEach(endpoint => {
      doc += '\n\n' + createHeading(3, endpoint);
    });

    return doc;
  };

  const handleExport = (markdown: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(markdown));
    element.setAttribute('download', 'documentation.md');
    element.click();
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => {
        const doc = generateApiDoc(['GET /users', 'POST /users', 'DELETE /users/:id']);
        handleExport(doc);
      }}>
        Generate API Documentation
      </Button>
    </div>
  );
}
```

### Chat Message Formatter

```typescript
import { useMarkdown } from '@/hooks/useMarkdown';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
}

export function ChatMessage({ message }: { message: Message }) {
  const { stats, extractCodeBlocks } = useMarkdown(message.content);
  const codeBlocks = extractCodeBlocks();

  return (
    <div className={`p-4 rounded-lg ${message.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
      <p className="whitespace-pre-wrap">{message.content}</p>

      {codeBlocks.length > 0 && (
        <div className="mt-4 space-y-2">
          {codeBlocks.map((block, i) => (
            <pre key={i} className="bg-gray-900 text-white p-3 rounded overflow-x-auto">
              <code>{block.code}</code>
            </pre>
          ))}
        </div>
      )}

      <div className="text-xs text-muted-foreground mt-2">
        {stats.words} words • {stats.tokens} tokens
      </div>
    </div>
  );
}
```

### Template-Based Document Creation

```typescript
import { useState } from 'react';
import { DocumentTemplate } from '@/lib/markdown-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function TemplateSelector() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = [
    { key: 'README', name: 'README', description: 'Project documentation' },
    { key: 'CHANGELOG', name: 'CHANGELOG', description: 'Version history' },
    { key: 'API_DOC', name: 'API Docs', description: 'API reference' },
    { key: 'BUG_REPORT', name: 'Bug Report', description: 'Issue report' },
    { key: 'FEATURE_REQUEST', name: 'Feature Request', description: 'New feature proposal' }
  ];

  const handleSelectTemplate = (key: string) => {
    const templates = DocumentTemplate as any;
    const content = templates[key]();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/markdown;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `${key.toLowerCase()}.md`);
    element.click();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map(template => (
        <Card key={template.key} className="cursor-pointer hover:shadow-lg transition">
          <CardHeader onClick={() => handleSelectTemplate(template.key)}>
            <CardTitle className="text-base">{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => handleSelectTemplate(template.key)}
              className="w-full"
            >
              Use Template
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

---

## Integration Patterns

### Pattern 1: Save Draft to LocalStorage

```typescript
import { useMarkdown } from '@/hooks/useMarkdown';
import { useEffect, useState } from 'react';

export function DocumentWithAutosave() {
  const [content, setContent] = useState(() => {
    return localStorage.getItem('draft') || '';
  });

  const markdown = useMarkdown(content);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('draft', content);
    }, 1000);

    return () => clearTimeout(timer);
  }, [content]);

  return <MarkdownEditor initialContent={content} onContentChange={setContent} />;
}
```

### Pattern 2: Render to Multiple Formats

```typescript
import { useMarkdown } from '@/hooks/useMarkdown';

export function MultiFormatExport({ content }: { content: string }) {
  const { toHtml, toPlainText } = useMarkdown(content);

  const handleExportHTML = () => {
    const html = toHtml();
    downloadFile(html, 'document.html');
  };

  const handleExportText = () => {
    const text = toPlainText();
    downloadFile(text, 'document.txt');
  };

  const downloadFile = (data: string, filename: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`);
    element.setAttribute('download', filename);
    element.click();
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleExportHTML}>Export as HTML</Button>
      <Button onClick={handleExportText}>Export as Text</Button>
    </div>
  );
}
```

### Pattern 3: Generate Table of Contents

```typescript
import { useMarkdown } from '@/hooks/useMarkdown';
import { Card, CardContent } from '@/components/ui/card';

export function TableOfContents({ content }: { content: string }) {
  const { extractHeadings } = useMarkdown(content);
  const headings = extractHeadings();

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-4">Contents</h3>
        {headings.map((h, i) => (
          <div
            key={i}
            style={{ marginLeft: `${(h.level - 1) * 16}px` }}
            className="text-sm text-blue-600 cursor-pointer hover:underline"
          >
            {h.text}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

### Pattern 4: Content Analysis Dashboard

```typescript
import { useMarkdown } from '@/hooks/useMarkdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ContentAnalysis({ content }: { content: string }) {
  const { stats } = useMarkdown(content);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Words</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.words}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Reading Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.readingTime}m</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Code Blocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.codeBlocks}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-sm font-semibold ${stats.isValid ? 'text-green-600' : 'text-red-600'}`}>
            {stats.isValid ? 'Valid' : 'Invalid'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Quick Reference

### Most Used Functions

```typescript
// Code
createCodeBlock(code, language)
createInlineCode(code)
extractCodeBlocks(markdown)

// Text
bold(text)
italic(text)
strikethrough(text)

// Lists
createUnorderedList(items)
createOrderedList(items)
createChecklistItems(items, checked)

// Links
createLink(text, url)
createImage(alt, url)

// Tables
createMarkdownTable(headers, rows)

// Stats
getWordCount(markdown)
estimateReadingTime(markdown)
estimateTokenCount(markdown)

// Extraction
extractHeadings(markdown)
extractLinks(markdown)

// Conversion
stripMarkdown(markdown)
markdownToHtml(markdown)
```

---

## Component Props

### MarkdownEditor

```typescript
interface MarkdownEditorProps {
  onContentChange?: (content: string) => void;
  initialContent?: string;
}
```

### useMarkdown

```typescript
interface MarkdownStats {
  words: number;
  characters: number;
  readingTime: number;
  tokens: number;
  isValid: boolean;
  codeBlocks: number;
  headings: number;
  links: number;
}

// Returns object with:
// - stats: MarkdownStats
// - extractCodeBlocks(): CodeBlock[]
// - extractHeadings(): Heading[]
// - extractLinks(): Link[]
// - bold(text): string
// - italic(text): string
// - codeBlock(code, language): string
// - link(text, url): string
// - image(alt, url): string
// - table(headers, rows): string
// - toHtml(): string
// - toPlainText(): string
```

---

This guide covers all available utilities and patterns for using the markdown system in your application.
