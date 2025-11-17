import { useCallback, useMemo } from 'react';
import {
  createCodeBlock,
  createInlineCode,
  createLink,
  createImage,
  createHeading,
  createUnorderedList,
  createOrderedList,
  createBlockquote,
  createMarkdownTable,
  bold,
  italic,
  strikethrough,
  extractCodeBlocks,
  extractHeadings,
  extractLinks,
  stripMarkdown,
  markdownToHtml,
  getWordCount,
  getCharacterCount,
  estimateReadingTime,
  estimateTokenCount,
  isValidMarkdown,
  validateCodeBlock,
  DocumentTemplate,
  codeExamples,
} from '@/lib/markdown-utils';

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

export const useMarkdown = (content: string = '') => {
  // Calculate statistics
  const stats = useMemo<MarkdownStats>(() => {
    const codeBlocks = extractCodeBlocks(content);
    const headings = extractHeadings(content);
    const links = extractLinks(content);

    return {
      words: getWordCount(content),
      characters: getCharacterCount(content),
      readingTime: estimateReadingTime(content),
      tokens: estimateTokenCount(content),
      isValid: isValidMarkdown(content),
      codeBlocks: codeBlocks.length,
      headings: headings.length,
      links: links.length,
    };
  }, [content]);

  // Parsing functions
  const extractedCodeBlocks = useCallback(() => extractCodeBlocks(content), [content]);
  const extractedHeadings = useCallback(() => extractHeadings(content), [content]);
  const extractedLinks = useCallback(() => extractLinks(content), [content]);

  // Formatting functions
  const applyBold = useCallback((text: string) => bold(text), []);
  const applyItalic = useCallback((text: string) => italic(text), []);
  const applyStrikethrough = useCallback((text: string) => strikethrough(text), []);
  const applyInlineCode = useCallback((code: string) => createInlineCode(code), []);
  const applyCodeBlock = useCallback(
    (code: string, language: string = '') => createCodeBlock(code, language),
    [],
  );
  const applyLink = useCallback((text: string, url: string) => createLink(text, url), []);
  const applyImage = useCallback((alt: string, url: string) => createImage(alt, url), []);
  const applyHeading = useCallback(
    (text: string, level: 1 | 2 | 3 | 4 | 5 | 6 = 2) => createHeading(level, text),
    [],
  );
  const applyUnorderedList = useCallback((items: string[]) => createUnorderedList(items), []);
  const applyOrderedList = useCallback((items: string[]) => createOrderedList(items), []);
  const applyBlockquote = useCallback((text: string) => createBlockquote(text), []);
  const applyTable = useCallback(
    (headers: string[], rows: Array<Record<string, any>>) => createMarkdownTable(headers, rows),
    [],
  );

  // Conversion functions
  const toHtml = useCallback(() => markdownToHtml(content), [content]);
  const toPlainText = useCallback(() => stripMarkdown(content), [content]);

  // Validation functions
  const validateCode = useCallback(
    (language: string, code: string) => validateCodeBlock(language, code),
    [],
  );

  // Template functions
  const getTemplates = useCallback(() => {
    const templates = DocumentTemplate as any;
    return Object.keys(templates).map(key => ({
      id: key,
      name: key.replace(/_/g, ' '),
      content: templates[key](),
    }));
  }, []);

  const getCodeExamples = useCallback(() => {
    const examples = codeExamples as any;
    return Object.keys(examples).map(key => ({
      id: key,
      name: key.replace(/_/g, ' '),
      content: examples[key](),
    }));
  }, []);

  return {
    // Statistics
    stats,

    // Parsing
    extractCodeBlocks: extractedCodeBlocks,
    extractHeadings: extractedHeadings,
    extractLinks: extractedLinks,

    // Formatting
    bold: applyBold,
    italic: applyItalic,
    strikethrough: applyStrikethrough,
    inlineCode: applyInlineCode,
    codeBlock: applyCodeBlock,
    link: applyLink,
    image: applyImage,
    heading: applyHeading,
    unorderedList: applyUnorderedList,
    orderedList: applyOrderedList,
    blockquote: applyBlockquote,
    table: applyTable,

    // Conversion
    toHtml,
    toPlainText,

    // Validation
    validateCode,

    // Templates
    getTemplates,
    getCodeExamples,
  };
};

export default useMarkdown;
