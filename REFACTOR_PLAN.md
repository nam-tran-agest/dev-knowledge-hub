# Architecture Proposal — Dev Knowledge Hub

> [!IMPORTANT]
> **Status**: Approved | **Implementation**: Pending phase-by-phase confirmation

## 1. Problem Statement

The current codebase has grown organically, leading to:
- **Type Fragmentation**: `base.ts` mixes core entities with layout types; domain types in root `types/` instead of colocated in features; empty `types/common/` and `types/entities/` directories
- **Partial Feature Migration**: `features/` exists but only `news/` has internal structure — `landing/`, `media/`, `working/`, `notes/` are empty shells
- **Mixed `lib/` Responsibilities**: Domain logic (`news.ts`, `youtube.ts`, `spotify.ts`) lives alongside infrastructure (supabase, utils); server actions for all domains are in `lib/actions/`
- **Domain Components in Wrong Layer**: `components/` contains domain folders (`news/`, `working/`, `media/`, `notes/`, `sections/`) that should be in features
- **Inconsistent Page Patterns**: Some pages cast `as any`, some inline layout, no standard thin-wrapper convention
- **Constants Sprawl**: `lib/constants/` mixes global and domain-specific config

## 2. Target Architecture

```
src/
├── app/                              # ROUTING ONLY — composition layer
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Thin: imports from features/landing
│   │   ├── working/
│   │   ├── media/{youtube,music,news,...}/
│   │   ├── notes/
│   │   └── bookmarks/
│   ├── api/                          # API routes (auth callbacks, health)
│   └── globals.css
│
├── features/                         # DOMAIN LOGIC — smart layer
│   ├── landing/components/           # HeroSection, ShowcaseSection, etc.
│   ├── news/{components,services,types,constants}/
│   ├── working/{components,services,types,constants}/
│   ├── media/{components/{youtube,music},services,types,constants}/
│   └── notes/{components,services,types,constants}/
│
├── components/                       # PURE UI — dumb layer (zero domain logic)
│   ├── ui/                           # shadcn primitives (Button, Dialog, etc.)
│   ├── layout/                       # Header, Footer, MobileMenu
│   └── common/                       # AppImage, Icon
│
├── lib/                              # INFRASTRUCTURE — pure primitives
│   ├── supabase/                     # Client/server configs
│   ├── actions/                      # ONLY base-crud.ts, auth.ts, search.ts, categories.ts
│   ├── utils/                        # cn(), date formatting, debounce, validation
│   └── i18n.ts
│
├── hooks/                            # Cross-feature shared hooks
├── types/                            # GLOBAL SHARED only: BaseEntity, Tag, Category, layout types
├── config/                           # App-level configuration
├── i18n/ + locales/                  # i18n routing + translation JSON
├── assets/                           # Static assets
└── middleware.ts
```

## 3. Strict Conventions

- **Domain Entity Principle**: Types, constants, and components for a specific feature MUST be colocated in `features/[feature]/`
- **Service Pattern**: Components remain visual. All data fetching, transformation, and Server Actions live in `features/[feature]/services/`
- **Pure Root Types**: `src/types/` is strictly for shared, cross-domain primitives (`BaseEntity`, `Tag`, `Category`, `ApiResponse`) and layout types (`NavbarData`, `FooterData`)
- **Thin Pages**: Route pages are composition wrappers (~30 lines max) that call feature services and render feature components
- **Infrastructure-Only `lib/`**: `lib/` contains ZERO domain-specific logic

## 4. Refactor Roadmap (Safe Order)

### Phase 1: Type Normalization *(lowest risk)* ✅
- [x] Extract layout types from `base.ts` → new `types/layout.ts`
- [x] Delete empty `types/common/` and `types/entities/`
- [x] Normalize `types/index.ts` barrel exports
- [x] Verify: `yarn tsc --noEmit`

### Phase 2: Feature Scaffolding *(no file moves)* ✅
- [x] Create internal structure for empty features: `working/`, `media/`, `notes/`, `landing/`
- [x] Add barrel `index.ts` files in each subdirectory
- [x] Verify: `yarn tsc --noEmit`

### Phase 3: Type Colocation *(move types into features)* ✅
- [x] Move `types/working.ts` → `features/working/types/`
- [x] Move `types/youtube.ts` → `features/media/types/`
- [x] Move `types/note.ts` → `features/notes/types/`
- [x] Move `types/bug.ts` → `features/working/types/`
- [x] Resolve dual-source `types/news.ts` vs `features/news/types/`
- [x] Move `types/section/*.ts` → `features/landing/types/`
- [x] Update all import paths project-wide
- [x] Verify: `yarn tsc --noEmit`

### Phase 4: Logic Consolidation *(move services + components)* ✅
- [x] **4a Services**: Move `lib/news.ts`, `lib/youtube.ts`, `lib/spotify.ts` and domain-specific actions into feature services
- [x] **4b Components**: Move `components/{news,working,media,notes,sections}` into respective features
- [x] **4c Constants**: Move domain-specific constants from `lib/constants/` into features
- [x] Keep infrastructure in `lib/actions/` (base-crud, auth, search, categories)
- [x] Verify: `yarn build`

### Phase 5: Page Decomposition *(final polish)* ✅
- [x] Create shared `PageShell` component for consistent page layout
- [x] Refactor all pages to thin-wrapper pattern (remove `as any` casts)
- [x] Final audit: `lib/` = infrastructure only, `components/` = `ui/` + `layout/` + `common/` only
- [x] Verify: `yarn build` + full page walkthrough
