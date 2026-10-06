---
name: api-mutation-standards
description: Enforces standards for Supabase mutations (inserts, updates, deletes), data fetching, error handling, and ViewModel loading states.
---

# API & Mutation Standards for BYC FastForm Mobile

This skill governs how the application interacts with the Supabase backend. It enforces strict separation between database calls (Services) and state orchestration (ViewModels), ensuring robust error handling and standardized loading states.

## 1. Architectural Boundaries for Mutations

- **FORBIDDEN:** Never import `supabase` or make database calls directly inside a `.tsx` View component.
- The `services/` layer is the ONLY place where `supabase.from(...)` is allowed.
- The `hooks/` layer (ViewModel) is the ONLY place that calls the `services/` layer. It orchestrates `try/catch` blocks, loading states, and success/error feedback.

## 2. The Service Layer Pattern (Models)

All API mutations must reside in `src/features/<feature-name>/services/`.
Every mutation must check for the Supabase `error` object and `throw` it so the ViewModel can catch it.

### Correct Service Example:
```typescript
// src/features/credit-application/services/creditService.ts
import { supabase } from '@/shared/utils/supabase';
import { CreditApplicationInsert, CreditApplicationRow } from '../types';

export const createCreditApplication = async (
  payload: CreditApplicationInsert
): Promise<CreditApplicationRow> => {
  const { data, error } = await supabase
    .from('credit_applications')
    .insert(payload)
    .select()
    .single();

  if (error) {
    // Log technical error internally, but throw it to be handled by ViewModel
    console.error('[createCreditApplication] Error:', error);
    throw new Error(error.message);
  }

  return data;
};
```

## 3. The ViewModel Mutation Pattern (State & Error Handling)

ViewModels must handle loading states, capture errors gracefully from services, and expose clean trigger actions to the View.

```typescript
// ✅ CORRECT: src/features/credit-application/hooks/useCreditFormViewModel.ts
import { useState } from 'react';
import { createCreditApplication } from '../services/creditService';
import type { CreditApplicationInsert } from '../types';

export const useCreditFormViewModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitApplication = async (payload: CreditApplicationInsert) => {
    setIsLoading(true);
    setError(null);
    try {
      await createCreditApplication(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la solicitud.');
    } finally {
      setIsLoading(false);
    }
  };

  return { submitApplication, isLoading, error };
};
```