import { forumsApi, ApiError } from '@/lib/forumsApi';
import { isValidEmail } from '@/lib/validation';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;

    // Validate input
    if (!isValidEmail(email)) {
        return res.status(400).json({ 
            error: 'Validation failed',
            message: 'Invalid email address',
        });
    }

    try {
        const { data, status } = await forumsApi.auth.forgotPassword(email);
        return res.status(status).json(data);
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.status).json({ 
                error: error.message,
                ...error.data 
            });
        }
        console.error('Error sending password reset:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}