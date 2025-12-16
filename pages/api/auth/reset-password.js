import { forumsApi, ApiError } from '@/lib/forumsApi';
import { isValidEmail, isValidPassword } from '@/lib/validation';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password, oldPassword } = req.body;

    // Validate input
    if (!isValidEmail(email)) {
        return res.status(400).json({ 
            error: 'Validation failed',
            message: 'Invalid email address',
        });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({ 
            error: 'Validation failed',
            message: 'Password must be at least 8 characters long',
        });
    }

    try {
        const { data, status } = await forumsApi.auth.resetPassword({ email, password, oldPassword });
        return res.status(status).json(data);
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.status).json({ 
                error: error.message,
                ...error.data 
            });
        }
        console.error('Error resetting password:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}