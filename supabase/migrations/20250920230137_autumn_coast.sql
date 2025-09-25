/*
# Update AI Model Emission Factors

1. Changes
  - Update emission factors for all AI models with correct values
  - GPT-4: 12g CO₂/1k tokens
  - GPT-4o: 10g CO₂/1k tokens  
  - GPT-3.5: 7g CO₂/1k tokens
  - Claude Sonnet: 11g CO₂/1k tokens
  - Claude Haiku: 5g CO₂/1k tokens
  - Gemini 1.5 Pro: 10g CO₂/1k tokens
  - Mistral 7B: 4g CO₂/1k tokens

2. Security
  - Maintain existing RLS policies
  - Update only emission factors, keep other model data intact
*/

-- Update emission factors for all models
UPDATE models SET grams_per_1k_tokens = 12.0 WHERE name = 'GPT-4' AND vendor = 'OpenAI';
UPDATE models SET grams_per_1k_tokens = 10.0 WHERE name = 'GPT-4o' AND vendor = 'OpenAI';
UPDATE models SET grams_per_1k_tokens = 7.0 WHERE name = 'GPT-3.5' AND vendor = 'OpenAI';
UPDATE models SET grams_per_1k_tokens = 11.0 WHERE name = 'Claude Sonnet' AND vendor = 'Anthropic';
UPDATE models SET grams_per_1k_tokens = 5.0 WHERE name = 'Claude Haiku' AND vendor = 'Anthropic';
UPDATE models SET grams_per_1k_tokens = 10.0 WHERE name = 'Gemini 1.5 Pro' AND vendor = 'Google';
UPDATE models SET grams_per_1k_tokens = 4.0 WHERE name = 'Mistral 7B' AND vendor = 'Mistral AI';

-- Verify the updates
DO $$
BEGIN
  RAISE NOTICE 'Updated emission factors:';
  RAISE NOTICE 'GPT-4: % g/1k tokens', (SELECT grams_per_1k_tokens FROM models WHERE name = 'GPT-4' AND vendor = 'OpenAI');
  RAISE NOTICE 'GPT-4o: % g/1k tokens', (SELECT grams_per_1k_tokens FROM models WHERE name = 'GPT-4o' AND vendor = 'OpenAI');
  RAISE NOTICE 'GPT-3.5: % g/1k tokens', (SELECT grams_per_1k_tokens FROM models WHERE name = 'GPT-3.5' AND vendor = 'OpenAI');
  RAISE NOTICE 'Claude Sonnet: % g/1k tokens', (SELECT grams_per_1k_tokens FROM models WHERE name = 'Claude Sonnet' AND vendor = 'Anthropic');
  RAISE NOTICE 'Claude Haiku: % g/1k tokens', (SELECT grams_per_1k_tokens FROM models WHERE name = 'Claude Haiku' AND vendor = 'Anthropic');
  RAISE NOTICE 'Gemini 1.5 Pro: % g/1k tokens', (SELECT grams_per_1k_tokens FROM models WHERE name = 'Gemini 1.5 Pro' AND vendor = 'Google');
  RAISE NOTICE 'Mistral 7B: % g/1k tokens', (SELECT grams_per_1k_tokens FROM models WHERE name = 'Mistral 7B' AND vendor = 'Mistral AI');
END $$;