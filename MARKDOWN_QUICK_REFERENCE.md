# Markdown Utilities - Quick Reference Card

## 🚀 Quick Start

```typescript
// Import what you need
import { createCodeBlock, bold, createUnorderedList } from '@/lib/markdown-utils';
import { useMarkdown } from '@/hooks/useMarkdown';
import { MarkdownEditor } from '@/components/MarkdownEditor';

// Use in component
export function MyComponent() {
  const { stats, bold, extractHeadings } = useMarkdown(content);
  return <MarkdownEditor initialContent={content} />;
}
```

---

## 📝 Formatting Functions

| Function | Input | Output |
|----------|-------|--------|
| `bold(text)` | `'important'` | `'**important**'` |
| `italic(text)` | `'note'` | `'*note*'` |
| `strikethrough(text)` | `'old'` | `'~~old~~'` |
| `underline(text)` | `'emphasis'` | `'<u>emphasis</u>'` |

---

## 💻 Code Block Functions

```typescript
// Syntax-highlighted block
createCodeBlock('const x = 1;', 'javascript')
// Output: ```javascript\nconst x = 1;\n```

// Inline code
createInlineCode('npm install')
// Output: `npm install`

// Extract code from markdown
extractCodeBlocks(markdown)
// Output: [{ language: 'js', code: '...' }]
```

---

## 📋 List Functions

```typescript
// Unordered
createUnorderedList(['Item 1', 'Item 2'])
// - Item 1
// - Item 2

// Ordered
createOrderedList(['First', 'Second'])
// 1. First
// 2. Second

// Checklist
createChecklistItems(['Task 1', 'Task 2'], [true, false])
// [x] Task 1
// [ ] Task 2

// Nested
createNestedList([
  { text: 'Parent', children: ['Child 1', 'Child 2'] }
])
```

---

## 📊 Table Functions

```typescript
// Create table
createMarkdownTable(
  ['Name', 'Status'],
  [
    { Name: 'Alice', Status: 'Active' },
    { Name: 'Bob', Status: 'Inactive' }
  ]
)

// From API data
createDataTable(['id', 'name'], apiResponse)
```

---

## 🔗 Link & Image Functions

```typescript
// Links
createLink('Google', 'https://google.com')
createLink('Docs', 'https://docs.com', 'Official')

// Images
createImage('Alt text', 'https://img.jpg')
createImage('Logo', 'https://logo.png', 'Brand')

// Clickable image
createImageLink('Banner', 'img.jpg', 'https://link.com')
```

---

## 🎯 Heading Functions

```typescript
createH1('Title')        // # Title
createH2('Section')      // ## Section
createH3('Subsection')   // ### Subsection
createHeading(4, 'Text') // #### Text
```

---

## 📐 Math Functions

```typescript
// Inline equation
createInlineMath('E = mc^2')
// Output: $E = mc^2$

// Block equation
createBlockMath('\\int_0^\\infty e^{-x^2} dx')
// Output: $$\int_0^\infty e^{-x^2} dx$$
```

---

## 🎨 Special Formatting

```typescript
// Blockquote
createBlockquote('Important note')
// > Important note

// Callout boxes
createCallout('note', 'This is a note')
createCallout('warning', 'Be careful')
createCallout('tip', 'Pro tip')
createCallout('danger', 'Critical')

// Horizontal rule
createHorizontalRule() // ---

// Diff block
createDiffBlock(oldCode, newCode)
```

---

## 📊 Statistics Functions

```typescript
const content = 'Your markdown...';

getWordCount(content)           // 45
getCharacterCount(content)      // 234
estimateReadingTime(content)    // 1 (minutes)
estimateTokenCount(content)     // ~59 tokens
```

---

## 🔍 Extraction Functions

```typescript
const markdown = '# Title\n[Link](url)';

extractHeadings(markdown)
// [{ level: 1, text: 'Title' }]

extractLinks(markdown)
// [{ text: 'Link', url: 'url' }]

extractCodeBlocks(markdown)
// [{ language: 'js', code: '...' }]
```

---

## ✅ Validation Functions

```typescript
// Check markdown validity
isValidMarkdown(content) // true/false

// Validate code language
validateCodeBlock('javascript', code)
// { valid: true, language: 'javascript' }
```

---

## 🔄 Conversion Functions

```typescript
// Remove all markdown formatting
stripMarkdown(markdown) // Plain text

// Convert to HTML
markdownToHtml(markdown) // HTML string
```

---

## 📦 Templates

```typescript
// Access templates
DocumentTemplate.README()
DocumentTemplate.CHANGELOG()
DocumentTemplate.API_DOC()
DocumentTemplate.BUG_REPORT()
DocumentTemplate.FEATURE_REQUEST()

// Code examples
codeExamples.hello_world_js()
codeExamples.hello_world_python()
codeExamples.react_hook_example()
codeExamples.async_await_example()
```

---

## 🎯 React Components

### MarkdownEditor

```typescript
<MarkdownEditor 
  initialContent="# Title"
  onContentChange={(content) => console.log(content)}
/>
```

**Features:**
- Formatting toolbar
- Live preview
- Statistics display
- Template library
- Code examples

### MarkdownShowcase

```typescript
<MarkdownShowcase />
```

**Displays:**
- 12 example categories
- All markdown formats
- Template previews
- Copy-to-clipboard

---

## 🪝 React Hook - useMarkdown

```typescript
const { 
  // Statistics
  stats,
  
  // Formatting
  bold, italic, codeBlock, link, image,
  
  // Lists
  unorderedList, orderedList, table,
  
  // Extraction
  extractHeadings, extractLinks, extractCodeBlocks,
  
  // Conversion
  toHtml, toPlainText,
  
  // Templates
  getTemplates, getCodeExamples
} = useMarkdown(content);

// stats object
{
  words: 45,
  characters: 234,
  readingTime: 1,
  tokens: 59,
  isValid: true,
  codeBlocks: 2,
  headings: 3,
  links: 1
}
```

---

## 🎨 Common Patterns

### Autosave to LocalStorage
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.setItem('draft', content);
  }, 1000);
  return () => clearTimeout(timer);
}, [content]);
```

### Export Multiple Formats
```typescript
const { toHtml, toPlainText } = useMarkdown(content);
downloadFile(toHtml(), 'doc.html');
downloadFile(toPlainText(), 'doc.txt');
```

### Show Statistics
```typescript
const { stats } = useMarkdown(content);
<div>{stats.words} words • {stats.readingTime} min read</div>
```

### Extract Table of Contents
```typescript
const { extractHeadings } = useMarkdown(content);
const headings = extractHeadings();
```

---

## 📂 File Locations

```
src/
├── lib/
│   └── markdown-utils.ts        # Main library
├── components/
│   ├── MarkdownEditor.tsx       # Full editor
│   └── MarkdownShowcase.tsx     # Demo component
└── hooks/
    └── useMarkdown.ts           # React hook
```

---

## 🚨 Common Issues

**Code blocks not working?**
- Ensure language is in `SyntaxLanguages` or empty string
- Check fence syntax: 3 backticks on each side

**Math not rendering?**
- Need KaTeX CSS imported
- Use `$...$` for inline, `$$...$$` for block

**Statistics seem off?**
- Statistics exclude markdown syntax
- Token count is approximate (4 chars per token)

**Templates empty?**
- Import `DocumentTemplate` correctly
- Use `DocumentTemplate.README()` not `DocumentTemplate['README']`

---

## 🔗 Full Documentation

See `MARKDOWN_USAGE_EXAMPLES.md` for:
- Detailed examples
- Real-world patterns
- Component integration guides
- Advanced usage

---

## 💡 Tips & Tricks

✅ Always validate markdown with `isValidMarkdown()`
✅ Use `extractHeadings()` to generate table of contents
✅ Leverage `estimateReadingTime()` for SEO metadata
✅ Use templates as starting points
✅ Extract code blocks for syntax highlighting
✅ Combine with localStorage for auto-save
✅ Use `stripMarkdown()` for plain text search indexing

---

**Last Updated:** Nov 2024  
**Version:** 1.0.0
