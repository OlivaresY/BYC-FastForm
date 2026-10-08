---
name: storybook-standards
description: Architecture and configuration standards for Storybook in BYC FastForm — enforcing 100% Metro bundler integration, zero Webpack, withStorybook wrapper composition, dynamic entry-point injection, and automated story indexing.
---

# Storybook Architecture & Integration Standards

Governs the setup, maintenance, and execution of Storybook within the BYC FastForm Expo/React Native ecosystem. These standards prevent bundling regressions, dependency collisions, and production bundle leakage.

---

## 1. Zero Webpack & Core Architecture Baseline

- **Metro Only (100%):** All Storybook execution, transformation, and bundling MUST use the native React Native Metro Bundler.
- **Forbidden Dependencies:** Webpack (`webpack`, `@storybook/builder-webpack5`, `@storybook/manager-webpack5`) and deprecated legacy addons (`@storybook/addon-knobs`, `@storybook/addon-links`, `@storybook/addon-essentials`, `@storybook/addon-storyshots`) are **strictly prohibited**.
- **Modern CSF3 Standard:** Stories must be written strictly using Component Story Format 3 (CSF3) with typed `Meta` and `StoryObj` contracts from `@storybook/react-native` (v10+).

```tsx
// ✅ Correct — CSF3 standard with Meta & StoryObj
import type { Meta, StoryObj } from '@storybook/react-native';
import { BaseButton } from './BaseButton';

const meta = {
  title: 'Shared/UI/BaseButton',
  component: BaseButton,
  args: {
    label: 'Continuar',
  },
} satisfies Meta<typeof BaseButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Aprobar Solicitud',
  },
};
```

---

## 2. Metro Bundler Configuration (`metro.config.js`)

### Prohibited: Manual Resolver Interception
Writing custom `resolveRequest` hacks (such as manually trapping `storybook/internal/*` subpaths with `require.resolve`) is **strictly forbidden**. Manual overrides are brittle, bypass Storybook's story-watching lifecycle, and create maintenance liabilities across version bumps.

### Mandatory: Official `withStorybook` Composition
Metro must be configured using the official `@storybook/react-native/metro/withStorybook` enhancer, composed together with `withNativeWind`.

#### Key Responsibilities of `withStorybook`:
- **Automated Story Indexing:** Automatically executes story indexing (`generate()`), keeping `.storybook/storybook.requires.ts` continuously synchronized with `src/**/*.stories.tsx` without manual imports.
- **Internal Export Aliasing:** Automatically resolves internal Storybook package subpaths and CSF3 dependencies.
- **Tree-Shaking & Bundle Stripping:** When `enabled: false`, it stubs `@storybook/*` modules to empty stubs, guaranteeing zero Storybook bloat in production bundles.

```javascript
// ✅ Correct — metro.config.js composition
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');
const path = require('path');

let config = getDefaultConfig(__dirname);

const isStorybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

config = withStorybook(config, {
  enabled: isStorybookEnabled,
  configPath: path.resolve(__dirname, './.storybook'),
});

module.exports = withNativeWind(config, { input: './global.css' });
```

```javascript
// ❌ Incorrect — FORBIDDEN manual resolver hacks
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("storybook/internal/")) {
    return { filePath: require.resolve(moduleName), type: "sourceFile" };
  }
  return originalResolveRequest(context, moduleName, platform);
};
```

---

## 3. Entry Point Injection & Bundle Isolation (`app/_layout.tsx`)

### Prohibited: Static Top-Level Imports
Never import Storybook statically at the top level of `app/_layout.tsx` or any root navigation file. Static imports force Metro to traverse and bundle the entire Storybook dependency graph (including on-device UI, bottom sheets, and datetime pickers) into production and standard development builds.

### Mandatory: Dynamic Conditional Loading
Storybook MUST be dynamically imported inside the condition checking `process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true'`.

```tsx
// ✅ Correct — Dynamic lazy import prevents production bundle leakage
import '../../global.css';
import React from 'react';
import { Stack } from 'expo-router';

const RootLayout = (): React.JSX.Element => {
  if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
    const Storybook = require('../../.storybook/Storybook').default;
    return <Storybook />;
  }

  return <Stack />;
};

export default RootLayout;
```

```tsx
// ❌ Incorrect — FORBIDDEN static import (leaks Storybook into standard bundles)
import '../../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import Storybook from '../../.storybook/Storybook'; // LEAKS DEPENDENCIES

const RootLayout = (): React.JSX.Element => {
  if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
    return <Storybook />;
  }
  return <Stack />;
};
```

---

## 4. Automation & Story File Maintenance

- **Automatic Manifest Generation:** Do not manually edit `.storybook/storybook.requires.ts`. When `withStorybook` is active, Metro scans the glob defined in `.storybook/main.ts` (`stories: ["../src/**/*.stories.?(ts|tsx|js|jsx)"]`) and updates the manifest automatically.
- **Story Placement:** All story files must reside alongside their respective components (e.g., `src/shared/ui/BaseButton/BaseButton.stories.tsx`), strictly outside the `src/app/` routing directory.
- **Environment Trigger:** Storybook is launched strictly via the cross-platform command:
  ```bash
  npm run storybook
  # Which executes: cross-env EXPO_PUBLIC_STORYBOOK_ENABLED=true npx expo start --clear
  ```
