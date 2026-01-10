# Style Management Guide

## 📋 Tổng quan
Project sử dụng **quản lý CSS tập trung** để đảm bảo code tái sử dụng, gọn gàng và dễ maintain.

## 🎨 Kiến trúc Style

### 1. Global CSS Classes
**File:** [`src/app/globals.css`](src/app/globals.css)

Định nghĩa các **reusable utility classes** dùng cho toàn bộ app:

```css
/* Form Patterns */
.form-container { @apply w-full max-w-4xl mx-auto px-2 sm:px-0; }
.form-section { @apply space-y-6 md:space-y-8; }
.form-field { @apply space-y-2; }
.form-grid-2 { @apply grid grid-cols-1 md:grid-cols-2 gap-6; }

/* Component Patterns */
.tag-container { @apply flex flex-wrap gap-2 p-4 rounded-lg ...; }
.editor-responsive { @apply border rounded-md min-h-[300px] md:min-h-[400px] ...; }
.loading-spinner { @apply h-4 w-4 rounded-full border-2 animate-spin; }

/* Layout Helpers */
.flex-center { @apply flex items-center; }
.flex-between { @apply flex items-center justify-between; }
.flex-start { @apply flex items-start; }
```

**Khi nào dùng:**
- Pattern lặp lại nhiều lần (≥3 components)
- Cần kết hợp nhiều Tailwind classes
- Cần responsive behavior phức tạp

### 2. Style Constants
**File:** [`src/lib/constants/styles.ts`](src/lib/constants/styles.ts)

Quản lý các **values dưới dạng TypeScript constants**:

```typescript
// Spacing System
export const SPACING = {
  xs: 'space-y-2',
  sm: 'space-y-4',
  md: 'space-y-6',
  lg: 'space-y-8',
  gapMd: 'gap-4',
} as const

// Padding System
export const PADDING = {
  responsive: 'px-2 sm:px-0',
  responsiveMd: 'p-4 md:p-6',
} as const

// Layout Patterns
export const LAYOUT = {
  form: 'w-full max-w-4xl mx-auto',
  flexRow: 'flex items-center',
  grid2Col: 'grid grid-cols-1 md:grid-cols-2',
} as const
```

**Khi nào dùng:**
- Cần type safety (TypeScript autocomplete)
- Values có thể thay đổi theo config
- Cần import vào component logic

### 3. Adobe CC Theme Classes
**File:** [`src/lib/constants/styles.ts`](src/lib/constants/styles.ts)

```typescript
export const CC_STYLES = {
  sidebar: 'cc-sidebar',
  card: 'cc-card',
  btnPrimary: 'cc-btn-primary',
  input: 'cc-input',
} as const
```

Các classes này được define trong [`globals.css`](src/app/globals.css) với glass morphism effects.

## 📝 Usage Guidelines

### ✅ Đúng cách

```tsx
// Import constants
import { SPACING } from '@/lib/constants/styles'

export function MyForm() {
  return (
    <form className="form-container form-section">
      <div className="form-field">
        <Label>Title</Label>
        <Input />
      </div>
      
      <CardContent className={SPACING.md}>
        {/* content */}
      </CardContent>
      
      <div className="button-group">
        <Button>Submit</Button>
      </div>
    </form>
  )
}
```

### ❌ Sai cách

```tsx
// ❌ Hardcode classes lặp lại
<form className="space-y-6 md:space-y-8 w-full max-w-4xl mx-auto px-2 sm:px-0">
  <div className="space-y-2">
    <Label>Title</Label>
    <Input />
  </div>
  
  <CardContent className="space-y-6">
    {/* content */}
  </CardContent>
  
  <div className="flex justify-end gap-4">
    <Button>Submit</Button>
  </div>
</form>
```

## 🔄 Quy trình thêm styles mới

### 1. Kiểm tra xem đã tồn tại chưa
- Tìm trong [`globals.css`](src/app/globals.css)
- Tìm trong [`styles.ts`](src/lib/constants/styles.ts)

### 2. Quyết định vị trí
**Thêm vào `globals.css` nếu:**
- Là pattern phức tạp (nhiều classes)
- Cần animations/transitions
- Cần pseudo-selectors (`:hover`, `::before`)

**Thêm vào `styles.ts` nếu:**
- Là simple value (spacing, colors)
- Cần TypeScript type safety
- Có thể thay đổi theo config

### 3. Đặt tên theo convention
```typescript
// Component-specific
.note-form-container
.task-board-column

// Generic reusable
.form-field
.button-group
.flex-center
```

## 📦 Components đã refactor

| Component | Before | After | File |
|-----------|--------|-------|------|
| `NoteForm` | Hardcoded classes | Centralized styles | [note-form.tsx](src/components/notes/note-form.tsx) |
| `SnippetForm` | Inline classes | Global + Constants | [snippet-form.tsx](src/components/snippets/snippet-form.tsx) |
| `BugForm` | Duplicated spacing | Reusable patterns | [bug-form.tsx](src/components/bugs/bug-form.tsx) |
| `NoteDetail` | Mixed approach | Standardized | [note-detail.tsx](src/components/notes/note-detail.tsx) |

## 🎯 Benefits

1. **DRY Principle**: Không lặp lại classes
2. **Maintainability**: Thay đổi 1 chỗ → áp dụng toàn bộ
3. **Type Safety**: TypeScript autocomplete cho constants
4. **Consistency**: UI đồng nhất across app
5. **Performance**: Reuse Tailwind classes → smaller bundle

## 🚀 Next Steps

- [ ] Refactor card components (snippet-card, bug-card, note-card)
- [ ] Standardize dialog components
- [ ] Create animation constants
- [ ] Add dark/light theme variants to constants
