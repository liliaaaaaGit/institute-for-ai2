/*
# Initial CO₂ Calculator Schema

1. New Tables
  - `models` - AI model definitions with emission factors
    - `id` (uuid, primary key)  
    - `name` (text, model name like "GPT-4")
    - `vendor` (text, provider like "OpenAI")
    - `grams_per_1k_tokens` (numeric, emission factor)
    - `is_active` (boolean, for enabling/disabling models)
    - `created_at` (timestamp)

  - `factors` - Comparison factors for real-world analogies
    - `id` (uuid, primary key)
    - `key` (text, unique identifier like "pc_usage_hour")
    - `value_json` (jsonb, contains name, unit, grams_co2, description)
    - `is_active` (boolean)
    - `created_at` (timestamp)

  - `sessions` - Anonymous calculation sessions
    - `id` (uuid, primary key)
    - `model_id` (uuid, foreign key to models)
    - `input_mode` (text, "prompt" or "tokens")
    - `tokens_input` (integer, user-provided token count)  
    - `tokens_estimated` (integer, estimated from prompt)
    - `co2_grams` (numeric, calculated emissions)
    - `ip_hash` (text, hashed IP for analytics)
    - `ua_hash` (text, hashed user agent)
    - `public_slug` (text, unique identifier for public reports)
    - `created_at` (timestamp)

  - `leads` - Email leads with consent tracking
    - `id` (uuid, primary key)
    - `email` (text, user email)
    - `consent_marketing` (boolean, marketing consent)
    - `consent_policy_version` (text, privacy policy version)
    - `session_id` (uuid, foreign key to sessions)
    - `confirmed_at` (timestamp, null until email confirmed)
    - `confirmation_token` (text, unique token for email verification)
    - `created_at` (timestamp)

2. Security
  - Enable RLS on all tables
  - Create public view for reports without PII
  - Add policies for secure access patterns
  
3. Initial Data
  - Seed with popular AI models and emission factors
  - Add real-world comparison factors
*/

-- Create tables
CREATE TABLE IF NOT EXISTS models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  vendor text NOT NULL,
  grams_per_1k_tokens numeric NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS factors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value_json jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL REFERENCES models(id),
  input_mode text NOT NULL CHECK (input_mode IN ('prompt', 'tokens')),
  tokens_input integer,
  tokens_estimated integer,
  co2_grams numeric NOT NULL,
  ip_hash text,
  ua_hash text,  
  public_slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  consent_marketing boolean NOT NULL,
  consent_policy_version text NOT NULL,
  session_id uuid NOT NULL REFERENCES sessions(id),
  confirmed_at timestamptz,
  confirmation_token text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE factors ENABLE ROW LEVEL SECURITY; 
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Models are publicly readable"
  ON models
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Factors are publicly readable"
  ON factors  
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Sessions are publicly readable by slug"
  ON sessions
  FOR SELECT  
  TO anon, authenticated
  USING (true);

-- Create public view for reports (no PII)
CREATE OR REPLACE VIEW public_reports_v AS
SELECT 
  s.public_slug,
  s.input_mode,
  s.tokens_input,
  s.tokens_estimated,
  s.co2_grams,
  s.created_at,
  m.name as model_name,
  m.vendor as model_vendor
FROM sessions s
JOIN models m ON s.model_id = m.id;

-- Grant access to views
GRANT SELECT ON public_reports_v TO anon, authenticated;

-- Create secure RPC for session creation
CREATE OR REPLACE FUNCTION create_session(
  p_model_id uuid,
  p_input_mode text,
  p_tokens_input integer,
  p_tokens_estimated integer,
  p_co2_grams numeric,
  p_ip_hash text,
  p_ua_hash text,
  p_public_slug text
) RETURNS uuid
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  session_id uuid;
BEGIN
  INSERT INTO sessions (
    model_id, input_mode, tokens_input, tokens_estimated, 
    co2_grams, ip_hash, ua_hash, public_slug
  ) VALUES (
    p_model_id, p_input_mode, p_tokens_input, p_tokens_estimated,
    p_co2_grams, p_ip_hash, p_ua_hash, p_public_slug
  ) RETURNING id INTO session_id;
  
  RETURN session_id;
END;
$$;

-- Create secure RPC for lead creation
CREATE OR REPLACE FUNCTION create_lead(
  p_email text,
  p_consent_marketing boolean,
  p_consent_policy_version text,
  p_session_id uuid,
  p_confirmation_token text
) RETURNS uuid
SECURITY DEFINER  
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  lead_id uuid;
BEGIN
  INSERT INTO leads (
    email, consent_marketing, consent_policy_version, 
    session_id, confirmation_token
  ) VALUES (
    p_email, p_consent_marketing, p_consent_policy_version,
    p_session_id, p_confirmation_token
  ) RETURNING id INTO lead_id;
  
  RETURN lead_id;
END;
$$;

-- Create RPC for email confirmation
CREATE OR REPLACE FUNCTION confirm_lead(
  p_confirmation_token text
) RETURNS boolean
SECURITY DEFINER
SET search_path = public  
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE leads 
  SET confirmed_at = now()
  WHERE confirmation_token = p_confirmation_token
    AND confirmed_at IS NULL;
    
  RETURN FOUND;
END;
$$;

-- Seed initial data
INSERT INTO models (name, vendor, grams_per_1k_tokens) VALUES
  ('GPT-4', 'OpenAI', 8.5),
  ('GPT-3.5-turbo', 'OpenAI', 4.2),
  ('Claude-3', 'Anthropic', 7.1),
  ('Gemini Pro', 'Google', 6.8),
  ('LLaMA-2-70B', 'Meta', 5.9);

INSERT INTO factors (key, value_json) VALUES
  ('pc_usage', '{"name": "Desktop PC usage", "unit": "hours", "grams_co2": 150, "description": "Average desktop computer running for 1 hour"}'),
  ('car_distance', '{"name": "Car travel", "unit": "meters", "grams_co2": 0.21, "description": "Average gasoline car driving 1 meter"}'),
  ('electricity', '{"name": "Household electricity", "unit": "hours", "grams_co2": 500, "description": "Average home electricity consumption for 1 hour"}'),
  ('smartphone_charge', '{"name": "Smartphone charges", "unit": "charges", "grams_co2": 8, "description": "Fully charging a smartphone"}'),
  ('led_bulb', '{"name": "LED bulb usage", "unit": "hours", "grams_co2": 4.5, "description": "10W LED bulb running for 1 hour"}');