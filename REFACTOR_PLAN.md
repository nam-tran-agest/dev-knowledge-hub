# Roadmap: Modular Feature-Based Architecture Refactor

This document outlines the systematic plan to transition the **Dev Knowledge Hub** codebase into a modular, scalable architecture. 

> [!IMPORTANT]
> **Constraint**: This document serves as a record of the approved plan. No implementation (code edits) should be performed without explicit phase-by-phase confirmation.

## 1. Problem Statement
The current codebase has grown organically, leading to:
- **Fragmented Domain logic**: News, Working, and Media logic scattered across `lib/`, `components/`, and `types/`.
- **Logic Ambiguity**: Mixed responsibilities between infrastructure (Supabase) and business logic (RSS parsing).
- **Type Redundancy**: Duplicated section types and global pollution of feature-specific interfaces.

## 2. Target Architecture (FSD-lite)

```text
src/
├── app/                      # Routing & Layout composition (Composition Layer)
├── features/                 # Modular Domain logic (Smart Layer)
│   ├── news/                 # News domain (Components, Services, Types, Constants)
│   ├── working/              # Project/Task management
│   └── media/                # YouTube, Spotify integration
├── components/               # Pure UI Primitives (Dumb Layer)
│   └── ui/                   # shadcn-like base components
├── lib/                      # Infrastructure & Pure Primitives
│   ├── supabase/             # Client/Server configs
│   └── utils/                # Pure formatting/helper functions
├── services/                 # Cross-feature global services
└── types/                    # Shared Global Entities (BaseEntity, API types)
```

## 3. Strict Conventions
- **Domain Entitity Principle**: Types, constants, and components that belong to a specific feature **must** be colocated in `src/features/[feature]`.
- **The Service Pattern**: Components should remain visual. All data fetching, transformation, and Server Actions live in `features/[feature]/services/`.
- **Pure Proterozoic Types**: Root `src/types/` is reserved strictly for shared, cross-domain primitives.

## 4. Refactor Roadmap (Leaf-to-Root Strategy)

### Phase 1: Type Normalization
- Consolidate `src/types/section` and `src/types/sections`.
- Standardize root entities (move/rename `base.ts` to `entities.ts` after confirmation).
- Clean up unused type definitions.

### Phase 2: Feature Isolation
- Establish `src/features/` directory structure.
- Move domain-specific folders from `src/components/` (e.g., `news`, `working`, `media`) to `src/features/`.
- Colocate domain types and configurations.

### Phase 3: Logic Consolidation
- Extract business logic from `src/lib/` (e.g., `news.ts`, `youtube.ts`).
- Move domain-specific Server Actions from `src/lib/actions/` into the feature service layer.

### Phase 4: Page Decomposition
- Refactor route pages (`src/app/[locale]/...`) to use feature composition.
- Final audit of `src/lib/` to ensure it only contains infrastructure.

---
*Status: Approved | Implementation: Pending*
