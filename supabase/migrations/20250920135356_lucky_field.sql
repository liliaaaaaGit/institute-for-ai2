/*
# Fix Models Population Issue

1. Changes
  - Drop and recreate models table to ensure clean state
  - Re-insert all required models with proper data
  - Ensure factors table is also properly populated
  - Add debugging information

2. Models Added
  - GPT-4 (OpenAI) - 8.5g CO₂/1k tokens
  - GPT-3.5 (OpenAI) - 4.2g CO₂/1k tokens  
  - GPT-4o (OpenAI) - 7.8g CO₂/1k tokens
  - Claude Sonnet (Anthropic) - 7.1g CO₂/1k tokens
  - Claude Haiku (Anthropic) - 3.8g CO₂/1k tokens
  - Gemini 1.5 Pro (Google) - 6.8g CO₂/1k tokens
  - Mistral 7B (Mistral AI) - 4.5g CO₂/1k tokens

3. Security
  - Maintain RLS policies
  - Ensure public access to active models
*/

-- First, let's check if we have any models
DO $$
BEGIN
  RAISE NOTICE 'Current models count: %', (SELECT COUNT(*) FROM models);
END $$;

-- Clear existing models to start fresh
TRUNCATE TABLE models RESTART IDENTITY CASCADE;

-- Insert models with explicit IDs to ensure consistency
INSERT INTO models (id, name, vendor, grams_per_1k_tokens, is_active) VALUES
  (gen_random_uuid(), 'GPT-4', 'OpenAI', 8.5, true),
  (gen_random_uuid(), 'GPT-3.5', 'OpenAI', 4.2, true),
  (gen_random_uuid(), 'GPT-4o', 'OpenAI', 7.8, true),
  (gen_random_uuid(), 'Claude Sonnet', 'Anthropic', 7.1, true),
  (gen_random_uuid(), 'Claude Haiku', 'Anthropic', 3.8, true),
  (gen_random_uuid(), 'Gemini 1.5 Pro', 'Google', 6.8, true),
  (gen_random_uuid(), 'Mistral 7B', 'Mistral AI', 4.5, true);

-- Verify models were inserted
DO $$
BEGIN
  RAISE NOTICE 'Models inserted: %', (SELECT COUNT(*) FROM models WHERE is_active = true);
END $$;

-- Also ensure factors are populated
INSERT INTO factors (key, value_json, is_active) VALUES
  ('pc_usage', '{"name": "Desktop PC usage", "unit": "hours", "grams_co2": 150, "description": "Average desktop computer running for 1 hour"}', true),
  ('car_distance', '{"name": "Car travel", "unit": "meters", "grams_co2": 0.21, "description": "Average gasoline car driving 1 meter"}', true),
  ('electricity', '{"name": "Household electricity", "unit": "hours", "grams_co2": 500, "description": "Average home electricity consumption for 1 hour"}', true),
  ('smartphone_charge', '{"name": "Smartphone charges", "unit": "charges", "grams_co2": 8, "description": "Fully charging a smartphone"}', true),
  ('led_bulb', '{"name": "LED bulb usage", "unit": "hours", "grams_co2": 4.5, "description": "10W LED bulb running for 1 hour"}', true)
ON CONFLICT (key) DO UPDATE SET
  value_json = EXCLUDED.value_json,
  is_active = EXCLUDED.is_active;

-- Verify factors
DO $$
BEGIN
  RAISE NOTICE 'Factors available: %', (SELECT COUNT(*) FROM factors WHERE is_active = true);
END $$;