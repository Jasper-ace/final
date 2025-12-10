// ============================================
// SUPABASE CONFIGURATION
// ============================================

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for backend

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
