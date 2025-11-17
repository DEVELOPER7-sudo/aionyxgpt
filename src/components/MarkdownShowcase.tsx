import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  createCodeBlock,
  createMarkdownTable,
  createUnorderedList,
  createOrderedList,
  createBlockquote,
  createChecklistItems,
  bold,
  italic,
  strikethrough,
  createLink,
  createImage,
  createHeading,
  createInlineMath,
  createBlockMath,
  createDiffBlock,
  DocumentTemplate,
  codeExamples,
} from '@/lib/markdown-utils';
import { Copy } from 'lucide-react';

export const MarkdownShowcase = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const examples = [
    {
      title: 'Code Block - JavaScript',
      markdown: createCodeBlock(
        `function greet(name) {
  return \`Hello, \${name}!\`;
}`,
        'javascript',
      ),
      category: 'Code',
    },
    {
      title: 'Table Example',
      markdown: createMarkdownTable(
        ['Feature', 'Status', 'Progress'],
        [
          { Feature: 'Authentication', Status: 'Complete', Progress: '100%' },
          { Feature: 'Database', Status: 'In Progress', Progress: '75%' },
          { Feature: 'API', Status: 'Planned', Progress: '0%' },
        ],
      ),
      category: 'Tables',
    },
    {
      title: 'Unordered List',
      markdown: createUnorderedList([
        'React hooks for state management',
        'TypeScript for type safety',
        'Tailwind CSS for styling',
      ]),
      category: 'Lists',
    },
    {
      title: 'Ordered List',
      markdown: createOrderedList([
        'Clone the repository',
        'Install dependencies with npm install',
        'Run npm run dev to start development server',
      ]),
      category: 'Lists',
    },
    {
      title: 'Text Formatting',
      markdown: `${bold('Bold text')} and ${italic('italic text')} and ${strikethrough('strikethrough')}`,
      category: 'Formatting',
    },
    {
      title: 'Blockquote',
      markdown: createBlockquote('This is an important note that deserves emphasis'),
      category: 'Formatting',
    },
    {
      title: 'Checklist',
      markdown: createChecklistItems(
        ['Setup development environment', 'Install dependencies', 'Configure API keys'],
        [true, true, false],
      ),
      category: 'Lists',
    },
    {
      title: 'Links and Images',
      markdown: `${createLink('Visit OpenRouter', 'https://openrouter.ai')}

${createImage('App Screenshot', 'https://via.placeholder.com/300x200')}`,
      category: 'Links & Images',
    },
    {
      title: 'Headings',
      markdown: `${createHeading(1, 'Main Heading')}
${createHeading(2, 'Subheading')}
${createHeading(3, 'Sub-subheading')}`,
      category: 'Headings',
    },
    {
      title: 'Inline Math',
      markdown: `The equation ${createInlineMath('E = mc^2')} shows energy-mass equivalence.`,
      category: 'Math',
    },
    {
      title: 'Block Math',
      markdown: createBlockMath('\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}'),
      category: 'Math',
    },
    {
      title: 'Code Diff',
      markdown: createDiffBlock(
        `function add(a, b) {
  return a + b;
}`,
        `function add(a, b) {
  console.log('Adding', a, b);
  return a + b;
}`,
        'diff',
      ),
      category: 'Code',
    },
  ];

  const templates = [
    { name: 'README Template', key: 'README' },
    { name: 'CHANGELOG Template', key: 'CHANGELOG' },
    { name: 'API Documentation', key: 'API_DOC' },
    { name: 'Bug Report', key: 'BUG_REPORT' },
    { name: 'Feature Request', key: 'FEATURE_REQUEST' },
  ];

  const codeExamples = [
    { name: 'Hello World (JavaScript)', key: 'hello_world_js' },
    { name: 'Hello World (Python)', key: 'hello_world_python' },
    { name: 'Hello World (Java)', key: 'hello_world_java' },
    { name: 'React Hook Example', key: 'react_hook_example' },
    { name: 'Async/Await Example', key: 'async_await_example' },
  ];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const categories = Array.from(new Set(examples.map(ex => ex.category)));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Markdown Utilities Showcase</CardTitle>
          <CardDescription>
            Complete collection of markdown formatting utilities and examples
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="examples" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="code-examples">Code Examples</TabsTrigger>
        </TabsList>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-4">
          {categories.map(category => (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-semibold text-muted-foreground">{category}</h3>
              <div className="grid gap-4">
                {examples
                  .filter(ex => ex.category === category)
                  .map((example, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{example.title}</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(example.markdown, index)}
                          >
                            <Copy className="w-4 h-4" />
                            {copiedIndex === index && <span className="ml-2 text-xs">Copied!</span>}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-md overflow-x-auto">
                          <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                            {example.markdown}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pre-built Document Templates</CardTitle>
              <CardDescription>Start your document with these professional templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.map((template, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{template.name}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const templates = DocumentTemplate as any;
                        copyToClipboard(templates[template.key](), index);
                      }}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-xs overflow-x-auto max-h-48">
                    {(DocumentTemplate as any)[template.key]().substring(0, 300)}...
                  </pre>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Examples Tab */}
        <TabsContent value="code-examples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Code Examples Library</CardTitle>
              <CardDescription>Ready-to-use code snippets in various languages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {codeExamples.map((example, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{example.name}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const examples = codeExamples as any;
                        copyToClipboard(examples[example.key](), index);
                      }}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-xs overflow-x-auto max-h-48">
                    {(codeExamples as any)[example.key]().substring(0, 400)}...
                  </pre>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Usage Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How to Use Markdown Utilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Text Formatting</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Use <code className="bg-slate-100 px-1 rounded">bold()</code> for strong emphasis</li>
              <li>Use <code className="bg-slate-100 px-1 rounded">italic()</code> for slanted text</li>
              <li>Use <code className="bg-slate-100 px-1 rounded">strikethrough()</code> for deleted text</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Code & Technical</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Use <code className="bg-slate-100 px-1 rounded">createCodeBlock()</code> for syntax-highlighted code</li>
              <li>Use <code className="bg-slate-100 px-1 rounded">createInlineCode()</code> for inline code</li>
              <li>Use <code className="bg-slate-100 px-1 rounded">extractCodeBlocks()</code> to parse code from markdown</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tables & Lists</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Use <code className="bg-slate-100 px-1 rounded">createMarkdownTable()</code> for structured data</li>
              <li>Use <code className="bg-slate-100 px-1 rounded">createUnorderedList()</code> for bullet points</li>
              <li>Use <code className="bg-slate-100 px-1 rounded">createOrderedList()</code> for numbered lists</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Analysis & Statistics</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Use <code className="bg-slate-100 px-1 rounded">getWordCount()</code> to count words</li>
              <li>Use <code className="bg-slate-100 px-1 rounded">estimateReadingTime()</code> for reading duration</li>
              <li>Use <code className="bg-slate-100 px-1 rounded">estimateTokenCount()</code> for token estimation</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarkdownShowcase;
