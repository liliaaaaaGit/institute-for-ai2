export interface AIModel {
  id: string
  name: string
  vendor: string
  grams_per_1k_tokens: number
  is_active: boolean
}

export interface ComparisonFactor {
  id: string
  key: string
  value_json: {
    name: string
    unit: string
    grams_co2: number
    description: string
  }
  is_active: boolean
}

export interface CalculationResult {
  sessionId: string
  publicSlug: string
  co2Grams: number
  tokens: number
  model: AIModel
  comparisons: Comparison[]
}

export interface Comparison {
  name: string
  amount: number
  unit: string
  description: string
  formatted: string
}

export interface Session {
  public_slug: string
  input_mode: 'prompt' | 'tokens'
  tokens_input?: number
  tokens_estimated?: number
  co2_grams: number
  created_at: string
  model_name: string
  model_vendor: string
}