# Supabase Setup Guide

## Creating a Supabase Project

1. Visit [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up or log in
4. Create a new project:
   - Organization: Create a new organization or use existing
   - Project name: `study-schedule-todo`
   - Database password: Strong password (save it!)
   - Region: Choose closest to your location
5. Wait for the project to initialize (2-3 minutes)

## Setting Up the Database

### 1. Create the Todos Table

Navigate to the SQL Editor in your Supabase dashboard and run:

```sql
-- Create the todos table
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

-- Enable Row Level Security
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Policy 1: Users can view their own todos
CREATE POLICY "Users can view their own todos"
  ON public.todos
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own todos
CREATE POLICY "Users can insert their own todos"
  ON public.todos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own todos
CREATE POLICY "Users can update their own todos"
  ON public.todos
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy 4: Users can delete their own todos
CREATE POLICY "Users can delete their own todos"
  ON public.todos
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_todos_user_id ON public.todos(user_id);
CREATE INDEX idx_todos_created_at ON public.todos(created_at);
```

### 2. Enable Authentication

1. Go to **Authentication** in the sidebar
2. Click **Providers**
3. Enable **Email** authentication (should be enabled by default)
4. Go to **Email Templates**
5. Verify the confirmation email template is set up

### 3. Get Your API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

## Environment Setup

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Verification

To verify the setup:

1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:3000/auth`
3. Sign up with a test email
4. Check the Supabase Auth dashboard to see the new user
5. Check the todos table is empty (you haven't created any yet)

## Row Level Security (RLS) Explained

The RLS policies ensure:

- **SELECT**: Users can only see their own todos
- **INSERT**: Users can only insert todos for themselves
- **UPDATE**: Users can only update their own todos
- **DELETE**: Users can only delete their own todos

This is enforced at the database level, making it secure even if the client-side code is compromised.

## Troubleshooting

### "Invalid API Key"
- Double-check you're using the `anon` key, not the `service_role` key
- Verify there are no extra spaces or characters

### "Permission denied"
- Ensure RLS policies are correctly created
- Check that the user_id matches auth.uid()
- Verify email is confirmed in Supabase auth

### "Table does not exist"
- Run the SQL creation script again
- Check the table appears in the Tables view in Supabase dashboard

## Database Backups

Supabase provides automatic daily backups on paid plans. For free tier:
- Use pg_dump to export data manually
- Export as CSV from the Supabase dashboard

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
