# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**FOOODDD** is a personal recipe journal website for "Arnav + Ayushi". It has not been scaffolded yet — `plan.md` contains the full specification. The implementation should follow that plan exactly.

## Stack

- **Next.js 14+ App Router** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Framer Motion** for animations and page transitions
- **Local JSON** (`/data/recipes.json`) as Phase 1 storage — designed to swap to Prisma/SQLite later

## Commands (once scaffolded)

```bash
npm install          # install dependencies
npm run dev          # start dev server at localhost:3000
npm run build        # production build
npm run lint         # ESLint
npm run test         # run utility tests (if added)
```

To add shadcn/ui components after scaffolding:
```bash
npx shadcn-ui@latest add <component-name>
```

## Route Structure

| Route | Purpose |
|---|---|
| `/` | Home: hero, random pick, featured carousel, category chips, search |
| `/recipes` | Grid with instant search, filter drawer, sort, skeleton loaders |
| `/recipes/[slug]` | Detail: image header, scaler, step timers, Cooking Mode, unit toggle |
| `/add` | Add Recipe form with validation |

## Architecture Decisions

- **Server vs Client Components:** Use Server Components for data fetching (recipe list, detail pages). Mark interactive pieces — search, filter drawer, servings scaler, step timers, Cooking Mode — as `"use client"`.
- **Data Access Layer:** All reads/writes go through `lib/data.ts`. This is the only file that touches `data/recipes.json`, making the Phase 2 swap to Prisma isolated to one file.
- **Slug-based routing:** Recipes are identified by slug in URLs. `lib/slugify.ts` generates slugs; the JSON stores them as a top-level field.
- **Ingredient scaling:** Quantities are stored as numbers in the data model. `lib/scaling.ts` computes scaled values at render time based on a `servings` multiplier held in component state.
- **Unit conversion:** `lib/units.ts` handles metric ↔ US conversions. The unit preference is stored in component state (not persisted).

## Key Components

| Component | Notes |
|---|---|
| `CookingModeDialog` | Full-screen overlay; uses `navigator.wakeLock` for keep-awake; keyboard shortcuts: `←`/`→` for step nav, `Space` to check step |
| `FeaturedCarousel` | Client component using Framer Motion drag/scroll |
| `FilterDrawer` | Animated slide-in drawer using shadcn/ui Sheet |
| `ServingsScaler` | Controlled number input; passes multiplier down to ingredient list |
| `StepTimerList` | Each step can have an optional countdown timer (`timerSec` field) |

## Data Model (TypeScript shape)

Defined in `types/recipe.ts`. Key fields:

```ts
ingredients: { item: string; quantity: number; unit: string; notes?: string }[]
steps: { text: string; timerSec?: number }[]
notes: { arnav?: string; ayushi?: string }
cookedLog: { dateISO: string; photoUrl?: string; quickNote?: string }[]
difficulty: 'easy' | 'medium' | 'hard'
spiceLevel: 'mild' | 'medium' | 'hot'
dietTags: string[]
```

## Seed Data

`data/recipes.json` must contain at least 8 realistic, varied recipes covering: Indian dishes, pasta, desserts, drinks, and veg-friendly options. These are used to populate the site on first run.

## UX Constraints

- "Done cooking" celebration: subtle confetti or Framer Motion animation — not a full-screen takeover.
- All interactive components must be keyboard-accessible.
- Mobile-first responsive layout throughout.
- No placeholder `...` code — all files must be complete and runnable.
