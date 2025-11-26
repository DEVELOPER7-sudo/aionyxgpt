# Custom Model Prefix Feature

## Overview
Added a new settings toggle to allow users to choose between `openrouter` and `togetherai` API prefixes when adding custom models.

## Changes Made

### 1. Type Definitions (`src/types/chat.ts`)
- Added `customModelPrefix?: 'openrouter' | 'togetherai'` to `AppSettings` interface
- Default value: `'openrouter'`

### 2. Storage (`src/lib/storage.ts`)
- Updated default settings to include `customModelPrefix: 'openrouter'` in both success and error paths
- Ensures persistent storage of user's prefix choice

### 3. Model Utilities (`src/lib/model-utils.ts`)
- **Updated `addCustomModel()`**: Now accepts optional `prefix` parameter (defaults to `'openrouter'`)
  - Auto-detects existing prefixes (openrouter: or togetherai:)
  - Applies selected prefix to model IDs that don't have one
  
- **Updated `beautifyModelName()`**: Now strips both `openrouter:` and `togetherai:` prefixes
  - Handles model name display regardless of prefix
  
- **Updated `getProviderFromModelId()`**: Now handles `togetherai:` prefix
  - Extracts provider name from both prefix types

### 4. Settings UI (`src/components/SettingsPanel.tsx`)
- Added visual prefix selection interface with two clickable cards:
  - **OpenRouter** (blue): Uses `openrouter:` prefix
  - **Together AI** (green): Uses `togetherai:` prefix
- Updated `handleAddCustomModel()` to use the selected prefix from settings
- Integrated with local settings state for real-time selection

## User Interface
The new settings section appears in the AI Models card with:
1. A description: "Choose which API provider to use when adding custom models"
2. Two clickable cards with radio-button style indicators
3. Visual feedback showing the selected provider
4. Updated help text below indicating the prefix will be used for new models

## How It Works
1. User opens Settings → AI Models section
2. Selects either OpenRouter or Together AI in the "Custom Model API Prefix" section
3. When adding a custom model via the input field, the selected prefix is automatically applied
4. Models are stored with the appropriate prefix in localStorage
5. Setting persists across sessions

## Example
- If user selects **Together AI** and adds model `meta-llama/llama-2-70b`
- Model is stored as `togetherai:meta-llama/llama-2-70b`
- Display name shown as "Meta Llama Llama 2 70b"
