/*
# Ensure Models Table is Populated

1. Changes
  - Check if models table is empty and repopulate if needed
  - Use INSERT ... ON CONFLICT to safely add models without duplicates
  - Ensure all required models are present for the calculator to work

2. Models Added
  - GPT-4 (OpenAI) - 8.5g CO₂/1k tokens
  - GPT-3.5 (OpenAI) - 4.2g CO₂/1k tokens  
  - GPT-4o (OpenAI) - 7.8g CO₂/1k tokens
  - Claude Sonnet (Anthropic) - 7.1g CO₂/1k tokens
  - Claude Haiku (Anthropic) - 3.8g CO₂/1k tokens
  - Gemini 1.5 Pro (Google) - 6.8g CO₂/1k tokens
  - Mistral 7B (Mistral AI) - 4.5g CO₂/1k tokens
*/

-- Add a unique constraint on name+vendor to prevent duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'models_name_vendor_unique' 
    AND table_name = 'models'
  ) THEN
    ALTER TABLE models ADD CONSTRAINT models_name_vendor_unique UNIQUE (name, vendor);
  END IF;
END $$;

-- Insert models with ON CONFLICT to handle duplicates safely
INSERT INTO models (name, vendor, grams_per_1k_tokens, is_active) VALUES
  ('GPT-4', 'OpenAI', 8.5, true),
  ('GPT-3.5', 'OpenAI', 4.2, true),
  ('GPT-4o', 'OpenAI', 7.8, true),
  ('Claude Sonnet', 'Anthropic', 7.1, true),
  ('Claude Haiku', 'Anthropic', 3.8, true),
  ('Gemini 1.5 Pro', 'Google', 6.8, true),
  ('Mistral 7B', 'Mistral AI', 4.5, true)
ON CONFLICT (name, vendor) DO UPDATE SET
  grams_per_1k_tokens = EXCLUDED.grams_per_1k_tokens,
  is_active = EXCLUDED.is_active;