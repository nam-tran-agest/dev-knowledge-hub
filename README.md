# Dev Knowledge Hub 🚀

A modern, full-featured personal knowledge management system for developers. Built with Next.js 16, React 19, TypeScript, Supabase, and Tailwind CSS.

## ✨ Features

### 📝 **Notes Management**
- Rich text editor powered by BlockNote
- Organize notes with categories and tags
- Markdown support with syntax highlighting
- Full-text search across all notes
- Category and tag filtering

### 💻 **Code Snippets**
- Save code snippets and AI prompts
- Syntax highlighting for multiple languages
- Copy to clipboard functionality
- Tag-based organization
- Search by language or content

### ✅ **Task Management**
- Kanban board with drag-and-drop
- Three columns: To Do, Doing, Done
- Task deadlines and descriptions
- Link tasks to notes and snippets

### 🐛 **Bug Tracking**
- Log bugs with error messages and stack traces
- Document root cause and solutions
- Mark bugs as resolved
- Full-text search across bug reports
- Tag-based categorization

### 🔍 **Global Search**
- Keyboard shortcut: `Cmd/Ctrl + K`
- Search across all content types
- Real-time results with debouncing
- Keyboard navigation support

### 🔐 **Authentication**
- Magic link authentication via Supabase
- Secure session management
- Row-level security (RLS)
- Protected routes

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Rich Text**: BlockNote
- **Code Highlighting**: React Syntax Highlighter
- **Drag & Drop**: dnd-kit
- **Date Handling**: date-fns

## 📦 Getting Started

### Prerequisites

- Node.js 20+ 
- npm/yarn/pnpm
- Supabase account

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd dev-knowledge-hub
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings** → **API**
3. Copy your **Project URL** and **anon public** key

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Set up the database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run it in the SQL Editor

This will create:
- All necessary tables (notes, snippets, tasks, bugs, categories, tags)
- Indexes for optimal performance
- Full-text search triggers
- Row Level Security (RLS) policies

### 6. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Sign in

1. Navigate to the login page
2. Enter your email
3. Check your email for the magic link
4. Click the link to sign in

## 📁 Project Structure

```
dev-knowledge-hub/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── bugs/              # Bug tracking pages
│   │   ├── notes/             # Notes pages
│   │   ├── snippets/          # Snippets pages
│   │   ├── tasks/             # Task management page
│   │   ├── login/             # Authentication page
│   │   ├── callback/          # OAuth callback
│   │   ├── error.tsx          # Global error page
│   │   ├── not-found.tsx      # 404 page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Dashboard
│   ├── components/            # React components
│   │   ├── bugs/             # Bug components
│   │   ├── notes/            # Notes components
│   │   ├── snippets/         # Snippet components
│   │   ├── tasks/            # Task components
│   │   ├── search/           # Search modal
│   │   ├── layout/           # Layout components
│   │   ├── shared/           # Shared/common components
│   │   └── ui/               # UI primitives (Radix UI)
│   ├── lib/
│   │   ├── actions/          # Server actions
│   │   ├── constants/        # Constants & configs
│   │   ├── supabase/         # Supabase clients
│   │   └── utils/            # Utility functions
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript types
│   └── middleware.ts         # Next.js middleware
├── supabase/
│   └── migrations/           # Database migrations
├── public/                   # Static assets
└── ...config files

```

## 🎨 Key Features Details

### Rich Text Editor (Notes)

The notes feature uses BlockNote for a modern editing experience:
- WYSIWYG editing
- Markdown shortcuts
- Block-based content
- Drag and drop blocks

### Search Functionality

Press `Cmd/Ctrl + K` anywhere to open the global search:
- Searches across notes, snippets, tasks, and bugs
- Full-text search using PostgreSQL
- Real-time results
- Keyboard navigation (↑/↓ to navigate, Enter to select)

### Task Board

Kanban-style task management:
- Drag tasks between columns
- Automatically saves position
- Link tasks to relevant notes/snippets

### Database Schema

The app uses a comprehensive PostgreSQL schema with:
- User-scoped data (RLS policies)
- Many-to-many relationships for tags
- Full-text search vectors
- Automatic timestamps
- Cascading deletes

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Database Considerations

- Ensure your Supabase project is on a paid plan for production use
- Enable connection pooling for better performance
- Monitor query performance in Supabase dashboard

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔒 Security

- All routes protected by Supabase Auth middleware
- Row Level Security (RLS) enabled on all tables
- Environment variables for sensitive data
- HTTPS required in production

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Radix UI](https://www.radix-ui.com/)
- [BlockNote](https://www.blocknotejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📧 Support

For issues and questions, please [open an issue](https://github.com/your-username/dev-knowledge-hub/issues) on GitHub.
