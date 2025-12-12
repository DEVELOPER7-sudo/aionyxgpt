/**
 * Web Search Markdown Formatter
 * Provides structured websearch block template and formatting
 */

export interface WebSearchURL {
  title: string;
  url: string;
  description: string;
  category?: string;
}

/**
 * Generate the system prompt instruction for /websearch command
 * Forces AI to follow the websearch markdown format STRICTLY
 */
export const generateWebSearchSystemPrompt = (query: string): string => {
  return `## 🔍 MANDATORY WEB SEARCH FORMAT - STRICT ENFORCEMENT

You are executing a /websearch command for: "${query}"

**THIS IS NOT OPTIONAL - YOU MUST FOLLOW THIS EXACTLY OR YOUR RESPONSE WILL BE INVALID**

### STEP-BY-STEP REQUIREMENTS:

**STEP 1: START WITH OPENING TAG**
The VERY FIRST character of your response must be:
\`<websearch>\`

**STEP 2: ADD HEADER**
On the second line, add:
\`## URLs Searched\`

**STEP 3: LIST EVERY SINGLE URL**
Format EXACTLY like this (one URL per line):
\`- [Source Name](https://complete-url.com) - One sentence description\`

CRITICAL RULES FOR URLS:
• EVERY URL you accessed MUST be listed
• Use FULL URLs only (https://..., never shortened)
• Use markdown format: [Name](URL)
• Add description after URL: " - Description"
• One URL per line
• Minimum 3 URLs
• NO fake/fabricated URLs
• NO hidden sources
• NO variations in format

**STEP 4: ADD FINDINGS SECTION**
After all URLs, add a blank line, then:
\`## Findings\`

Then write your research answer CITING EVERY SOURCE YOU LISTED.

**STEP 5: CLOSE THE TAG**
The VERY LAST line must be:
\`</websearch>\`

### EXACT STRUCTURE - COPY THIS EXACTLY:

<websearch>
## URLs Searched

- [Source Name 1](https://url1.com) - Brief description
- [Source Name 2](https://url2.com) - Brief description
- [Source Name 3](https://url3.com) - Brief description
- [Source Name 4](https://url4.com) - Brief description
- [Source Name 5](https://url5.com) - Brief description

## Findings

According to [Source Name 1](https://url1.com), [finding 1].

[Source Name 2](https://url2.com) states that [finding 2].

The research from [Source Name 3](https://url3.com) indicates [finding 3].

As documented in [Source Name 4](https://url4.com), [finding 4].

[Source Name 5](https://url5.com) confirms that [finding 5].
</websearch>

### ABSOLUTE RULES - ZERO TOLERANCE:

✅ MUST DO:
• Start response with \`<websearch>\`
• Include \`## URLs Searched\` header
• List EVERY URL with format \`- [Name](URL) - Description\`
• Use FULL URLs (https://example.com)
• Add descriptions for EACH URL
• Include blank line before \`## Findings\`
• Write \`## Findings\` section
• Cite sources in findings: "According to [Source](URL), ..."
• Close with \`</websearch>\`
• Include minimum 3 URLs

❌ MUST NOT:
• Skip opening \`<websearch>\` tag
• Miss any URLs you accessed
• Use shortened URLs (bit.ly, goo.gl, tinyurl, etc.)
• Skip source descriptions
• Make up/fake URLs
• Hide sources used
• Provide findings WITHOUT citations
• Mix URLs and findings in same section
• Change format or structure
• Add preamble before \`<websearch>\`
• Add text after \`</websearch>\`
• Use bullet points differently
• Vary the URL list format
• Include extra commentary outside tags

### VALIDATION - CHECK BEFORE SENDING:

\[ \] Response starts with exactly \`<websearch>\` on line 1
\[ \] Line 2 has exactly \`## URLs Searched\`
\[ \] At least 3 URLs listed
\[ \] Each URL follows format: \`- [Name](https://url.com) - Description\`
\[ \] All URLs are complete (start with https://)
\[ \] No shortened URLs
\[ \] No fake URLs
\[ \] Blank line before \`## Findings\`
\[ \] \`## Findings\` header present
\[ \] Each finding cites a source from the URL list
\[ \] Citations use markdown link format: \`[Source](URL)\`
\[ \] Response ends with exactly \`</websearch>\`
\[ \] No text before \`<websearch>\`
\[ \] No text after \`</websearch>\`

### IF YOU FAIL THESE CHECKS, YOUR RESPONSE IS INVALID.

**REMEMBER: ZERO FLEXIBILITY. EXACT FORMAT. NO EXCEPTIONS.**`;
};

/**
 * Generate a pre-filled websearch template for the user
 */
export const generateWebSearchTemplate = (query: string): string => {
  return `## Web Search: ${query}

You can use the /websearch command to trigger formatted web search.

Format: /websearch [your research query]

Example: /websearch latest AI developments in 2025

The AI will respond with structured <websearch> blocks listing:
- All URLs accessed during search
- Search process timeline (10-15 seconds)
- Detailed findings with citations

Response includes:
- 🔍 URLs Searched section with all sources
- 📊 Search Process table with timing
- 📝 Findings with proper citations
`;
};

/**
 * Generate a properly formatted websearch response template
 */
export const generateWebSearchResponseTemplate = (
  query: string,
  urls: WebSearchURL[],
  findings: string
): string => {
  const urlList = urls
    .map(({ title, url, description }) => `- [${title}](${url}) - ${description}`)
    .join('\n');

  return `<websearch>
## URLs Searched

${urlList}

## Findings

${findings}
</websearch>`;
};

/**
 * Validate websearch markdown format - STRICT VALIDATION
 */
export const validateWebSearchBlock = (content: string): {
  isValid: boolean;
  errors: string[];
  foundURLs: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const foundURLs: string[] = [];

  // 1. Check for opening tag at START
  if (!content.trim().startsWith('<websearch>')) {
    errors.push('CRITICAL: Response must start with <websearch> tag (no preamble allowed)');
  } else if (!content.includes('<websearch>')) {
    errors.push('Missing opening <websearch> tag');
  }

  // 2. Check for closing tag at END
  if (!content.trim().endsWith('</websearch>')) {
    errors.push('CRITICAL: Response must end with </websearch> tag (no text after allowed)');
  } else if (!content.includes('</websearch>')) {
    errors.push('Missing closing </websearch> tag');
  }

  // 3. Check for "URLs Searched" header (with or without emoji)
  if (!content.includes('URLs Searched')) {
    errors.push('Missing "URLs Searched" header (must be exactly this format)');
  }

  // 4. Check for "Findings" section (with or without emoji)
  if (!content.includes('Findings')) {
    errors.push('Missing "Findings" section header');
  }

  // 5. Extract URLs from markdown links
  const urlRegex = /^-\s*\[([^\]]+)\]\((https?:\/\/[^\)]+)\)\s*-\s*(.+)$/gm;
  let match;
  const urlsWithDescription: Array<{ name: string; url: string; description: string }> = [];
  
  while ((match = urlRegex.exec(content)) !== null) {
    const url = match[2];
    foundURLs.push(url);
    urlsWithDescription.push({
      name: match[1],
      url: url,
      description: match[3],
    });

    // Check for shortened URLs
    if (url.includes('bit.ly') || url.includes('goo.gl') || url.includes('tinyurl') || 
        url.includes('short.link') || url.includes('ow.ly')) {
      errors.push(`CRITICAL: Shortened URL detected: ${url} (use full URLs only)`);
    }
  }

  // 6. Check URL count
  if (foundURLs.length === 0) {
    errors.push('CRITICAL: No URLs found. Must list at least 3 URLs with format: - [Name](https://url.com) - Description');
  } else if (foundURLs.length < 3) {
    errors.push(`CRITICAL: Only ${foundURLs.length} URLs found. Minimum required: 3`);
  }

  // 7. Check each URL has description
  const urlLinesWithoutDesc = content.match(/^-\s*\[([^\]]+)\]\((https?:\/\/[^\)]+)\)(?:\s*-\s*)?$/gm) || [];
  if (urlLinesWithoutDesc.length > 0) {
    errors.push(`CRITICAL: ${urlLinesWithoutDesc.length} URL(s) missing description. Format: - [Name](URL) - Description`);
  }

  // 8. Check if findings cite sources
  if (content.includes('## Findings')) {
    const findingsSection = content.split('## Findings')[1] || '';
    const citationCount = (findingsSection.match(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g) || []).length;
    
    if (citationCount === 0) {
      errors.push('CRITICAL: Findings section must cite sources using [Source](URL) format');
    } else if (citationCount < foundURLs.length / 2) {
      warnings.push(`Only ${citationCount} source citations found but ${foundURLs.length} URLs listed. Consider citing more sources.`);
    }
  }

  // 9. Check for fake URLs
  const commonFakeDomains = ['example.com', 'test.com', 'fake.com', 'dummy.com', 'placeholder.com'];
  foundURLs.forEach(url => {
    if (commonFakeDomains.some(domain => url.includes(domain))) {
      errors.push(`CRITICAL: Fake/placeholder URL detected: ${url}`);
    }
  });

  // 10. Check structure order
  const webSearchStart = content.indexOf('<websearch>');
  const urlsSearchedPos = content.indexOf('## URLs Searched');
  const findingsPos = content.indexOf('## Findings');
  const webSearchEnd = content.indexOf('</websearch>');

  if (webSearchStart !== -1 && urlsSearchedPos !== -1 && urlsSearchedPos < webSearchStart) {
    errors.push('CRITICAL: URLs Searched header must come AFTER <websearch> tag');
  }

  if (urlsSearchedPos !== -1 && findingsPos !== -1 && findingsPos < urlsSearchedPos) {
    errors.push('CRITICAL: Findings section must come AFTER URLs Searched section');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    foundURLs,
  };
};

/**
 * Format a list of URLs into websearch block markdown with status messages
 */
export const formatURLsToWebSearchBlock = (
  urls: WebSearchURL[],
  findings: string,
  searchDuration?: number
): string => {
  const duration = searchDuration || 12; // Default 10-15 seconds
  const urlList = urls
    .map(({ title, url, description, category }) => {
      const categoryTag = category ? ` [${category}]` : '';
      return `- [${title}](${url})${categoryTag} - ${description}`;
    })
    .join('\n');

  return `<websearch>
## URLs Searched

${urlList}

## Findings

${findings}
</websearch>`;
};

/**
 * Extract URLs from websearch block
 */
export const extractURLsFromWebSearchBlock = (content: string): WebSearchURL[] => {
  const urls: WebSearchURL[] = [];
  const urlRegex = /^-\s*\[([^\]]+)\]\((https?:\/\/[^\)]+)\)(?:\s*\[([^\]]+)\])?\s*-\s*(.*)$/gm;

  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    urls.push({
      title: match[1],
      url: match[2],
      category: match[3] || undefined,
      description: match[4],
    });
  }

  return urls;
};
