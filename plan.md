# FOOODDD — Recipe Website Plan

> You are Claude Opus 4.6 working inside GitHub Copilot Chat.

Build a clean, premium, interactive recipe website for **"Arnav + Ayushi"** that feels like a modern recipe journal, not a basic blog.

---

## Hard Requirements

1. Use **Next.js 14+ App Router** with TypeScript.
2. Use **Tailwind CSS** for styling.
3. Use **shadcn/ui** components where appropriate.
4. Use **Framer Motion** for subtle animations and page transitions.
5. The UI must feel high-end: strong typography, spacing, card depth, responsive layout, tasteful motion, no clutter.
6. Provide full code files with a realistic multi-file structure.

---

## Core Pages

### 1. Home Page
- Hero section
- "Tonight's pick" random recipe button
- Featured recipes carousel
- Category chips
- Search bar that filters in real time

### 2. Recipes Page
- Responsive grid of recipe cards
- Instant search
- Filter drawer
- Sort controls
- Skeleton loaders

### 3. Recipe Detail Page
- Image header
- Metadata
- Ingredients list
- Steps list
- Notes section
- **Interactive features:**
  - Servings scaler that updates ingredient amounts
  - Step checklist with per-step timers
  - **Cooking Mode:** full screen, large text, next/prev step controls, keep-screen-awake behavior if possible
  - Unit toggle (metric/US) with basic conversion helpers

### 4. Add Recipe Page
- Form with validation
- Image URL upload field
- Tags, cuisine, prep/cook time, servings, difficulty, spice level, diet flags

---

## Data Model

A `Recipe` includes:

| Field | Type | Notes |
|---|---|---|
| `id` | string | unique identifier |
| `slug` | string | URL-safe title |
| `title` | string | |
| `description` | string | |
| `coverImage` | string | URL |
| `cuisine` | string | |
| `dietTags` | string[] | e.g. vegan, gluten-free |
| `difficulty` | `easy \| medium \| hard` | |
| `spiceLevel` | `mild \| medium \| hot` | |
| `prepTimeMin` | number | |
| `cookTimeMin` | number | |
| `totalTimeMin` | number | |
| `servings` | number | |
| `ingredients` | `{ item, quantity, unit, notes? }[]` | |
| `steps` | `{ text, timerSec? }[]` | |
| `notes` | `{ arnav?: string, ayushi?: string }` | |
| `createdAt` | string | ISO date |
| `updatedAt` | string | ISO date |
| `cookedLog` | `{ dateISO, photoUrl?, quickNote? }[]` | cooking history |
| `rating` / `makeAgain` | number / boolean | |

---

## Storage Approach

- **Phase 1:** Store recipes in a local JSON file at `/data/recipes.json`, loaded via a small data access layer.
- **Phase 2-ready:** Design code so it can be swapped to Prisma/SQLite later with minimal changes.

---

## UX Polish

- Smooth animations for card hover, filter drawer open, and page transitions.
- Keyboard shortcuts in Cooking Mode: left/right arrows, space to check step.
- Small "done cooking" celebration: subtle confetti or animation.
- Accessible components with good contrast throughout.

---

## Implementation Details

### Architecture
- Use **Server Components** where appropriate; interactive pieces as **Client Components**.
- Route structure:
  - `/` — Home
  - `/recipes` — Recipe grid
  - `/recipes/[slug]` — Recipe detail
  - `/add` — Add recipe form

### Reusable Components
- `RecipeCard`
- `RecipeGrid`
- `FilterDrawer`
- `SearchBar`
- `ServingsScaler`
- `StepTimerList`
- `CookingModeDialog`
- `TagChips`
- `FeaturedCarousel`

### Utility Functions
- `slugify`
- Unit conversion helpers
- Servings scaling

### Seed Data
- At least **8 realistic and varied** recipes:
  - Veg-friendly options
  - Drinks
  - Desserts
  - Indian dishes
  - Pasta

### Testing
- Basic tests for utility functions (optional but encouraged).

---

## Output Format

When generating the implementation:

1. Print a complete **file tree** first.
2. Provide the **full contents of each file** — no `...` placeholders.
3. Ensure commands to run locally are included:

```bash
npm install
npm run dev
```

---

## Suggested File Tree (Reference)

```
foooddd/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Home
│   ├── recipes/
│   │   ├── page.tsx                # Recipe grid
│   │   └── [slug]/
│   │       └── page.tsx            # Recipe detail
│   └── add/
│       └── page.tsx                # Add recipe form
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── RecipeCard.tsx
│   ├── RecipeGrid.tsx
│   ├── FilterDrawer.tsx
│   ├── SearchBar.tsx
│   ├── ServingsScaler.tsx
│   ├── StepTimerList.tsx
│   ├── CookingModeDialog.tsx
│   ├── TagChips.tsx
│   └── FeaturedCarousel.tsx
├── data/
│   └── recipes.json                # Phase 1 storage
├── lib/
│   ├── data.ts                     # Data access layer
│   ├── slugify.ts
│   ├── units.ts                    # Unit conversion
│   └── scaling.ts                  # Servings scaling
├── types/
│   └── recipe.ts                   # TypeScript types
├── public/
│   └── ...
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── package.json
```
