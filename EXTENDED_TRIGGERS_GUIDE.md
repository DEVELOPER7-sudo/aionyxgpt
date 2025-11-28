# Extended Triggers System - Complete Guide

## Overview

The Extended Triggers System adds AI-powered automatic trigger selection and introduces 4 new specialized trigger categories with 400-500+ new triggers. This document covers all aspects of the system.

---

## New Features

### 1. AI Auto-Trigger Selection

The system now automatically analyzes user messages to suggest optimal triggers without manual selection.

**How It Works:**
- When user types a message, AI analyzes keywords and context
- Suggests 1-3 most relevant triggers
- Provides confidence score (0-100%)
- User can apply, modify, or dismiss suggestions
- Works alongside manual trigger selection

**Key Benefits:**
- Reduces manual trigger selection effort
- Improves response quality through context awareness
- Learns from patterns in user input
- Provides confidence metrics for decision making

### 2. Four New Trigger Categories

#### Category 1: Technical Deep Dive (~100 triggers)
**Purpose:** Advanced technical analysis with comprehensive coverage
**Use Cases:**
- Architecture design and analysis
- Performance optimization
- Security auditing
- Distributed systems
- Database optimization
- API design patterns
- Container orchestration
- Infrastructure as Code

**System Prompt Style:**
```
╔════════════════════════════════════════════════════════════════════════════════╗
║            TECHNICAL DEEP DIVE ANALYSIS - COMPREHENSIVE COVERAGE               ║
║  ═════════════════════════════════════════════════════════════════════════════ ║
```

**Examples:**
- `____═══ ARCHITECTURE_DESIGN_ANALYSIS ═══____`
- `◆◆◆ PERFORMANCE_OPTIMIZATION_DEEP_DIVE ◆◆◆`
- `▓▓▓ SECURITY_AUDIT_COMPREHENSIVE ▓▓▓`

#### Category 2: Advanced Problem Solving (~100 triggers)
**Purpose:** Complex problem resolution with systematic approaches
**Use Cases:**
- Root cause analysis
- Complex debugging
- Constraint optimization
- Edge case discovery
- System failure recovery
- Problem decomposition
- Conflict resolution
- Innovation frameworks

**System Prompt Style:**
```
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  ADVANCED PROBLEM SOLVING FRAMEWORK
  ══════════════════════════════════════════════════════════════════════════════
```

**Examples:**
- `▼▼▼ ROOT_CAUSE_ANALYSIS ▼▼▼`
- `►► COMPLEX_DEBUGGING ►►`
- `≡≡≡ CONSTRAINT_OPTIMIZATION ≡≡≡`

#### Category 3: Specialist Domains (~100 triggers)
**Purpose:** Domain-specific expertise and professional knowledge
**Use Cases:**
- Machine Learning & AI
- Blockchain & Cryptography
- Cloud Infrastructure
- DevOps Practices
- Mobile Development
- Frontend Optimization
- Data Engineering
- System Administration
- Game Development
- Embedded Systems

**System Prompt Style:**
```
╭─────────────────────────────────────────────────────────────────────────────────╮
│  SPECIALIST DOMAIN EXPERTISE - DEEP PROFESSIONAL KNOWLEDGE                      │
│  ═════════════════════════════════════════════════════════════════════════════  │
```

**Examples:**
- `◬◬◬ MACHINE_LEARNING_EXPERT ◬◬◬`
- `♪♪♪ BLOCKCHAIN_CRYPTOGRAPHY ♪♪♪`
- `█████ CLOUD_INFRASTRUCTURE █████`

#### Category 4: Synthesis and Integration (~100 triggers)
**Purpose:** Combining knowledge across disciplines and integrating systems
**Use Cases:**
- Cross-discipline connections
- Multi-perspective analysis
- Knowledge synthesis
- System integration
- Emerging trends analysis
- Holistic solution design
- Cross-domain patterns
- Collaborative frameworks
- Ecosystem mapping
- Paradigm integration

**System Prompt Style:**
```
████████████████████████████████████████████████████████████████████████████████
█  KNOWLEDGE SYNTHESIS & SYSTEM INTEGRATION - UNIFIED UNDERSTANDING              █
█  ════════════════════════════════════════════════════════════════════════════  █
```

**Examples:**
- `▀▄ CONNECT_DISCIPLINES ▄▀`
- `◇≡◇ MULTI_PERSPECTIVE_ANALYSIS ◇≡◇`
- `╬═╬ KNOWLEDGE_SYNTHESIS ╬═╬`

---

## Trigger Naming Convention

All new extended triggers follow a distinctive naming pattern with minimum 2 lines using underscores or symbols:

### Format: `___TRIGGER_NAME___` or `◆◆◆ TRIGGER_NAME ◆◆◆`

**Examples:**
- `____═══ ARCHITECTURE_DESIGN_ANALYSIS ═══____` (Technical Deep Dive)
- `▼▼▼ ROOT_CAUSE_ANALYSIS ▼▼▼` (Advanced Problem Solving)
- `◬◬◬ MACHINE_LEARNING_EXPERT ◬◬◬` (Specialist Domains)
- `▀▄ CONNECT_DISCIPLINES ▄▀` (Synthesis and Integration)

**Valid Symbols for Naming:**
- Underscores: `_`, `=`, `-`
- Box Drawing: `╔`, `╗`, `║`, `═`, `╭`, `╮`
- Solid Blocks: `█`, `▓`, `▒`, `░`
- Shapes: `◆`, `◇`, `▲`, `▼`, `►`, `◄`
- Lines: `─`, `═`, `▬`, `▁`
- Decoratives: `★`, `✦`, `◈`, `◙`

---

## System Implementation

### File Structure

```
src/lib/
├── triggers-extended.ts           # New extended triggers (400-500 triggers)
├── trigger-manager-extended.ts    # Manager for extended triggers
└── triggers.ts                    # Original trigger system (unchanged)

src/components/
├── AIAutoTriggerSelector.tsx      # UI component for auto-selection
└── [existing trigger components]
```

### Integration Points

#### 1. Auto-Trigger Detection
```typescript
import { autoSelectTriggers } from '@/lib/triggers-extended';

const result = autoSelectTriggers(userMessage);
// Returns: {
//   suggestedTriggers: string[],
//   confidence: number,
//   reasoning: string,
//   category: string
// }
```

#### 2. Initialize Extended System
```typescript
import { initializeExtendedTriggerSystem } from '@/lib/trigger-manager-extended';

// Call once on app startup
initializeExtendedTriggerSystem();
```

#### 3. Build Combined Prompts
```typescript
import { buildCombinedTriggerPrompt } from '@/lib/trigger-manager-extended';

const result = buildCombinedTriggerPrompt(
  autoSuggestedTriggers,
  manuallySelectedTriggers,
  userMessage
);
// Returns system prompt with both auto and manual triggers
```

---

## UI Components

### AIAutoTriggerSelector Component

**Props:**
```typescript
{
  userMessage: string;           // User's current message
  selectedTriggers: string[];    // Currently selected triggers
  onTriggersChange: (triggers: string[]) => void;  // Callback
  isVisible?: boolean;           // Show/hide component
}
```

**Features:**
- Real-time trigger analysis
- Confidence score display
- One-click application
- Dismiss functionality
- Visual category indicators
- Debounced analysis (300ms)

**Integration Example:**
```tsx
<AIAutoTriggerSelector
  userMessage={inputMessage}
  selectedTriggers={selectedTriggers}
  onTriggersChange={setSelectedTriggers}
  isVisible={true}
/>
```

---

## Trigger Statistics

### Current Count by Category

| Category | Count | Status |
|----------|-------|--------|
| Reasoning and Analysis | 20+ | Original |
| Research and Information | 25+ | Original |
| Planning and Organization | 15+ | Original |
| Communication and Style | 12+ | Original |
| Coding and Development | 30+ | Original |
| Creative and Writing | 25+ | Original |
| Data and Analytics | 20+ | Original |
| Business and Strategy | 18+ | Original |
| Education and Learning | 20+ | Original |
| **Technical Deep Dive** | **~100** | **NEW** |
| **Advanced Problem Solving** | **~100** | **NEW** |
| **Specialist Domains** | **~100** | **NEW** |
| **Synthesis and Integration** | **~100** | **NEW** |
| **TOTAL** | **~500+** | |

---

## Auto-Selection Algorithm

### How It Works

1. **Keyword Analysis**
   - Tokenizes user message
   - Matches against pattern keywords
   - Calculates match confidence

2. **Category Detection**
   - Identifies primary category
   - Weighs keywords by relevance
   - Returns confidence score

3. **Trigger Selection**
   - Maps keywords to 1-3 triggers
   - Deduplicates suggestions
   - Sorts by confidence

4. **Confidence Calculation**
   - Pattern confidence × keyword density
   - Capped at 0.95 max confidence
   - Only suggests if > 0.7 threshold

### Confidence Scoring

- **0.95:** Strong pattern match + multiple keywords
- **0.85-0.92:** Moderate pattern match + 1-2 keywords
- **0.70-0.84:** Weak pattern match or single keyword
- **< 0.70:** No suggestion shown (dismissed)

---

## System Prompts

### Category-Specific Guidance

Each extended trigger category includes comprehensive system prompt guidance:

**Technical Deep Dive:**
```
╔════════════════════════════════════════════════════════════════════════════════╗
║  • Provide architectural insights with component analysis
║  • Include scalability, performance, security considerations
║  • Show implementation strategies with best practices
║  • Reference industry standards and patterns
║  • Justify technical decisions with solid reasoning
╚════════════════════════════════════════════════════════════════════════════════╝
```

**Advanced Problem Solving:**
```
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  ► Systematic Problem Deconstruction
  ► Root Cause Analysis
  ► Solution Development
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
```

---

## Usage Examples

### Example 1: Automatic Trigger Suggestion

**User Message:**
> "How can I optimize my React application for better performance?"

**AI Analysis:**
- Keywords detected: `optimize`, `React`, `performance`
- Suggested triggers: `optimize`, `performance`, `frontend`
- Category: `Specialist Domains` (Frontend Optimization)
- Confidence: 92%

**Auto-Selected Triggers:**
1. `▓▓█ FRONTEND_OPTIMIZATION ▓▓█`
2. `★★★ SCALABILITY_ASSESSMENT ★★★`
3. `◆◆◆ PERFORMANCE_OPTIMIZATION_DEEP_DIVE ◆◆◆`

### Example 2: Combined Auto + Manual Selection

**User Message:**
> "Design a distributed payment system architecture"

**Auto-Selected:**
- `____═══ ARCHITECTURE_DESIGN_ANALYSIS ═══____` (92% confidence)
- `════ DISTRIBUTED_SYSTEMS_ANALYSIS ════` (88% confidence)

**Manual Selection:**
- User also selects: `security`, `scalability`

**Final System Prompt:**
- Combines architecture analysis
- Adds distributed systems specific guidance
- Incorporates security considerations
- Includes scalability metrics

---

## Configuration & Customization

### Enable/Disable Extended Triggers

```typescript
import { getAllTriggers, saveTriggers } from '@/lib/triggers';

const triggers = getAllTriggers();
const techDeepDive = triggers.filter(t => 
  t.category === 'Technical Deep Dive'
);

// Disable all Technical Deep Dive triggers
techDeepDive.forEach(t => t.enabled = false);
saveTriggers(triggers);
```

### Create Custom Extended Trigger

```typescript
const customTrigger: Trigger = {
  trigger: '════ CUSTOM_ANALYSIS ════',
  category: 'Technical Deep Dive',
  systemInstruction: 'Your custom instruction here...',
  example: 'Usage example...',
  enabled: true,
  custom: true,
};
```

### Export Extended Triggers

```typescript
import { exportExtendedTriggers } from '@/lib/trigger-manager-extended';

// Export as JSON
const json = exportExtendedTriggers('json');

// Export as Markdown
const md = exportExtendedTriggers('markdown');
```

---

## Performance Considerations

### Auto-Selection Performance
- **Debounce Delay:** 300ms (prevents excessive analysis)
- **Analysis Time:** < 50ms for typical messages
- **Memory Usage:** Minimal (pattern matching only)
- **Network:** No external calls (all local)

### Optimization Tips
1. Use debouncing in input handlers
2. Cache trigger lists in memory
3. Lazy-load extended triggers if needed
4. Implement virtual scrolling for large lists

---

## Backward Compatibility

**The extended trigger system is fully backward compatible:**
- Original 9 categories unchanged
- Original triggers still work exactly as before
- New categories are additive
- Auto-selection is optional feature
- Manual trigger selection still available

---

## Troubleshooting

### Auto-Selection Not Working
1. Verify message length > 10 characters
2. Check message contains relevant keywords
3. Ensure confidence > 0.7 threshold
4. Check browser console for errors

### Extended Triggers Not Loading
1. Call `initializeExtendedTriggerSystem()` on app start
2. Verify `triggers-extended.ts` is imported
3. Check localStorage for trigger conflicts
4. Clear localStorage and reinitialize

### System Prompt Not Applying
1. Verify triggers are enabled
2. Check category system prompt exists
3. Ensure trigger instruction is set
4. Verify XML tag is valid

---

## API Reference

### Core Functions

#### `autoSelectTriggers(userMessage: string)`
Analyzes message and returns trigger suggestions.

**Returns:**
```typescript
{
  suggestedTriggers: string[];
  confidence: number;        // 0-1
  reasoning: string;
  category: ExtendedTriggerCategory;
}
```

#### `initializeExtendedTriggerSystem()`
Merges extended triggers with built-in triggers.

#### `buildCombinedTriggerPrompt()`
Builds system prompt with auto + manual triggers.

**Parameters:**
- `autoSuggestedTriggers: string[]`
- `manuallySelectedTriggers: string[]`
- `userMessage: string`

**Returns:**
```typescript
{
  systemPrompt: string;
  allActiveTriggers: string[];
  autoSelected: string[];
  manualSelected: string[];
  confidence: number;
}
```

#### `getTriggerStatistics()`
Returns trigger system statistics.

**Returns:**
```typescript
{
  totalTriggers: number;
  totalExtendedTriggers: number;
  enabledTriggers: number;
  customTriggers: number;
  categoriesBreakdown: Record<string, number>;
  categories: string[];
}
```

#### `exportExtendedTriggers(format: 'json' | 'markdown')`
Exports extended triggers in specified format.

---

## Future Enhancements

### Planned Features
1. Machine learning-based trigger prediction
2. User preference learning
3. Trigger usage analytics
4. Community trigger sharing
5. Advanced multi-trigger orchestration
6. Trigger priority weighting
7. Contextual trigger chains
8. Performance profiling per trigger

### Community Contributions
- New trigger categories
- Improved algorithms
- Better UI/UX
- Documentation improvements
- Performance optimizations

---

## Support & Resources

### Getting Help
- Check this guide first
- Review code comments
- Check browser console
- Test with simple messages

### Reporting Issues
- Include message that triggered error
- Provide browser/OS info
- Include error stack trace
- Describe expected vs actual behavior

---

## Changelog

### Version 1.0 (Current)
- ✅ 4 new trigger categories
- ✅ 400+ extended triggers
- ✅ AI auto-trigger selection
- ✅ Category-specific system prompts
- ✅ AIAutoTriggerSelector component
- ✅ Extended trigger manager
- ✅ Full backward compatibility

---

## License & Attribution

This extended trigger system builds upon the original OnyxGPT trigger framework.

**Components:**
- Original trigger system: OnyxGPT team
- Extended triggers: New implementation
- Auto-selection algorithm: Custom development
- UI components: React + shadcn/ui

---

**Last Updated:** 2024-11-28
**Version:** 1.0
**Status:** Production Ready
