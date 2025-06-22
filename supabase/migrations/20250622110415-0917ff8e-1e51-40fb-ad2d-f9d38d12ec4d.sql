
-- First, let's remove the problematic foreign key constraint
ALTER TABLE public.cash_sessions DROP CONSTRAINT IF EXISTS cash_sessions_user_id_fkey;

-- Check and clean up any orphaned records that don't have valid user references
-- We'll set these to NULL first to avoid constraint violations
UPDATE public.cash_sessions 
SET user_id = NULL 
WHERE user_id IS NOT NULL 
AND user_id NOT IN (SELECT id FROM auth.users);

-- Now we can safely add the correct foreign key constraint
-- Note: We're referencing auth.users, not the public.users table
ALTER TABLE public.cash_sessions 
ADD CONSTRAINT cash_sessions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Remove the default value since it should be set explicitly by the application
ALTER TABLE public.cash_sessions 
ALTER COLUMN user_id DROP DEFAULT;

-- Update RLS policies to be more specific
DROP POLICY IF EXISTS "Users can view cash sessions" ON public.cash_sessions;
DROP POLICY IF EXISTS "Users can create cash sessions" ON public.cash_sessions;
DROP POLICY IF EXISTS "Users can update cash sessions" ON public.cash_sessions;

-- Policy for viewing own cash sessions
CREATE POLICY "Users can view own cash sessions" ON public.cash_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for creating own cash sessions
CREATE POLICY "Users can create own cash sessions" ON public.cash_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for updating own cash sessions
CREATE POLICY "Users can update own cash sessions" ON public.cash_sessions
  FOR UPDATE USING (auth.uid() = user_id);
