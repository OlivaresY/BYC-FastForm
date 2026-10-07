---
name: component-architecture
description: Enforces Feature-Sliced Design (FSD) and MVVM architecture for React Native/Expo. Use when scaffolding new screens, features, or refactoring UI logic.
---

# Component Architecture & MVVM Standards

This skill defines the structural backbone for BYC FastForm Mobile. It strictly enforces Feature-Sliced Design (FSD) combined with the Model-View-ViewModel (MVVM) pattern.

## 1. Feature-Sliced Design (FSD) Directory Structure
Every new feature must be entirely self-contained within its own domain folder under `src/features/<feature-name>/`. Do not pollute the global `src/app/` directory with logic.

- **Naming:** Use `kebab-case` for feature folders (e.g., `credit-application`, `user-profile`).
- **Required Layout:**
```text
src/
├── app/                      # Expo Router navigation (Dumb Pages only)
├── features/
│   └── <feature-name>/       # Feature domain
│       ├── components/       # Views: Pure UI components (.tsx)
│       ├── hooks/            # ViewModels: State & Logic (use*ViewModel.ts)
│       ├── services/         # Models: Supabase DB calls & API requests
│       ├── types/            # Contracts: TypeScript interfaces & Zod schemas
│       ├── constants/        # Feature-specific constants
│       └── tests/            # POM-based UI and hook tests
└── shared/                   # Global UI primitives, utils, and constants
```

## 2. Spec-Driven Development (SDD) Compliance
MANDATORY: Do not start implementation blindly. 
Always refer to `.agents/WORKFLOW.md`. You must generate a `[SPECIFICATION DRAFT]` detailing the files to be created across the FSD layers (Types -> Services -> Hooks -> Components) and await the user's approval before writing code.

## 3. The MVVM Pattern (Presentation vs. Logic)
We enforce a strict separation of concerns. UI files and Logic files must never mix responsibilities.

### `.tsx` Files (View / Presentation Layer)
- Location: `src/features/<feature-name>/components/` or `src/app/`.
- Presentation only: They should contain React Native JSX and NativeWind `className` bindings.
- Design System reuse: Must use standardized wrappers from `src/shared/components` (`Typography`, `Button`, `InputField`, etc.). Raw `Text` or `TouchableOpacity` are forbidden.
- Zero Business Logic: No `useState`, `useEffect`, data fetching, or database logic allowed.
- Readable Returns: If a component's JSX grows too large, extract local mini-components within the same feature folder.

### `use*ViewModel.ts` Files (ViewModel / Logic Layer)
- Location: `src/features/<feature-name>/hooks/`.
- All logic, state orchestration, React hooks, and data fetching (calling `services`) live here.
- Must return a clean, strongly-typed object containing state properties and actions for the View to consume.

---

### ❌ INCORRECT (Do not use this pattern - Logic mixed in UI)
```tsx
// src/features/inventory/components/InventoryList.tsx
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { supabase } from '@/shared/utils/supabase';

export const InventoryList = () => {
  const [items, setItems] = useState([]); // ❌ FORBIDDEN: State in View
  
  useEffect(() => { 
    // ❌ FORBIDDEN: Data fetching in View
    supabase.from('inventory').select('*').then(setItems);
  }, []);
  
  return (
    <View>
      <Text>Items loaded: {items.length}</Text>
    </View>
  );
};
```

---

### ✅ CORRECT (Standard MVVM Separation)

#### 1. ViewModel (State, Hooks & Service Calls)
```typescript
// src/features/inventory/hooks/useInventoryViewModel.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchInventoryItems } from '../services/inventoryService';
import { InventoryItem } from '../types';

export interface UseInventoryViewModelReturn {
  items: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useInventoryViewModel = (): UseInventoryViewModelReturn => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchInventoryItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el inventario');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return {
    items,
    isLoading,
    error,
    refresh: loadItems,
  };
};
```

#### 2. View Component (Pure UI Presentation)
```tsx
// src/features/inventory/components/InventoryList.tsx
import React from 'react';
import { View } from 'react-native';
import { Typography, Spinner } from '@/shared/components';
import { useInventoryViewModel } from '../hooks/useInventoryViewModel';

export const InventoryList: React.FC = () => {
  const { items, isLoading, error } = useInventoryViewModel();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Spinner />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Typography variant="body" className="text-red-500">
          {error}
        </Typography>
      </View>
    );
  }

  return (
    <View className="p-4">
      <Typography variant="body">
        Elementos cargados: {items.length}
      </Typography>
    </View>
  );
};
```