# Contributing to Dev Knowledge Hub

Thank you for your interest in contributing to Dev Knowledge Hub! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/dev-knowledge-hub.git
   cd dev-knowledge-hub
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials
5. **Run the development server**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
   
   Branch naming conventions:
   - `feature/` for new features
   - `fix/` for bug fixes
   - `docs/` for documentation changes
   - `refactor/` for code refactoring
   - `test/` for adding tests

2. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**
   - Ensure the app runs without errors
   - Test all affected features
   - Check responsive design

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```
   
   Commit message format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Wait for review

## 📝 Code Style Guidelines

### TypeScript/React
- Use TypeScript for all new code
- Use functional components with hooks
- Prefer `const` over `let`
- Use meaningful variable and function names
- Add types for all function parameters and return values

### File Structure
```
src/
├── app/              # Next.js pages
├── components/       # React components
│   ├── [feature]/   # Feature-specific components
│   ├── shared/      # Shared components
│   └── ui/          # UI primitives
├── lib/
│   ├── actions/     # Server actions
│   ├── constants/   # Constants
│   ├── supabase/    # Supabase clients
│   └── utils/       # Utilities
├── hooks/           # Custom hooks
└── types/           # TypeScript types
```

### Component Guidelines
- One component per file
- Export component at the bottom
- Props should be typed with an interface
- Use meaningful component names

Example:
```tsx
interface MyComponentProps {
  title: string
  onAction: () => void
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Click me</button>
    </div>
  )
}
```

### Styling
- Use Tailwind CSS utility classes
- Follow the design system (see `src/lib/constants/styles.ts`)
- Use the `cn()` utility for conditional classes
- Keep inline styles minimal

### Server Actions
- Use `'use server'` directive
- Handle errors gracefully
- Call `revalidatePath()` after mutations
- Return typed data

Example:
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createItem(title: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('items')
    .insert({ title })
    .select()
    .single()
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/items')
  return data
}
```

## 🧪 Testing

Before submitting a PR:
- [ ] Test your changes locally
- [ ] Check for TypeScript errors: `npm run build`
- [ ] Run the linter: `npm run lint`
- [ ] Test in different browsers
- [ ] Test responsive design (mobile, tablet, desktop)

## 📦 Pull Request Guidelines

### PR Checklist
- [ ] Code follows the project's style guidelines
- [ ] Self-review of the code
- [ ] Comments added for complex logic
- [ ] Documentation updated if needed
- [ ] No console errors or warnings
- [ ] Tested locally

### PR Description Template
```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Steps to test the changes:
1. Step 1
2. Step 2

## Screenshots (if applicable)
Add screenshots to show the changes

## Related Issues
Fixes #(issue number)
```

## 🐛 Reporting Bugs

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser and OS information

## 💡 Feature Requests

When requesting features:
- Explain the use case
- Describe the desired behavior
- Consider alternatives
- Be open to discussion

## 🎯 Areas to Contribute

Looking for ideas? Consider:
- [ ] Adding tests
- [ ] Improving documentation
- [ ] Enhancing UI/UX
- [ ] Performance optimizations
- [ ] Accessibility improvements
- [ ] Bug fixes
- [ ] New features from the roadmap

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

## 📞 Questions?

- Open an issue for discussion
- Check existing issues and PRs
- Review the documentation

Thank you for contributing! 🎉
