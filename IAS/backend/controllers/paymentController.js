// ============================================
// PAYMENT CONTROLLER (XENDIT)
// ============================================

const XenditAPI = require('../config/xendit');

// Create Invoice (supports all payment methods)
exports.createInvoice = async (req, res) => {
    try {
        const { amount, description, customer, items } = req.body;

        console.log('📥 Create invoice request:', {
            amount,
            description,
            customerName: customer?.name
        });

        if (!amount || !customer) {
            return res.status(400).json({
                success: false,
                message: 'Amount and customer information are required'
            });
        }

        const result = await XenditAPI.createInvoice(
            amount,
            description || 'Course Enrollment',
            customer,
            items
        );

        console.log('📤 Xendit response:', {
            success: result.success,
            hasData: !!result.data,
            invoiceUrl: result.data?.invoice_url
        });

        if (!result.success) {
            console.error('❌ Xendit error:', result.error);
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error('❌ Create invoice error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create invoice',
            error: error.message
        });
    }
};

// Create E-Wallet Charge (GCash, PayMaya, GrabPay)
exports.createEWalletCharge = async (req, res) => {
    try {
        const { ewalletType, amount, customer } = req.body;

        console.log('📥 Create e-wallet charge request:', {
            ewalletType,
            amount,
            customerName: customer?.name
        });

        if (!ewalletType || !amount || !customer) {
            return res.status(400).json({
                success: false,
                message: 'E-wallet type, amount, and customer information are required'
            });
        }

        const referenceId = `ewallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const result = await XenditAPI.createEWalletCharge(
            ewalletType,
            amount,
            referenceId,
            customer
        );

        console.log('📤 Xendit response:', {
            success: result.success,
            hasData: !!result.data,
            checkoutUrl: result.data?.actions?.desktop_web_checkout_url
        });

        if (!result.success) {
            console.error('❌ Xendit error:', result.error);
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error('❌ Create e-wallet charge error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create e-wallet charge',
            error: error.message
        });
    }
};

// Create Virtual Account
exports.createVirtualAccount = async (req, res) => {
    try {
        const { bankCode, amount, name } = req.body;

        console.log('📥 Create virtual account request:', {
            bankCode,
            amount,
            name
        });

        if (!bankCode || !amount || !name) {
            return res.status(400).json({
                success: false,
                message: 'Bank code, amount, and name are required'
            });
        }

        const externalId = `va_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const result = await XenditAPI.createVirtualAccount(
            bankCode,
            amount,
            name,
            externalId
        );

        console.log('📤 Xendit response:', {
            success: result.success,
            hasData: !!result.data,
            accountNumber: result.data?.account_number
        });

        if (!result.success) {
            console.error('❌ Xendit error:', result.error);
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error('❌ Create virtual account error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create virtual account',
            error: error.message
        });
    }
};

// Verify Payment (Invoice or E-Wallet)
exports.verifyPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { type } = req.query; // 'invoice' or 'ewallet'

        console.log('📥 Verify payment request:', {
            paymentId,
            type
        });

        if (!paymentId) {
            return res.status(400).json({
                success: false,
                message: 'Payment ID is required'
            });
        }

        let result;
        if (type === 'ewallet') {
            result = await XenditAPI.getEWalletCharge(paymentId);
        } else {
            result = await XenditAPI.getInvoice(paymentId);
        }

        console.log('📤 Xendit response:', {
            success: result.success,
            status: result.data?.status
        });

        if (!result.success) {
            console.error('❌ Xendit error:', result.error);
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error('❌ Verify payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify payment',
            error: error.message
        });
    }
};

// Expire Invoice
exports.expireInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        if (!invoiceId) {
            return res.status(400).json({
                success: false,
                message: 'Invoice ID is required'
            });
        }

        const result = await XenditAPI.expireInvoice(invoiceId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error('Expire invoice error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to expire invoice',
            error: error.message
        });
    }
};
