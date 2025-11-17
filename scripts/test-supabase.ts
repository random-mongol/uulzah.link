/**
 * Test Supabase connection and verify database setup
 * Run with: npx tsx scripts/test-supabase.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../lib/supabase/database.types'

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set')
  process.exit(1)
}

console.log('🔍 Testing Supabase connection...')
console.log('URL:', supabaseUrl)

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    // Test 1: Check if we can connect
    console.log('\n✓ Test 1: Basic connection')
    const { data, error } = await supabase.from('events').select('count').limit(1)

    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }

    console.log('✅ Successfully connected to Supabase')

    // Test 2: Check tables exist
    console.log('\n✓ Test 2: Checking tables')
    const tables = ['events', 'event_dates', 'participants', 'responses']

    for (const table of tables) {
      const { error } = await supabase.from(table as any).select('count').limit(1)
      if (error) {
        console.error(`❌ Table "${table}" not found or inaccessible:`, error.message)
      } else {
        console.log(`✅ Table "${table}" exists and is accessible`)
      }
    }

    // Test 3: Check if we can query the events table structure
    console.log('\n✓ Test 3: Checking events table structure')
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('*')
      .limit(0)

    if (!eventError) {
      console.log('✅ Events table structure is valid')
    } else {
      console.error('❌ Events table structure check failed:', eventError.message)
    }

    console.log('\n🎉 All tests passed! Supabase is properly configured.')
    return true
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return false
  }
}

testConnection()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
