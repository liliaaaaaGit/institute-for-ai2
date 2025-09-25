const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('Setting up Supabase database...')
  
  try {
    // Test connection
    const { data, error } = await supabase.from('models').select('count', { count: 'exact' })
    
    if (error && error.code === '42P01') {
      console.log('Tables do not exist. You need to run the migrations in your Supabase dashboard.')
      console.log('Go to your Supabase project > SQL Editor and run the migration files.')
      return
    }
    
    if (error) {
      console.error('Database error:', error)
      return
    }
    
    console.log('Database connection successful!')
    
    // Check if models exist
    const { data: models } = await supabase.from('models').select('*')
    console.log(`Found ${models?.length || 0} models in database`)
    
    if (models && models.length > 0) {
      console.log('Models:', models.map(m => `${m.name} (${m.vendor})`))
    }
    
  } catch (error) {
    console.error('Setup error:', error)
  }
}

setupDatabase()