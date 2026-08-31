# DEV KNOWLEDGE HUB - ARCHITECTURE & AGENT GUIDE

> **Mục đích**: Tài liệu tóm tắt toàn bộ kiến trúc, cấu trúc thư mục, quy ước kỹ thuật, hệ thống styling và luồng nghiệp vụ của dự án `dev-knowledge-hub`. Giúp AI Agents / Developers nhanh chóng nắm bắt ngữ cảnh mà không cần quét lại toàn bộ codebase.

---

## 1. Tech Stack & Core Libraries

| Layer | Công nghệ / Thư viện | Ghi chú |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.1.6 (Turbopack, App Router) | Hỗ trợ SSR, Static Generation, Server Actions |
| **UI Runtime** | React 19.2.4 | React 19 Hooks & Server Components |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/postcss`) | Sử dụng `@theme inline` trong `globals.css` |
| **Primitives** | Radix UI + `class-variance-authority` (CVA) | Headless UI accessibility & type-safe variants |
| **Motion & FX** | Motion (`motion`), Swiper, tsparticles | Hiệu ứng Cyberpunk UI/UX, particle starfield |
| **Database & Auth** | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) | PostgreSQL, Row Level Security, Auth Session |
| **Internationalization** | `next-intl` (v4.8.2) | Hỗ trợ đa ngôn ngữ (`vi`, `en`) với prefix route `/[locale]` |
| **Icons & Types** | `lucide-react`, TypeScript 5 (Strict Mode) | **Tuyệt đối không dùng `any`** (`RULE[user_global]`) |
| **Deploy Target** | Cloudflare Workers / Pages (`@opennextjs/cloudflare`) | Cấu hình qua `wrangler` |

---

## 2. Cấu trúc Thư mục Dự án (`src/`)

```text
src/
├── app/                              # Next.js App Router
│   ├── [locale]/                     # Prefix đa ngôn ngữ (vi, en)
│   │   ├── (auth)/                   # Login, Signup, Forgot Password, Reset Password
│   │   ├── media/                    # Media Center (YouTube, Spotify Music, News)
│   │   │   ├── music/                # Spotify Tracks & Playlists
│   │   │   ├── news/                 # RSS News Grid & Article Reader
│   │   │   └── youtube/              # YouTube Playlists & Video Player
│   │   ├── mh-wilds/                 # Monster Hunter Wilds Database Vault
│   │   ├── planner/                  # Daily Timeline & Schedule Planner
│   │   ├── working/                  # Project Management & Kanban Workspace
│   │   ├── error.tsx                 # Cyberpunk System Error Page
│   │   ├── not-found.tsx             # Cyberpunk 404 Node Not Found Page
│   │   └── page.tsx                  # Home / Landing Page
│   ├── api/                          # Next.js Route Handlers (Auth callbacks, Health check)
│   ├── globals.css                   # Tailwind v4 Theme, CSS Variables & Cyberpunk Classes
│   └── layout.tsx                    # Root Layout
├── components/                       # UI Components dùng chung
│   ├── layout/                       # Header, Footer, MainNav, MobileMenu, UserMenu
│   ├── shared/                       # StarryBackground, GlitchText, StatusPills, ParticleHUD
│   └── ui/                           # Radix UI Wrappers (Button, Card, Dialog, Select, Tabs, etc.)
│       └── cyber/                    # TacticalActionButton, Cyber re-exports
├── config/                           # Application Configurations & Metadata
├── data/                             # Static JSON Caches (MH Wilds: monsters, weapons, armor, skills...)
├── features/                         # Feature-Driven Modules (Logic + Components chuyên biệt)
│   ├── auth/                         # LoginContainer, SignupContainer, Auth Hooks & Supabase Auth
│   ├── bookmarks/                    # Bookmarks logic
│   ├── landing/                      # HeroSection, ModulesGrid, TelemetryCards
│   ├── media/                        # YouTube & Spotify stores, hooks, players, modals
│   ├── mh-wilds/                     # MH Wilds components, types, constants, filter controls
│   ├── news/                         # NewsCard, NewsGrid, RSS parser, FeaturedArticle
│   ├── planner/                      # TodayView, TimeTimeline, TaskQueue, Planner stores
│   └── working/                      # ProjectWorkspace, KanbanView, TaskList, TaskItem
├── hooks/                            # Custom React Hooks (Theme, LocalStorage, Telemetry)
├── i18n/                             # next-intl configuration (routing.ts, request.ts, navigation.ts)
├── lib/                              # Core Utilities & Single Sources of Truth
│   ├── constants/                    # navigation.ts, styles.ts (TYPOGRAPHY, COLORS, MODULE_THEMES)
│   ├── supabase/                     # client.ts, server.ts, middleware.ts
│   └── utils.ts                      # cn() helper (clsx + tailwind-merge)
├── locales/                          # Translation Dictionaries (en.json, vi.json)
├── middleware.ts                     # Next-intl + Supabase Auth Session proxy middleware
└── types/                            # Global TypeScript Declarations
```

---

## 3. Hệ thống Thiết kế & Styling Tokens (Cyberpunk FUI)

Tất cả màu sắc và hiệu ứng giao diện đều tuân theo chuẩn **Single Source of Truth** trong `src/app/globals.css` và `src/lib/constants/styles.ts`:

### Semantic Surface Tokens:
- `bg-background`: `#04060f` (Nền chính của toàn ứng dụng)
- `bg-surface`: `#050714` (Nền panel, card, dialog, dropdown, auth box)
- `bg-surface-deep`: `#030712` (Nền input, textarea, inner control boxes)
- `bg-surface-elevated`: `#0a0d1a` (Nền popover nổi bật, hover state)

### Shared Utility Classes (DRY):
- `.cyber-clip`: Bo góc vát Cyberpunk kích thước tiêu chuẩn.
- `.cyber-clip-lg`: Bo góc vát lớn cho Modal, Dialog, và Hero Cards.
- `.cyber-clip-button`: Bo góc vát cho button và tag nhỏ.
- `.cyber-panel`: Khung giao diện kính mờ Cyberpunk chuẩn (`bg-surface/90 border border-primary/30 backdrop-blur-2xl cyber-clip shadow-2xl`).
- `.cyber-panel-lg`: Khung lớn cho Card/Modal trung tâm.
- `.cyber-tag-header`: Tag HUD định danh ở góc trên bên phải của panels (`// SYS_MODULE`).

### Parameterized Effects:
- `.cyber-brackets` & `.cyber-brackets-[pink|red|yellow|amber|indigo|emerald]`: Tự động áp dụng corner brackets với biến `--bracket-color`.
- `.hazard-stripes-[cyan|pink|amber|emerald]`: Hiệu ứng sọc cảnh báo nguy hiểm với `--stripe-color`.

---

## 4. Các Feature Modules Chính

### 1. Auth Module (`src/features/auth/`)
- Tích hợp Supabase Auth (Email/Password, Session Cookies SSR).
- Form validation, error handling, giao diện Cyberpunk Terminal Auth Gateway.

### 2. Daily Planner (`src/features/planner/`)
- Quản lý timeline thời gian trong ngày (`TimeTimeline`).
- Drag-and-drop phân bổ công việc vào từng khung giờ (`@hello-pangea/dnd`).
- Task Queue Backlog, tự động đồng bộ Cloud / LocalStorage.

### 3. Working Hub (`src/features/working/`)
- Không gian làm việc quản lý Project & Task.
- Hỗ trợ chuyển đổi linh hoạt giữa chế độ **List View** và **Kanban Board** (Todo, Doing, Done).

### 4. Media Center (`src/features/media/`)
- **YouTube Hub**: Lưu trữ playlist, phát video trong pop-up HUD modal, tự động lưu mốc thời gian xem (`saved_time`), hỗ trợ tìm kiếm và tạo playlist tùy biến.
- **Spotify Hub**: Tích hợp danh sách Top Tracks, Featured Playlists qua Spotify Web API.
- **News Hub**: Đọc tin tức công nghệ đa danh mục từ RSS feed, phân trang 3x3 HUD, lọc bài viết mới nhất / phổ biến.

### 5. MH Wilds Vault (`src/features/mh-wilds/`)
- Cơ sở dữ liệu Monster Hunter Wilds offline cache (`data/`): Quái vật, Vũ khí, Giáp, Kỹ năng, Vật phẩm, Cây nâng cấp vũ khí (Crafting Branches).
- Bộ lọc nâng cao: Lọc theo Rarity, Element, Skill Kind, Weapon Type.
- Script tự động crawl & cập nhật: `scripts/fetch-mhwilds-data.mjs`.

---

## 5. Quy tắc Phát triển Bắt buộc (`RULE[user_global]`)

1. **Khám phá và Lên Kế hoạch Chiến lược**:
   - Trước khi sửa đổi hoặc thêm tính năng phức tạp, luôn kiểm tra kiến trúc hiện tại và tạo kế hoạch trong `implementation_plan.md`.
2. **Debug Closed-Loop (Khép kín)**:
   - Tự động chạy lệnh kiểm tra, kiểm tra logs, xác thực kết quả (chạy `npm run lint`, `npm run build`) mà không yêu cầu người dùng phải copy-paste log thủ công.
3. **Tuyệt đối không dùng `any` (Zero `any`)**:
   - Mọi biến, props, state, hàm đều phải được định kiểu TypeScript rõ ràng (`unknown`, generics, hoặc explicit interfaces).
4. **Giữ gìn vệ sinh Git**:
   - Thư mục cache Salesforce `.sf/` và `.sfdx/` đã được chặn trong `.gitignore`. Không commit các file tạm hoặc cache metadata ngoài ý muốn.

---

## 6. Lệnh Vận hành & Scripts Thường Dùng

```bash
# 1. Khởi chạy môi trường phát triển
yarn dev

# 2. Kiểm tra toàn diện cả TypeScript (tsc) và ESLint (lint)
yarn check

# 3. Chỉ kiểm tra kiểu TypeScript
yarn type-check

# 4. Chỉ kiểm tra ESLint
yarn lint

# 5. Build production (Tự động chạy script cập nhật MH Wilds data trước khi build Next.js)
yarn build

# 6. Preview OpenNext Cloudflare build
yarn preview
```
