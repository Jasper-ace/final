// ============================================
// XENDIT CONFIGURATION
// ============================================

const axios = require('axios');

const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY;
const XENDIT_API_BASE = 'https://api.xendit.co';

// Create axios instance with auth
const xenditClient = axios.create({
    baseURL: XENDIT_API_BASE,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(XENDIT_SECRET_KEY + ':').toString('base64')}`
    }
});

// Xendit API Methods
const XenditAPI = {
    // Create Invoice (for multiple payment methods)
    async createInvoice(amount, description, customerInfo, items = []) {
        try {
            const externalId = `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // Build customer object - only include mobile_number if provided
            const customer = {
                given_names: customerInfo.name,
                email: customerInfo.email
            };
            
            // Only add mobile_number if it's provided and valid
            if (customerInfo.phone && customerInfo.phone.trim() !== '') {
                customer.mobile_number = customerInfo.phone;
            }

            const response = await xenditClient.post('/v2/invoices', {
                external_id: externalId,
                amount: amount,
                description: description,
                invoice_duration: 86400, // 24 hours
                currency: 'PHP',
                reminder_time: 1,
                customer: customer,
                customer_notification_preference: {
                    invoice_created: ['email'],
                    invoice_reminder: ['email'],
                    invoice_paid: ['email']
                },
                success_redirect_url: customerInfo.successUrl,
                failure_redirect_url: customerInfo.failureUrl,
                items: items.length > 0 ? items : [{
                    name: description,
                    quantity: 1,
                    price: amount,
                    category: 'Education'
                }],
                fees: []
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Xendit API Error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    },

    // Create E-Wallet Charge (GCash, PayMaya, etc.)
    async createEWalletCharge(ewalletType, amount, referenceId, customerInfo) {
        try {
            // Validate required fields
            if (!customerInfo.name || !customerInfo.email) {
                throw new Error('Customer name and email are required');
            }

            // Map e-wallet types to Xendit channel codes
            const channelCodeMap = {
                'gcash': 'PH_GCASH',
                'paymaya': 'PH_PAYMAYA',
                'grabpay': 'PH_GRABPAY'
            };

            const channelCode = channelCodeMap[ewalletType.toLowerCase()];
            if (!channelCode) {
                throw new Error(`Unsupported e-wallet type: ${ewalletType}`);
            }

            // Build payload
            const payload = {
                reference_id: referenceId,
                currency: 'PHP',
                amount: amount,
                checkout_method: 'ONE_TIME_PAYMENT',
                channel_code: channelCode,
                channel_properties: {
                    success_redirect_url: customerInfo.successUrl,
                    failure_redirect_url: customerInfo.failureUrl
                },
                metadata: {
                    customer_name: customerInfo.name,
                    customer_email: customerInfo.email,
                    description: customerInfo.description || 'Course Enrollment'
                }
            };

            console.log('📤 Sending e-wallet request:', JSON.stringify(payload, null, 2));

            const response = await xenditClient.post('/ewallets/charges', payload);

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('❌ Xendit E-Wallet Error:', error.response?.data || error.message);
            
            // Extract detailed error information
            let errorMessage = 'Failed to create e-wallet charge';
            if (error.response?.data) {
                const data = error.response.data;
                if (data.error_code) {
                    errorMessage = `${data.message || errorMessage} (Code: ${data.error_code})`;
                } else if (data.message) {
                    errorMessage = data.message;
                }
                
                // Log validation errors if present
                if (data.errors) {
                    console.error('Validation errors:', JSON.stringify(data.errors, null, 2));
                    errorMessage += ` - ${JSON.stringify(data.errors)}`;
                }
            } else {
                errorMessage = error.message;
            }
            
            return {
                success: false,
                error: errorMessage,
                details: error.response?.data
            };
        }
    },

    // Create Virtual Account
    async createVirtualAccount(bankCode, amount, name, externalId) {
        try {
            const response = await xenditClient.post('/callback_virtual_accounts', {
                external_id: externalId,
                bank_code: bankCode, // BPI, BDO, RCBC, etc.
                name: name,
                expected_amount: amount,
                is_closed: true,
                expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Xendit Virtual Account Error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    },

    // Get Invoice by ID
    async getInvoice(invoiceId) {
        try {
            const response = await xenditClient.get(`/v2/invoices/${invoiceId}`);

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Xendit API Error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    },

    // Get E-Wallet Charge Status
    async getEWalletCharge(chargeId) {
        try {
            const response = await xenditClient.get(`/ewallets/charges/${chargeId}`);

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Xendit API Error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    },

    // Expire Invoice
    async expireInvoice(invoiceId) {
        try {
            const response = await xenditClient.post(`/v2/invoices/${invoiceId}/expire!`);

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Xendit API Error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }
};

module.exports = XenditAPI;
