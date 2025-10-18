/*
# Final Update of AI Model Emission Factors

1. Changes
  - Ensure all models have the correct realistic CO₂ emission factors
  - GPT-4: 5g CO₂/1k tokens
  - GPT-4o: 3g CO₂/1k tokens  
  - GPT-3.5: 1g CO₂/1k tokens
  - Claude Sonnet: 3g CO₂/1k tokens
  - Claude Haiku: 1g CO₂/1k tokens
  - Gemini 1.5 Pro: 2.5g CO₂/1k tokens (average of 2-3g)
  - Mistral Large: 4g CO₂/1k tokens
  - Mistral 7B: 0.5g CO₂/1k tokens

2. Security
  - Maintain existing RLS policies
  - Update only emission factors, keep other model data intact
*/

-- Update emission factors for all models with the correct realistic values
UPDATE models SET grams_per_1k_tokens = 5.0 WHERE name = 'GPT-4' AND vendor = 'OpenAI';
UPDATE models SET grams_per_1k_tokens = 3.0 WHERE name = 'GPT-4o' AND vendor = 'OpenAI';
UPDATE models SET grams_per_1k_tokens = 1.0 WHERE name = 'GPT-3.5' AND vendor = 'OpenAI';
UPDATE models SET grams_per_1k_tokens = 3.0 WHERE name = 'Claude Sonnet' AND vendor = 'Anthropic';
UPDATE models SET grams_per_1k_tokens = 1.0 WHERE name = 'Claude Haiku' AND vendor = 'Anthropic';
UPDATE models SET grams_per_1k_tokens = 2.5 WHERE name = 'Gemini 1.5 Pro' AND vendor = 'Google';
UPDATE models SET grams_per_1k_tokens = 0.5 WHERE name = 'Mistral 7B' AND vendor = 'Mistral AI';

-- Add or update Mistral Large
INSERT INTO models (name, vendor, grams_per_1k_tokens, is_active) VALUES
  ('Mistral Large', 'Mistral AI', 4.0, true)
ON CONFLICT (name, vendor) DO UPDATE SET
  grams_per_1k_tokens = EXCLUDED.grams_per_1k_tokens,
  is_active = EXCLUDED.is_active;

-- Verify the updates with debug output
DO $$
BEGIN
  RAISE NOTICE 'Final emission factors verification:';
  RAISE NOTICE 'GPT-4: % g/1k tokens', (SELECT grams_per_1k_tokens FROM models WHERE name = 'GPT-4' AND vendor = 'OpenAI');
  RAISE NOTICE 'GPT-4o: % g/1k tokens', (SELECT grams_per_1k_tokens FROM models WHERE name = 'GPT-4o' AND vendor = 'OpenAI');
  RAISE NOTICE 'GPT-3.5: % g/1k tokens', (SELECT grams_per_1k_tokens FROM models WHERE name = 'GPT-3.5' AND vendor = 'OpenAI');
  RAISE NOTICE 'Claude Sonnet: % g/1k tokens', (SELECT grams_per_1k_tokens FROM models WHERE name = 'Claude Sonnet' AND vendor = 'Anthropic');
  RAISE NOTICE 'Claude Haiku: % g/1k tokens', (SELECT grams_per_1k_tokens FROM models WHERE name = 'Claude Haiku' AND vendor = 'Anthropic');
  RAISE NOTICE 'Gemini 1.5 Pro: % g/1k tokens', (SELECT grams_per_1k_tokens FROM models WHERE name = 'Gemini 1.5 Pro' AND vendor = 'Google');
  RAISE NOTICE 'Mistral Large: % g/1k tokens', (SELECT grams_per_1k_tokens FROM models WHERE name = 'Mistral Large' AND vendor = 'Mistral AI');
  RAISE NOTICE 'Mistral 7B: % g/1k tokens', (SELECT grams_per_1k_tokens FROM models WHERE name = 'Mistral 7B' AND vendor = 'Mistral AI');
END $$;