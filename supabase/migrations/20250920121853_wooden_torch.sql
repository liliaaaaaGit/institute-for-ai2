/*
# Update AI Models

1. Changes
  - Clear existing models and add new model list
  - Add GPT-4, GPT-3.5, GPT-4o, Claude Sonnet, Claude Haiku, Gemini 1.5 Pro, Mistral 7B
  - Update emission factors based on current industry estimates

2. Models Added
  - GPT-4 (OpenAI) - 8.5g CO₂/1k tokens
  - GPT-3.5 (OpenAI) - 4.2g CO₂/1k tokens  
  - GPT-4o (OpenAI) - 7.8g CO₂/1k tokens
  - Claude Sonnet (Anthropic) - 7.1g CO₂/1k tokens
  - Claude Haiku (Anthropic) - 3.8g CO₂/1k tokens
  - Gemini 1.5 Pro (Google) - 6.8g CO₂/1k tokens
  - Mistral 7B (Mistral AI) - 4.5g CO₂/1k tokens
*/

-- Clear existing models
DELETE FROM models;

-- Insert updated model list
INSERT INTO models (name, vendor, grams_per_1k_tokens, is_active) VALUES
  ('GPT-4', 'OpenAI', 8.5, true),
  ('GPT-3.5', 'OpenAI', 4.2, true),
  ('GPT-4o', 'OpenAI', 7.8, true),
  ('Claude Sonnet', 'Anthropic', 7.1, true),
  ('Claude Haiku', 'Anthropic', 3.8, true),
  ('Gemini 1.5 Pro', 'Google', 6.8, true),
  ('Mistral 7B', 'Mistral AI', 4.5, true);