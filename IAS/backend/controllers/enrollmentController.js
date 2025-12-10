// ============================================
// ENROLLMENT CONTROLLER
// ============================================

const supabase = require('../config/supabase');

// Create Enrollment
exports.createEnrollment = async (req, res) => {
    try {
        const {
            user_id,
            course_id,
            course_title,
            course_instructor,
            course_price,
            course_duration,
            course_level,
            payment_status
        } = req.body;

        if (!user_id || !course_title) {
            return res.status(400).json({
                success: false,
                message: 'User ID and course title are required'
            });
        }

        const enrollmentData = {
            user_id,
            course_name: course_title,
            course_price,
            enrolled_at: new Date().toISOString(),
            payment_status: payment_status || 'completed',
            progress: 0,
            status: 'active',
            payment_data: {
                course_id,
                instructor: course_instructor,
                duration: course_duration,
                level: course_level
            }
        };

        const { data, error } = await supabase
            .from('enrollments')
            .insert([enrollmentData])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return res.status(400).json({
                success: false,
                message: 'Failed to create enrollment',
                error: error.message
            });
        }

        res.json({
            success: true,
            data: data[0]
        });
    } catch (error) {
        console.error('Create enrollment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create enrollment',
            error: error.message
        });
    }
};

// Get User Enrollments
exports.getUserEnrollments = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const { data, error } = await supabase
            .from('enrollments')
            .select('*')
            .eq('user_id', userId)
            .order('enrolled_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return res.status(400).json({
                success: false,
                message: 'Failed to fetch enrollments',
                error: error.message
            });
        }

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Get enrollments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch enrollments',
            error: error.message
        });
    }
};

// Save Account/Billing Info
exports.saveAccountInfo = async (req, res) => {
    try {
        const {
            user_id,
            full_name,
            email,
            address,
            city,
            state,
            zip_code,
            card_last_four,
            card_expiry,
            card_type
        } = req.body;

        if (!user_id || !full_name || !email) {
            return res.status(400).json({
                success: false,
                message: 'User ID, full name, and email are required'
            });
        }

        const accountData = {
            user_id,
            full_name,
            email,
            address: address || '',
            city: city || '',
            state: state || '',
            zip_code: zip_code || '',
            card_last_four: card_last_four || '',
            card_expiry: card_expiry || '',
            card_type: card_type || ''
        };

        // Always insert new record (for transaction history)
        const { data, error } = await supabase
            .from('accounts')
            .insert([accountData])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return res.status(400).json({
                success: false,
                message: 'Failed to save account info',
                error: error.message
            });
        }

        res.json({
            success: true,
            data: data[0]
        });
    } catch (error) {
        console.error('Save account info error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save account info',
            error: error.message
        });
    }
};
