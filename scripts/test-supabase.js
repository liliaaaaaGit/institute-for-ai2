const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING')
console.log('Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.log('\nPlease update your .env.local file with:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('\n🔍 Testing database connection...')
    
    // Test basic connection
    const { data: healthCheck, error: healthError } = await supabase
      .from('models')
      .select('count', { count: 'exact', head: true })
    
    if (healthError) {
      console.error('❌ Connection failed:', healthError.message)
      return
    }
    
    console.log('✅ Database connection successful!')
    
    // Test models table
    const { data: models, error: modelsError } = await supabase
      .from('models')
      .select('*')
      .eq('is_active', true)
    
    if (modelsError) {
      console.error('❌ Models query failed:', modelsError.message)
      return
    }
    
    console.log(`✅ Found ${models?.length || 0} active models:`)
    models?.forEach(model => {
      console.log(`   - ${model.name} (${model.vendor}) - ${model.grams_per_1k_tokens}g CO₂/1k tokens`)
    })
    
    // Test factors table
    const { data: factors, error: factorsError } = await supabase
      .from('factors')
      .select('*')
      .eq('is_active', true)
    
    if (factorsError) {
      console.error('❌ Factors query failed:', factorsError.message)
      return
    }
    
    console.log(`✅ Found ${factors?.length || 0} comparison factors`)
    
    if (models?.length === 0) {
      console.log('\n⚠️  No models found. You may need to run the database migrations.')
      console.log('Go to your Supabase dashboard > SQL Editor and run the migration files.')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testConnection()