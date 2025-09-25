/*
# Enable pgcrypto and ensure RPC functions exist

1. Extensions
  - Enable pgcrypto extension for gen_random_bytes function

2. Functions  
  - Ensure create_session_public exists
  - Ensure create_lead_public exists
  - Ensure confirm_lead exists

3. Security
  - Grant proper permissions to anon and authenticated users
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create public session creation function
CREATE OR REPLACE FUNCTION create_session_public(
  p_model_id uuid,
  p_input_mode text,
  p_prompt_len_chars integer,
  p_tokens_input integer,
  p_tokens_estimated integer,
  p_co2_grams numeric
) RETURNS text
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  session_id uuid;
  public_slug text;
BEGIN
  -- Generate a simple slug using pgcrypto
  public_slug := encode(gen_random_bytes(6), 'hex');
  
  -- Insert session
  INSERT INTO sessions (
    model_id, input_mode, tokens_input, tokens_estimated,
    co2_grams, public_slug
  ) VALUES (
    p_model_id, p_input_mode, p_tokens_input, p_tokens_estimated,
    p_co2_grams, public_slug
  ) RETURNING id INTO session_id;
  
  RETURN public_slug;
END;
$$;

-- Create public lead creation function
CREATE OR REPLACE FUNCTION create_lead_public(
  p_email text,
  p_session_id text
) RETURNS uuid
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  lead_id uuid;
  session_uuid uuid;
  confirmation_token text;
BEGIN
  -- Find session by public slug
  SELECT id INTO session_uuid
  FROM sessions
  WHERE public_slug = p_session_id;
  
  IF session_uuid IS NULL THEN
    RAISE EXCEPTION 'Session not found';
  END IF;
  
  -- Generate confirmation token using pgcrypto
  confirmation_token := encode(gen_random_bytes(32), 'hex');
  
  -- Insert lead
  INSERT INTO leads (
    email, consent_marketing, consent_policy_version,
    session_id, confirmation_token
  ) VALUES (
    p_email, false, '1.0',
    session_uuid, confirmation_token
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_session_public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_lead_public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION confirm_lead TO anon, authenticated;