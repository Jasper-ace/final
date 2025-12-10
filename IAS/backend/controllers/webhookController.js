// ============================================
// WEBHOOK CONTROLLER (XENDIT)
// ============================================

const supabase = require('../config/supabase');
const crypto = require('crypto');

// Verify Xendit Webhook Signature
function verifyXenditSignature(webhookToken, payload, signature) {
    const computedSignature = crypto
        .createHmac('sha256', webhookToken)
        .update(JSON.stringify(payload))
        .digest('hex');
    
    return computedSignature === signature;
}

// Handle Xendit Webhook
exports.handleXenditWebhook = async (req, res) => {
    try {
        const payload = req.body;
        const signature = req.headers['x-callback-token'];

        console.log('📨 Xendit Webhook received:', payload.event || payload.status);

        // Verify webhook signature (optional but recommended)
        if (process.env.XENDIT_WEBHOOK_TOKEN) {
            const isValid = verifyXenditSignature(
                process.env.XENDIT_WEBHOOK_TOKEN,
                payload,
                signature
            );

            if (!isValid) {
                console.error('❌ Invalid webhook signature');
                return res.status(401).json({
                    success: false,
                    message: 'Invalid signature'
                });
            }
        }

        // Handle different event types
        // Invoice events
        if (payload.event) {
            switch (payload.event) {
                case 'invoice.paid':
                    await handleInvoicePaid(payload);
                    break;

                case 'invoice.expired':
                    await handleInvoiceExpired(payload);
                    break;

                case 'invoice.payment_failed':
                    await handleInvoicePaymentFailed(payload);
                    break;

                default:
                    console.log('Unhandled invoice event:', payload.event);
            }
        }
        // E-Wallet charge events
        else if (payload.status) {
            switch (payload.status) {
                case 'SUCCEEDED':
                    await handleEWalletSuccess(payload);
                    break;

                case 'FAILED':
                    await handleEWalletFailed(payload);
                    break;

                default:
                    console.log('Unhandled e-wallet status:', payload.status);
            }
        }

        // Always respond with 200 to acknowledge receipt
        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({
            success: false,
            message: 'Webhook processing failed',
            error: error.message
        });
    }
};

// Handle successful invoice payment
async function handleInvoicePaid(data) {
    console.log('✅ Invoice paid:', data.id);
    console.log('   Amount:', data.amount);
    console.log('   External ID:', data.external_id);

    try {
        // Update enrollment status in database
        const { error } = await supabase
            .from('enrollments')
            .update({ 
                payment_status: 'completed',
                payment_id: data.id,
                paid_at: new Date().toISOString()
            })
            .eq('external_id', data.external_id);

        if (error) {
            console.error('Error updating enrollment:', error);
        } else {
            console.log('✅ Enrollment updated successfully');
        }

        // Send confirmation email, grant course access, etc.
    } catch (error) {
        console.error('Error handling invoice paid:', error);
    }
}

// Handle expired invoice
async function handleInvoiceExpired(data) {
    console.log('⏰ Invoice expired:', data.id);

    try {
        // Update enrollment status
        const { error } = await supabase
            .from('enrollments')
            .update({ 
                payment_status: 'expired'
            })
            .eq('external_id', data.external_id);

        if (error) {
            console.error('Error updating enrollment:', error);
        }
    } catch (error) {
        console.error('Error handling invoice expired:', error);
    }
}

// Handle failed invoice payment
async function handleInvoicePaymentFailed(data) {
    console.log('❌ Invoice payment failed:', data.id);

    try {
        // Update enrollment status
        const { error } = await supabase
            .from('enrollments')
            .update({ 
                payment_status: 'failed'
            })
            .eq('external_id', data.external_id);

        if (error) {
            console.error('Error updating enrollment:', error);
        }

        // Send failure notification
    } catch (error) {
        console.error('Error handling invoice payment failed:', error);
    }
}

// Handle successful e-wallet payment
async function handleEWalletSuccess(data) {
    console.log('✅ E-Wallet payment successful:', data.id);
    console.log('   Amount:', data.capture_amount);
    console.log('   Reference ID:', data.reference_id);

    try {
        // Update enrollment status
        const { error } = await supabase
            .from('enrollments')
            .update({ 
                payment_status: 'completed',
                payment_id: data.id,
                paid_at: new Date().toISOString()
            })
            .eq('reference_id', data.reference_id);

        if (error) {
            console.error('Error updating enrollment:', error);
        } else {
            console.log('✅ Enrollment updated successfully');
        }
    } catch (error) {
        console.error('Error handling e-wallet success:', error);
    }
}

// Handle failed e-wallet payment
async function handleEWalletFailed(data) {
    console.log('❌ E-Wallet payment failed:', data.id);

    try {
        // Update enrollment status
        const { error } = await supabase
            .from('enrollments')
            .update({ 
                payment_status: 'failed'
            })
            .eq('reference_id', data.reference_id);

        if (error) {
            console.error('Error updating enrollment:', error);
        }
    } catch (error) {
        console.error('Error handling e-wallet failed:', error);
    }
}
