// ============================================
// WALLET MANAGER - Supabase Integration
// ============================================
// Handles saving and retrieving wallet credentials
// and transactions from Supabase database

class WalletManager {
    constructor() {
        // Wait for supabase to be initialized
        this.initSupabase();
    }

    initSupabase() {
        // Get Supabase client - try multiple sources
        if (window.supabaseDirect) {
            this.supabase = window.supabaseDirect;
            console.log('✅ Using supabaseDirect client');
        } else if (window.supabaseAuth && window.supabaseAuth.supabase) {
            this.supabase = window.supabaseAuth.supabase;
            console.log('✅ Using supabaseAuth.supabase client');
        } else {
            console.error('❌ Supabase client not found. Make sure supabase-config.js is loaded first.');
            console.log('Available:', { 
                supabaseDirect: !!window.supabaseDirect, 
                supabaseAuth: !!window.supabaseAuth 
            });
        }
    }

    getSupabase() {
        if (!this.supabase) {
            this.initSupabase();
        }
        return this.supabase;
    }

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    /**
     * No hashing - store plain text (DEVELOPMENT ONLY!)
     * WARNING: In production, ALWAYS hash passwords!
     */
    async hashPassword(password) {
        // Return plain text for development
        return password;
    }

    /**
     * Validate Philippine mobile number
     */
    validateMobileNumber(mobile) {
        const regex = /^09[0-9]{9}$/;
        return regex.test(mobile);
    }

    /**
     * Validate 4-digit MPIN
     */
    validateMpin(mpin) {
        const regex = /^[0-9]{4}$/;
        return regex.test(mpin);
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        if (window.supabaseAuth && window.supabaseAuth.isAuthenticated()) {
            return window.supabaseAuth.getCurrentUser();
        }
        return null;
    }

    // ============================================
    // GCASH WALLET FUNCTIONS
    // ============================================

    /**
     * Save GCash wallet credentials
     */
    async saveGCashWallet(mobileNumber, mpin) {
        try {
            const supabase = this.getSupabase();
            if (!supabase) {
                throw new Error('Supabase client not initialized');
            }

            const user = this.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Validate inputs
            if (!this.validateMobileNumber(mobileNumber)) {
                throw new Error('Invalid mobile number format. Must be 09XXXXXXXXX');
            }

            if (!this.validateMpin(mpin)) {
                throw new Error('Invalid MPIN. Must be 4 digits');
            }

            // Hash the MPIN
            const mpinHash = await this.hashPassword(mpin);

            // Check if wallet already exists
            const { data: existing } = await supabase
                .from('gcash_wallets')
                .select('id')
                .eq('user_id', user.id)
                .eq('mobile_number', mobileNumber)
                .single();

            if (existing) {
                // Update existing wallet
                const { data, error } = await supabase
                    .from('gcash_wallets')
                    .update({
                        mpin_hash: mpinHash,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existing.id)
                    .select();

                if (error) throw error;
                console.log('✅ GCash wallet updated:', data);
                return { success: true, data, message: 'GCash wallet updated successfully' };
            } else {
                // Insert new wallet
                const { data, error } = await supabase
                    .from('gcash_wallets')
                    .insert([{
                        user_id: user.id,
                        mobile_number: mobileNumber,
                        mpin_hash: mpinHash,
                        is_primary: true,
                        is_verified: false
                    }])
                    .select();

                if (error) throw error;
                console.log('✅ GCash wallet saved:', data);
                return { success: true, data, message: 'GCash wallet saved successfully' };
            }
        } catch (error) {
            console.error('❌ Error saving GCash wallet:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get user's GCash wallets
     */
    async getGCashWallets() {
        try {
            const user = this.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            const { data, error } = await this.getSupabase()
                .from('gcash_wallets')
                .select('id, mobile_number, is_primary, is_verified, created_at, last_used_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching GCash wallets:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Verify GCash MPIN
     */
    async verifyGCashMpin(mobileNumber, inputMpin) {
        try {
            const user = this.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Get wallet
            const { data: wallet, error } = await this.getSupabase()
                .from('gcash_wallets')
                .select('id, mpin_hash')
                .eq('user_id', user.id)
                .eq('mobile_number', mobileNumber)
                .single();

            if (error) throw error;
            if (!wallet) {
                return { success: false, message: 'Wallet not found' };
            }

            // Hash input MPIN and compare
            const inputHash = await this.hashPassword(inputMpin);
            const isValid = inputHash === wallet.mpin_hash;

            if (isValid) {
                // Update last_used_at
                await this.getSupabase()
                    .from('gcash_wallets')
                    .update({ last_used_at: new Date().toISOString() })
                    .eq('id', wallet.id);
            }

            return { success: true, isValid };
        } catch (error) {
            console.error('❌ Error verifying GCash MPIN:', error);
            return { success: false, error: error.message };
        }
    }

    // ============================================
    // PAYMAYA WALLET FUNCTIONS
    // ============================================

    /**
     * Save PayMaya wallet credentials
     */
    async savePayMayaWallet(mobileNumber, password) {
        try {
            const user = this.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Validate inputs
            if (!this.validateMobileNumber(mobileNumber)) {
                throw new Error('Invalid mobile number format. Must be 09XXXXXXXXX');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            // Hash the password
            const passwordHash = await this.hashPassword(password);

            // Check if wallet already exists
            const { data: existing } = await this.getSupabase()
                .from('paymaya_wallets')
                .select('id')
                .eq('user_id', user.id)
                .eq('mobile_number', mobileNumber)
                .single();

            if (existing) {
                // Update existing wallet
                const { data, error } = await this.getSupabase()
                    .from('paymaya_wallets')
                    .update({
                        password_hash: passwordHash,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existing.id)
                    .select();

                if (error) throw error;
                console.log('✅ PayMaya wallet updated:', data);
                return { success: true, data, message: 'PayMaya wallet updated successfully' };
            } else {
                // Insert new wallet
                const { data, error } = await this.getSupabase()
                    .from('paymaya_wallets')
                    .insert([{
                        user_id: user.id,
                        mobile_number: mobileNumber,
                        password_hash: passwordHash,
                        is_primary: true,
                        is_verified: false
                    }])
                    .select();

                if (error) throw error;
                console.log('✅ PayMaya wallet saved:', data);
                return { success: true, data, message: 'PayMaya wallet saved successfully' };
            }
        } catch (error) {
            console.error('❌ Error saving PayMaya wallet:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Verify PayMaya password
     */
    async verifyPayMayaPassword(mobileNumber, inputPassword) {
        try {
            const user = this.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Get wallet
            const { data: wallet, error } = await this.getSupabase()
                .from('paymaya_wallets')
                .select('id, password_hash')
                .eq('user_id', user.id)
                .eq('mobile_number', mobileNumber)
                .single();

            if (error) throw error;
            if (!wallet) {
                return { success: false, message: 'Wallet not found' };
            }

            // Hash input password and compare
            const inputHash = await this.hashPassword(inputPassword);
            const isValid = inputHash === wallet.password_hash;

            if (isValid) {
                // Update last_used_at
                await this.getSupabase()
                    .from('paymaya_wallets')
                    .update({ last_used_at: new Date().toISOString() })
                    .eq('id', wallet.id);
            }

            return { success: true, isValid };
        } catch (error) {
            console.error('❌ Error verifying PayMaya password:', error);
            return { success: false, error: error.message };
        }
    }

    // ============================================
    // GRABPAY WALLET FUNCTIONS
    // ============================================

    /**
     * Save GrabPay wallet credentials
     */
    async saveGrabPayWallet(mobileNumber, password) {
        try {
            const user = this.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Validate inputs
            if (!this.validateMobileNumber(mobileNumber)) {
                throw new Error('Invalid mobile number format. Must be 09XXXXXXXXX');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            // Hash the password
            const passwordHash = await this.hashPassword(password);

            // Check if wallet already exists
            const { data: existing } = await this.getSupabase()
                .from('grabpay_wallets')
                .select('id')
                .eq('user_id', user.id)
                .eq('mobile_number', mobileNumber)
                .single();

            if (existing) {
                // Update existing wallet
                const { data, error } = await this.getSupabase()
                    .from('grabpay_wallets')
                    .update({
                        password_hash: passwordHash,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existing.id)
                    .select();

                if (error) throw error;
                console.log('✅ GrabPay wallet updated:', data);
                return { success: true, data, message: 'GrabPay wallet updated successfully' };
            } else {
                // Insert new wallet
                const { data, error } = await this.getSupabase()
                    .from('grabpay_wallets')
                    .insert([{
                        user_id: user.id,
                        mobile_number: mobileNumber,
                        password_hash: passwordHash,
                        is_primary: true,
                        is_verified: false
                    }])
                    .select();

                if (error) throw error;
                console.log('✅ GrabPay wallet saved:', data);
                return { success: true, data, message: 'GrabPay wallet saved successfully' };
            }
        } catch (error) {
            console.error('❌ Error saving GrabPay wallet:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Verify GrabPay password
     */
    async verifyGrabPayPassword(mobileNumber, inputPassword) {
        try {
            const user = this.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Get wallet
            const { data: wallet, error } = await this.getSupabase()
                .from('grabpay_wallets')
                .select('id, password_hash')
                .eq('user_id', user.id)
                .eq('mobile_number', mobileNumber)
                .single();

            if (error) throw error;
            if (!wallet) {
                return { success: false, message: 'Wallet not found' };
            }

            // Hash input password and compare
            const inputHash = await this.hashPassword(inputPassword);
            const isValid = inputHash === wallet.password_hash;

            if (isValid) {
                // Update last_used_at
                await this.getSupabase()
                    .from('grabpay_wallets')
                    .update({ last_used_at: new Date().toISOString() })
                    .eq('id', wallet.id);
            }

            return { success: true, isValid };
        } catch (error) {
            console.error('❌ Error verifying GrabPay password:', error);
            return { success: false, error: error.message };
        }
    }

    // ============================================
    // TRANSACTION FUNCTIONS
    // ============================================

    /**
     * Record wallet transaction
     */
    async recordTransaction(walletType, mobileNumber, amount, courseId, courseName) {
        try {
            const user = this.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Generate transaction reference
            const reference = `${walletType.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Calculate expiry (15 minutes from now)
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

            const { data, error } = await this.getSupabase()
                .from('wallet_transactions')
                .insert([{
                    user_id: user.id,
                    wallet_type: walletType,
                    mobile_number: mobileNumber,
                    amount: amount,
                    course_id: courseId,
                    transaction_reference: reference,
                    status: 'pending',
                    payment_method: `${walletType} Wallet`,
                    expires_at: expiresAt
                }])
                .select();

            if (error) throw error;

            console.log('✅ Transaction recorded:', data);
            return { success: true, data: data[0], reference };
        } catch (error) {
            console.error('❌ Error recording transaction:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Update transaction status
     */
    async updateTransactionStatus(reference, status) {
        try {
            const completedAt = status === 'success' ? new Date().toISOString() : null;

            const { data, error } = await this.getSupabase()
                .from('wallet_transactions')
                .update({
                    status: status,
                    completed_at: completedAt
                })
                .eq('transaction_reference', reference)
                .select();

            if (error) throw error;

            console.log('✅ Transaction status updated:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error updating transaction:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get user's transactions
     */
    async getTransactions(limit = 10) {
        try {
            const user = this.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            const { data, error } = await this.getSupabase()
                .from('wallet_transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching transactions:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get transaction by reference
     */
    async getTransactionByReference(reference) {
        try {
            const { data, error } = await this.getSupabase()
                .from('wallet_transactions')
                .select('*')
                .eq('transaction_reference', reference)
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching transaction:', error);
            return { success: false, error: error.message };
        }
    }
}

// Create global instance after a short delay to ensure Supabase is loaded
setTimeout(() => {
    window.walletManager = new WalletManager();
    console.log('✅ Wallet Manager initialized');
}, 100);

