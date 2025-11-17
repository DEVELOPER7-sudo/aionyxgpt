/**
 * Comprehensive Markdown Utilities
 * Supports various markdown formats, code blocks, and conversions
 */

// ============================================================================
// CODE BLOCK UTILITIES
// ============================================================================

export const CodeBlockFormats = {
  INLINE: 'inline',
  BLOCK: 'block',
  FENCED: 'fenced',
  INDENTED: 'indented',
} as const;

export const createInlineCode = (code: string): string => {
  return `\`${code}\``;
};

export const createCodeBlock = (code: string, language: string = ''): string => {
  return `\`\`\`${language}\n${code}\n\`\`\``;
};

export const createIndentedCode = (code: string): string => {
  const lines = code.split('\n');
  return lines.map(line => `    ${line}`).join('\n');
};

export const extractCodeBlocks = (markdown: string): Array<{ language: string; code: string }> => {
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const blocks: Array<{ language: string; code: string }> = [];
  let match;

  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
    });
  }

  return blocks;
};

// ============================================================================
// TABLE MARKDOWN UTILITIES
// ============================================================================

interface TableRow {
  [key: string]: string | number;
}

export const createMarkdownTable = (headers: string[], rows: TableRow[]): string => {
  const headerLine = `| ${headers.join(' | ')} |`;
  const separatorLine = `| ${headers.map(() => '---').join(' | ')} |`;
  const dataLines = rows.map(row => {
    const cells = headers.map(header => String(row[header] || ''));
    return `| ${cells.join(' | ')} |`;
  });

  return [headerLine, separatorLine, ...dataLines].join('\n');
};

export const createDataTable = (
  headers: string[],
  data: Array<Record<string, any>>,
): string => {
  return createMarkdownTable(headers, data as TableRow[]);
};

// ============================================================================
// LIST UTILITIES
// ============================================================================

export const createUnorderedList = (items: string[]): string => {
  return items.map(item => `- ${item}`).join('\n');
};

export const createOrderedList = (items: string[]): string => {
  return items.map((item, idx) => `${idx + 1}. ${item}`).join('\n');
};

export const createNestedList = (items: Array<{ text: string; children?: string[] }>): string => {
  return items
    .map(item => {
      const line = `- ${item.text}`;
      if (item.children && item.children.length > 0) {
        const nestedItems = item.children.map(child => `  - ${child}`).join('\n');
        return `${line}\n${nestedItems}`;
      }
      return line;
    })
    .join('\n');
};

export const createChecklistItems = (items: string[], checked: boolean[] = []): string => {
  return items
    .map((item, idx) => {
      const isChecked = checked[idx] || false;
      const checkmark = isChecked ? '[x]' : '[ ]';
      return `${checkmark} ${item}`;
    })
    .join('\n');
};

// ============================================================================
// BLOCKQUOTE & EMPHASIS UTILITIES
// ============================================================================

export const createBlockquote = (text: string): string => {
  const lines = text.split('\n');
  return lines.map(line => `> ${line}`).join('\n');
};

export const createCallout = (type: 'note' | 'warning' | 'tip' | 'danger', content: string): string => {
  const symbols = {
    note: '📝',
    warning: '⚠️',
    tip: '💡',
    danger: '🚨',
  };
  return `> ${symbols[type]} **${type.toUpperCase()}**\n> ${content}`;
};

export const bold = (text: string): string => `**${text}**`;
export const italic = (text: string): string => `*${text}*`;
export const boldItalic = (text: string): string => `***${text}***`;
export const strikethrough = (text: string): string => `~~${text}~~`;
export const underline = (text: string): string => `<u>${text}</u>`;

// ============================================================================
// LINK & IMAGE UTILITIES
// ============================================================================

export const createLink = (text: string, url: string, title?: string): string => {
  if (title) {
    return `[${text}](${url} "${title}")`;
  }
  return `[${text}](${url})`;
};

export const createImage = (altText: string, url: string, title?: string): string => {
  if (title) {
    return `![${altText}](${url} "${title}")`;
  }
  return `![${altText}](${url})`;
};

export const createImageLink = (altText: string, imageUrl: string, linkUrl: string): string => {
  return `[![${altText}](${imageUrl})](${linkUrl})`;
};

// ============================================================================
// HEADING UTILITIES
// ============================================================================

export const createHeading = (level: 1 | 2 | 3 | 4 | 5 | 6, text: string): string => {
  const hashes = '#'.repeat(level);
  return `${hashes} ${text}`;
};

export const createH1 = (text: string): string => createHeading(1, text);
export const createH2 = (text: string): string => createHeading(2, text);
export const createH3 = (text: string): string => createHeading(3, text);
export const createH4 = (text: string): string => createHeading(4, text);
export const createH5 = (text: string): string => createHeading(5, text);
export const createH6 = (text: string): string => createHeading(6, text);

// ============================================================================
// HORIZONTAL RULE & DIVIDER
// ============================================================================

export const createHorizontalRule = (): string => '---';
export const createDivider = (): string => '\n---\n';

// ============================================================================
// MATH & EQUATION UTILITIES
// ============================================================================

export const createInlineMath = (equation: string): string => `$${equation}$`;

export const createBlockMath = (equation: string): string => `$$\n${equation}\n$$`;

// ============================================================================
// SPECIAL MARKDOWN FORMATS
// ============================================================================

export const createDefinitionList = (
  items: Array<{ term: string; definition: string }>,
): string => {
  return items.map(item => `${item.term}\n:   ${item.definition}`).join('\n\n');
};

export const createFootnote = (text: string, footnoteId: string, footnoteContent: string): string => {
  return `${text}[^${footnoteId}]\n\n[^${footnoteId}]: ${footnoteContent}`;
};

export const createTableOfContents = (headings: Array<{ level: number; text: string }>): string => {
  return headings
    .map(heading => {
      const indent = '  '.repeat(heading.level - 1);
      const id = heading.text.toLowerCase().replace(/\s+/g, '-');
      return `${indent}- [${heading.text}](#${id})`;
    })
    .join('\n');
};

// ============================================================================
// SYNTAX HIGHLIGHTING UTILITIES
// ============================================================================

export const SyntaxLanguages = {
  JAVASCRIPT: 'javascript',
  TYPESCRIPT: 'typescript',
  PYTHON: 'python',
  JAVA: 'java',
  CSHARP: 'csharp',
  GOLANG: 'go',
  RUST: 'rust',
  CPP: 'cpp',
  C: 'c',
  SQL: 'sql',
  BASH: 'bash',
  SHELL: 'shell',
  HTML: 'html',
  CSS: 'css',
  JSON: 'json',
  YAML: 'yaml',
  XML: 'xml',
  MARKDOWN: 'markdown',
  LATEX: 'latex',
  PLAINTEXT: 'plaintext',
} as const;

export const createCodeSnippet = (
  language: string,
  code: string,
  title?: string,
  description?: string,
): string => {
  let snippet = '';

  if (title) {
    snippet += `**${title}**\n\n`;
  }

  if (description) {
    snippet += `${description}\n\n`;
  }

  snippet += createCodeBlock(code, language);

  return snippet;
};

// ============================================================================
// DIFF UTILITIES
// ============================================================================

export const createDiffBlock = (oldCode: string, newCode: string, language: string = 'diff'): string => {
  const oldLines = oldCode.split('\n');
  const newLines = newCode.split('\n');
  const diff: string[] = [];

  // Simple diff: mark removed lines with - and added lines with +
  const maxLines = Math.max(oldLines.length, newLines.length);

  for (let i = 0; i < maxLines; i++) {
    if (i < oldLines.length) {
      diff.push(`- ${oldLines[i]}`);
    }
    if (i < newLines.length) {
      diff.push(`+ ${newLines[i]}`);
    }
  }

  return createCodeBlock(diff.join('\n'), language);
};

// ============================================================================
// PARSING & EXTRACTION UTILITIES
// ============================================================================

export const extractHeadings = (markdown: string): Array<{ level: number; text: string }> => {
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string }> = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const fullMatch = match[0];
    const level = fullMatch.match(/^#+/)?.[0].length || 1;
    headings.push({
      level,
      text: match[1].trim(),
    });
  }

  return headings;
};

export const extractLinks = (markdown: string): Array<{ text: string; url: string }> => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links: Array<{ text: string; url: string }> = [];
  let match;

  while ((match = linkRegex.exec(markdown)) !== null) {
    links.push({
      text: match[1],
      url: match[2],
    });
  }

  return links;
};

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

export const markdownToHtml = (markdown: string): string => {
  // Basic conversion (for more advanced, use react-markdown library)
  let html = markdown;

  // Headings
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Code
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  return html;
};

export const stripMarkdown = (markdown: string): string => {
  let text = markdown;

  // Remove headings
  text = text.replace(/^#{1,6}\s+/gm, '');

  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, '');

  // Remove inline code
  text = text.replace(/`([^`]*)`/g, '$1');

  // Remove bold
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');

  // Remove italic
  text = text.replace(/\*(.*?)\*/g, '$1');

  // Remove strikethrough
  text = text.replace(/~~(.*?)~~/g, '$1');

  // Remove links
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '$1');

  // Remove images
  text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '');

  // Remove blockquotes
  text = text.replace(/^>\s+/gm, '');

  // Remove horizontal rules
  text = text.replace(/^---$/gm, '');

  return text.trim();
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export const isValidMarkdown = (markdown: string): boolean => {
  // Check for balanced code blocks
  const codeBlockCount = (markdown.match(/```/g) || []).length;
  if (codeBlockCount % 2 !== 0) return false;

  // Check for balanced links
  const linkBrackets = (markdown.match(/\[/g) || []).length;
  const linkParens = (markdown.match(/\(/g) || []).length;
  if (linkBrackets !== linkParens) return false;

  return true;
};

export const validateCodeBlock = (language: string, code: string): { valid: boolean; language: string } => {
  const validLanguages = Object.values(SyntaxLanguages);
  const isValidLanguage = validLanguages.includes(language as any);

  return {
    valid: isValidLanguage || language === '',
    language: isValidLanguage ? language : 'plaintext',
  };
};

// ============================================================================
// TEMPLATE UTILITIES
// ============================================================================

export const DocumentTemplate = {
  README: () => `# Project Title

## Description
Brief description of the project.

## Features
${createUnorderedList(['Feature 1', 'Feature 2', 'Feature 3'])}

## Installation
\`\`\`bash
npm install
\`\`\`

## Usage
${createCodeBlock('example code here', 'javascript')}

## Contributing
Contributions are welcome!

## License
MIT
`,

  CHANGELOG: () => `# Changelog

## [1.0.0] - 2024-01-01

### Added
${createUnorderedList(['New feature 1', 'New feature 2'])}

### Changed
${createUnorderedList(['Changed behavior 1', 'Changed behavior 2'])}

### Fixed
${createUnorderedList(['Fixed bug 1', 'Fixed bug 2'])}
`,

  API_DOC: () => `# API Documentation

## Endpoints

### GET /api/users
Returns a list of users.

**Response:**
${createCodeBlock(
  JSON.stringify([{ id: 1, name: 'User 1' }], null, 2),
  'json',
)}

### POST /api/users
Creates a new user.

**Request Body:**
${createCodeBlock(
  JSON.stringify({ name: 'New User', email: 'user@example.com' }, null, 2),
  'json',
)}
`,

  BUG_REPORT: () => `# Bug Report

## Description
Brief description of the bug.

## Steps to Reproduce
${createOrderedList(['Step 1', 'Step 2', 'Step 3'])}

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
${createUnorderedList(['OS: ', 'Browser: ', 'Version: '])}
`,

  FEATURE_REQUEST: () => `# Feature Request

## Description
Clear description of the desired feature.

## Motivation
Why is this feature needed?

## Proposed Solution
How should this feature work?

## Alternatives
Any alternative solutions?
`,
};

export const codeExamples = {
  hello_world_js: () =>
    createCodeSnippet('javascript', 'console.log("Hello, World!");', 'Hello World', 'Basic JavaScript example'),

  hello_world_python: () =>
    createCodeSnippet('python', 'print("Hello, World!")', 'Hello World', 'Basic Python example'),

  hello_world_java: () =>
    createCodeSnippet(
      'java',
      'public class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
      'Hello World',
      'Basic Java example',
    ),

  async_await_example: () =>
    createCodeSnippet(
      'typescript',
      `async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}`,
      'Async/Await',
      'Fetch data asynchronously',
    ),

  react_hook_example: () =>
    createCodeSnippet(
      'typescript',
      `const [count, setCount] = useState(0);

const increment = () => setCount(count + 1);

return <button onClick={increment}>Count: {count}</button>;`,
      'React Hook',
      'useState example',
    ),
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const getCharacterCount = (markdown: string): number => {
  return markdown.length;
};

export const getWordCount = (markdown: string): number => {
  const text = stripMarkdown(markdown);
  return text.split(/\s+/).filter(word => word.length > 0).length;
};

export const estimateReadingTime = (markdown: string, wordsPerMinute: number = 200): number => {
  const words = getWordCount(markdown);
  return Math.ceil(words / wordsPerMinute);
};

export const estimateTokenCount = (markdown: string): number => {
  // Rough estimation: ~4 characters per token
  return Math.ceil(markdown.length / 4);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export default {
  // Code utilities
  createCodeBlock,
  createInlineCode,
  extractCodeBlocks,

  // Table utilities
  createMarkdownTable,

  // List utilities
  createUnorderedList,
  createOrderedList,
  createChecklistItems,

  // Text formatting
  bold,
  italic,
  strikethrough,

  // Heading utilities
  createH1,
  createH2,
  createH3,

  // Link & Image
  createLink,
  createImage,

  // Parsing
  extractHeadings,
  extractLinks,

  // Conversion
  markdownToHtml,
  stripMarkdown,

  // Templates
  DocumentTemplate,

  // Statistics
  getWordCount,
  estimateReadingTime,
  estimateTokenCount,
};
