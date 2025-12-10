# Todo List App

A modern, full-stack todo list application built with Next.js, TypeScript, and Supabase, deployable on Vercel.

## Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Add descriptions and due dates
- ✅ User authentication with Supabase
- ✅ Real-time data synchronization
- ✅ Responsive design with Tailwind CSS
- ✅ Type-safe with TypeScript

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: Vercel
- **Database**: PostgreSQL (via Supabase)

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier available)
- Vercel account (optional, for deployment)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd study-schedule-to-do-list
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the following SQL to create the todos table:

```sql
-- Create todos table
CREATE TABLE public.todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own todos"
  ON public.todos
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos"
  ON public.todos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
  ON public.todos
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos"
  ON public.todos
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_todos_user_id ON public.todos(user_id);
CREATE INDEX idx_todos_created_at ON public.todos(created_at);
```

3. Get your Supabase credentials:
   - Go to Settings → API
   - Copy your `Project URL` and `anon public key`

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page with todo list
│   └── auth/
│       └── page.tsx       # Authentication page
├── components/             # React components
│   ├── TodoItem.tsx       # Individual todo item
│   └── TodoForm.tsx       # Todo create/edit form
├── lib/                    # Utility functions
│   ├── supabaseClient.ts  # Supabase client setup
│   └── todoAPI.ts         # Todo API functions
├── types/                  # TypeScript types
│   └── index.ts           # Type definitions
└── styles/                 # Global styles
    └── globals.css        # Tailwind styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## API Functions

The `todoAPI` module provides:

- `getTodos(userId)` - Fetch all todos for a user
- `createTodo(userId, input)` - Create a new todo
- `updateTodo(todoId, input)` - Update a todo
- `deleteTodo(todoId)` - Delete a todo
- `toggleTodo(todoId, completed)` - Toggle todo completion status

## Authentication

- Users can sign up with email and password
- Email verification is required (configured in Supabase)
- Sessions are managed by Supabase Auth
- User data is secured with Row-Level Security (RLS)

## Database Schema

### Todos Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | User reference |
| title | VARCHAR(255) | Todo title (required) |
| description | TEXT | Optional description |
| completed | BOOLEAN | Completion status |
| due_date | TIMESTAMP | Optional due date |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Update timestamp |

## Security Features

- Row-Level Security (RLS) on all tables
- User authentication required
- CSRF protection via Next.js
- Environment variables for sensitive data
- Type-safe API calls

## Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is not defined"

Make sure your `.env.local` file is in the root directory with correct values.

### "Authentication failed"

Check that:
- Your Supabase project is active
- Email confirmation is enabled in Supabase Auth settings
- Your anon key is correct

### Database connection issues

- Verify RLS policies are correctly configured
- Check user_id matches auth.uid()
- Ensure todos table exists with correct schema

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
