-- ============================================
-- WALLET CREDENTIALS TABLES
-- ============================================
-- Tables to store user's e-wallet credentials for payments
-- Created: December 3, 2025

-- ============================================
-- 1. GCASH WALLETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gcash_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mobile_number VARCHAR(11) NOT NULL,
    mpin_hash TEXT NOT NULL, -- Encrypted 4-digit MPIN
    is_primary BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT gcash_mobile_format CHECK (mobile_number ~ '^09[0-9]{9}$'),
    CONSTRAINT gcash_unique_mobile UNIQUE (user_id, mobile_number)
);

-- Index for faster lookups
CREATE INDEX idx_gcash_user_id ON gcash_wallets(user_id);
CREATE INDEX idx_gcash_mobile ON gcash_wallets(mobile_number);

-- Enable Row Level Security
ALTER TABLE gcash_wallets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gcash_wallets
CREATE POLICY "Users can view their own GCash wallets"
    ON gcash_wallets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own GCash wallets"
    ON gcash_wallets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own GCash wallets"
    ON gcash_wallets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own GCash wallets"
    ON gcash_wallets FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 2. PAYMAYA WALLETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS paymaya_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mobile_number VARCHAR(11) NOT NULL,
    password_hash TEXT NOT NULL, -- Encrypted password
    is_primary BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT paymaya_mobile_format CHECK (mobile_number ~ '^09[0-9]{9}$'),
    CONSTRAINT paymaya_unique_mobile UNIQUE (user_id, mobile_number)
);

-- Index for faster lookups
CREATE INDEX idx_paymaya_user_id ON paymaya_wallets(user_id);
CREATE INDEX idx_paymaya_mobile ON paymaya_wallets(mobile_number);

-- Enable Row Level Security
ALTER TABLE paymaya_wallets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for paymaya_wallets
CREATE POLICY "Users can view their own PayMaya wallets"
    ON paymaya_wallets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own PayMaya wallets"
    ON paymaya_wallets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own PayMaya wallets"
    ON paymaya_wallets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own PayMaya wallets"
    ON paymaya_wallets FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 3. GRABPAY WALLETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS grabpay_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mobile_number VARCHAR(11) NOT NULL,
    password_hash TEXT NOT NULL, -- Encrypted password
    is_primary BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT grabpay_mobile_format CHECK (mobile_number ~ '^09[0-9]{9}$'),
    CONSTRAINT grabpay_unique_mobile UNIQUE (user_id, mobile_number)
);

-- Index for faster lookups
CREATE INDEX idx_grabpay_user_id ON grabpay_wallets(user_id);
CREATE INDEX idx_grabpay_mobile ON grabpay_wallets(mobile_number);

-- Enable Row Level Security
ALTER TABLE grabpay_wallets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for grabpay_wallets
CREATE POLICY "Users can view their own GrabPay wallets"
    ON grabpay_wallets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own GrabPay wallets"
    ON grabpay_wallets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own GrabPay wallets"
    ON grabpay_wallets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own GrabPay wallets"
    ON grabpay_wallets FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 4. WALLET TRANSACTIONS TABLE (Optional)
-- ============================================
-- Track all wallet payment attempts
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    wallet_type VARCHAR(20) NOT NULL, -- 'gcash', 'paymaya', 'grabpay'
    wallet_id UUID, -- Reference to specific wallet
    mobile_number VARCHAR(11) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    course_id INTEGER,
    transaction_reference VARCHAR(100) UNIQUE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'success', 'failed', 'expired'
    payment_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '15 minutes'),
    
    -- Constraints
    CONSTRAINT wallet_type_check CHECK (wallet_type IN ('gcash', 'paymaya', 'grabpay')),
    CONSTRAINT status_check CHECK (status IN ('pending', 'success', 'failed', 'expired', 'cancelled'))
);

-- Indexes
CREATE INDEX idx_wallet_trans_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_trans_reference ON wallet_transactions(transaction_reference);
CREATE INDEX idx_wallet_trans_status ON wallet_transactions(status);
CREATE INDEX idx_wallet_trans_created ON wallet_transactions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wallet_transactions
CREATE POLICY "Users can view their own wallet transactions"
    ON wallet_transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallet transactions"
    ON wallet_transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 5. FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_gcash_wallets_updated_at
    BEFORE UPDATE ON gcash_wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paymaya_wallets_updated_at
    BEFORE UPDATE ON paymaya_wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grabpay_wallets_updated_at
    BEFORE UPDATE ON grabpay_wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to expire old transactions
CREATE OR REPLACE FUNCTION expire_old_transactions()
RETURNS void AS $$
BEGIN
    UPDATE wallet_transactions
    SET status = 'expired'
    WHERE status = 'pending'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. COMMENTS
-- ============================================

COMMENT ON TABLE gcash_wallets IS 'Stores user GCash wallet credentials';
COMMENT ON TABLE paymaya_wallets IS 'Stores user PayMaya wallet credentials';
COMMENT ON TABLE grabpay_wallets IS 'Stores user GrabPay wallet credentials';
COMMENT ON TABLE wallet_transactions IS 'Tracks all wallet payment transactions';

COMMENT ON COLUMN gcash_wallets.mpin_hash IS 'Encrypted 4-digit MPIN (never store plain text)';
COMMENT ON COLUMN paymaya_wallets.password_hash IS 'Encrypted password (never store plain text)';
COMMENT ON COLUMN grabpay_wallets.password_hash IS 'Encrypted password (never store plain text)';

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Tables created successfully!
-- 
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Verify tables are created in Table Editor
-- 3. Test RLS policies
-- 4. Implement frontend wallet management
-- 5. Add encryption for passwords/MPINs
-- ============================================
