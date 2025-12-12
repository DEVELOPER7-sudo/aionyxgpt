# Web Search Strict Enforcement Update

## Problem Addressed
AI was responding with poorly formatted web search results that:
- Lacked proper `<websearch>` tags
- Mixed URLs with findings without organization
- Had no markdown structure
- Missing clear sections

Example of bad response:
```
## Pasi Nagvanshi Kshatriya - Web Search Summary

### Key Findings:
1. Historical Context...
```

## Solution Implemented

### 1. Rewritten System Prompt (`generateWebSearchSystemPrompt`)

**Old**: Suggested format with 8 general requirements

**New**: STRICT 5-STEP enforcement with ZERO TOLERANCE

#### Step-by-Step Structure:
```
STEP 1: START WITH <websearch> TAG (First character)
STEP 2: ADD ## URLs Searched HEADER
STEP 3: LIST EVERY URL with format: - [Name](URL) - Description
STEP 4: ADD ## Findings HEADER
STEP 5: CLOSE WITH </websearch> TAG
```

#### Critical Rules Enforced:
- ✅ MUST: Start with `<websearch>` (no preamble)
- ✅ MUST: End with `</websearch>` (no trailing text)
- ✅ MUST: List EVERY URL accessed
- ✅ MUST: Use FULL URLs (no shortened)
- ✅ MUST: Add descriptions for EACH URL
- ✅ MUST: Include minimum 3 URLs
- ✅ MUST: Cite sources in findings

- ❌ CANNOT: Skip tags
- ❌ CANNOT: Miss any URLs
- ❌ CANNOT: Use shortened URLs (bit.ly, goo.gl, tinyurl)
- ❌ CANNOT: Skip descriptions
- ❌ CANNOT: Make up fake URLs
- ❌ CANNOT: Hide sources
- ❌ CANNOT: Add preamble before tag
- ❌ CANNOT: Add text after closing tag

### 2. Enhanced Validation Function (`validateWebSearchBlock`)

**Now includes 10-point validation system**:

1. **Opening Tag Check**: Must start with `<websearch>` (no preamble)
2. **Closing Tag Check**: Must end with `</websearch>` (no trailing text)
3. **URLs Searched Header**: Must have `## URLs Searched`
4. **Findings Section**: Must have `## Findings`
5. **URL Extraction**: Extract all URLs from markdown format
6. **Shortened URL Detection**: Flag bit.ly, goo.gl, tinyurl, ow.ly, short.link
7. **URL Count**: Enforce minimum 3 URLs
8. **URL Descriptions**: Check all URLs have descriptions
9. **Source Citations**: Verify findings cite the listed sources
10. **Structure Order**: Validate proper sequence

### 3. Validation Checklist

System prompt includes mandatory pre-send checklist:
```
[ ] Response starts with <websearch> on line 1
[ ] Line 2 has ## URLs Searched
[ ] At least 3 URLs listed
[ ] Each URL: - [Name](https://url.com) - Description
[ ] All URLs complete (start with https://)
[ ] No shortened URLs
[ ] No fake URLs
[ ] Blank line before ## Findings
[ ] ## Findings header present
[ ] Each finding cites a source
[ ] Citations use [Source](URL) format
[ ] Response ends with </websearch>
[ ] No text before <websearch>
[ ] No text after </websearch>
```

### 4. Fake URL Detection

Validator now detects common fake domains:
- example.com
- test.com
- fake.com
- dummy.com
- placeholder.com

Flags as `CRITICAL` error.

### 5. Warnings System

Added `warnings` array to validation results for non-critical issues:
- Insufficient source citations relative to URLs
- Missing citations for listed sources
- Structure improvements needed

## Mandatory Format Enforced

```
<websearch>
## URLs Searched

- [Source Name 1](https://url1.com) - Brief description
- [Source Name 2](https://url2.com) - Brief description
- [Source Name 3](https://url3.com) - Brief description

## Findings

According to [Source Name 1](https://url1.com), [finding 1].

[Source Name 2](https://url2.com) states that [finding 2].
</websearch>
```

### Non-Negotiable Rules:
1. `<websearch>` is FIRST character
2. `</websearch>` is LAST character
3. Minimum 3 URLs listed
4. Full URLs only (no shortened)
5. All URLs have descriptions
6. Findings cite sources
7. No preamble before tags
8. No text after tags

## Validation Output

```typescript
{
  isValid: boolean;
  errors: string[];      // CRITICAL issues
  warnings: string[];    // Non-critical suggestions
  foundURLs: string[];   // Extracted URLs
}
```

**Example with errors**:
```
{
  isValid: false,
  errors: [
    'CRITICAL: Response must start with <websearch> tag (no preamble allowed)',
    'CRITICAL: Only 2 URLs found. Minimum required: 3',
    'CRITICAL: Response must end with </websearch> tag (no text after allowed)'
  ],
  warnings: [],
  foundURLs: ['https://example.com', 'https://test.com']
}
```

## Integration

System prompt now includes:
- **STEP 1-5**: Clear sequential instructions
- **CRITICAL RULES**: Marked with ✅/❌ indicators
- **EXACT STRUCTURE**: Shows exact example to follow
- **ABSOLUTE RULES**: Zero tolerance section
- **VALIDATION CHECKLIST**: Pre-send checklist
- **REMINDER**: "ZERO FLEXIBILITY. EXACT FORMAT. NO EXCEPTIONS."

## Error Messages

Validation errors now include:
- `CRITICAL:` prefix for show-stopping issues
- Specific format requirements
- Which rule was violated
- How to fix it

Example errors:
```
CRITICAL: Response must start with <websearch> tag (no preamble allowed)
CRITICAL: Shortened URL detected: https://bit.ly/xyz (use full URLs only)
CRITICAL: Only 2 URLs found. Minimum required: 3
CRITICAL: Findings section must cite sources using [Source](URL) format
CRITICAL: Fake/placeholder URL detected: https://example.com
```

## Expected Response Quality

### Before
```
## Pasi Nagvanshi - Web Search Summary
### Key Findings:
[Mixed content without structure]
```

### After
```
<websearch>
## URLs Searched

- [Wikipedia - Pasi](https://en.wikipedia.org/wiki/Pasi) - Information about Pasi caste
- [Census Records](https://censusindia.gov.in) - Official caste classifications
- [JSTOR Academic](https://jstor.org) - Academic research on Indian castes

## Findings

According to [Wikipedia - Pasi](https://en.wikipedia.org/wiki/Pasi), the Pasi are traditionally classified as...

[Census Records](https://censusindia.gov.in) show that...

Academic research from [JSTOR](https://jstor.org) indicates...
</websearch>
```

## Testing

### Valid Response Check
```typescript
import { validateWebSearchBlock } from '@/lib/websearch-formatter';

const response = `<websearch>
## URLs Searched
- [Source](https://url.com) - Description
## Findings
...
</websearch>`;

const validation = validateWebSearchBlock(response);
console.log(validation.isValid); // true
```

### Invalid Response Check
```typescript
const badResponse = "Based on my research..."; // No tags

const validation = validateWebSearchBlock(badResponse);
console.log(validation.errors);
// [
//   'CRITICAL: Response must start with <websearch> tag',
//   'Missing closing </websearch> tag',
//   ...
// ]
```

## Files Modified

1. **websearch-formatter.ts**
   - Rewrote `generateWebSearchSystemPrompt()` - 120+ lines
   - Enhanced `validateWebSearchBlock()` - 90+ lines
   - Added `warnings` field to validation result

## Commit Info

**Hash**: `4ad8b6d`

**Message**: `fix: Enforce strict websearch format validation and system prompt`

**Changes**:
- 180 insertions
- 63 deletions
- 2 files modified

## Key Enforcement Points

1. **No Preamble**: Must start with `<websearch>` immediately
2. **No Trailing Text**: Must end with `</websearch>` immediately
3. **Structure Order**: websearch → URLs Searched → URLs list → Findings → closing tag
4. **URL Requirements**: Minimum 3, full URLs, descriptions for all
5. **Citation Requirement**: All findings must cite sources
6. **No Fake URLs**: Detects common fake domains
7. **No Shortened URLs**: Detects bit.ly, goo.gl, tinyurl, etc.
8. **Validation Checklist**: AI checks before sending

## Summary

Complete enforcement system that forces AI to:
- Use proper markdown structure
- List all URLs accessed
- Cite all sources in findings
- Follow exact format with zero variations
- Cannot skip sections or add preamble/trailing text
- Cannot use shortened or fake URLs
- Must include minimum 3 URLs with descriptions

This prevents the poorly formatted responses mentioned earlier.
