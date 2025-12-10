-- ============================================
-- ADMIN RLS POLICIES
-- ============================================
-- Add policies to allow admin to view all data
-- Run this in Supabase SQL Editor

-- ============================================
-- Option 1: Add public read policies (RECOMMENDED FOR DEVELOPMENT)
-- ============================================

-- GCash Wallets - Allow public read for admin
CREATE POLICY "Allow public read for admin"
    ON gcash_wallets FOR SELECT
    USING (true);

-- PayMaya Wallets - Allow public read for admin
CREATE POLICY "Allow public read for admin"
    ON paymaya_wallets FOR SELECT
    USING (true);

-- GrabPay Wallets - Allow public read for admin
CREATE POLICY "Allow public read for admin"
    ON grabpay_wallets FOR SELECT
    USING (true);

-- Wallet Transactions - Allow public read for admin
CREATE POLICY "Allow public read for admin"
    ON wallet_transactions FOR SELECT
    USING (true);

-- ============================================
-- Option 2: Temporarily disable RLS (NOT RECOMMENDED FOR PRODUCTION)
-- ============================================
-- Uncomment these lines if you want to completely disable RLS

-- ALTER TABLE gcash_wallets DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE paymaya_wallets DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE grabpay_wallets DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE wallet_transactions DISABLE ROW LEVEL SECURITY;

-- ============================================
-- To re-enable RLS later (if you disabled it):
-- ============================================
-- ALTER TABLE gcash_wallets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE paymaya_wallets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE grabpay_wallets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- NOTES:
-- ============================================
-- Option 1 is safer - it keeps RLS enabled but adds a policy for public read
-- Option 2 completely disables RLS - use only for development/testing
-- 
-- For production, you should:
-- 1. Get the service role key from Supabase
-- 2. Use it in the admin dashboard
-- 3. Keep RLS enabled with proper policies
