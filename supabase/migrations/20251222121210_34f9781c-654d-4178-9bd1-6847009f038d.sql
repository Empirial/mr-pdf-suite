-- Add trial_ends_at column to subscriptions table
ALTER TABLE public.subscriptions 
ADD COLUMN trial_ends_at timestamp with time zone;

-- Add comment for clarity
COMMENT ON COLUMN public.subscriptions.trial_ends_at IS 'End date of the 3-day trial period after payment';