import { forumsApi, ApiError } from '@/lib/forumsApi';
import { validateLogin } from '@/lib/validation';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { login, password } = req.body;

    // Validate input
    const validation = validateLogin(login, password);
    if (!validation.isValid) {
        return res.status(400).json({ 
            error: 'Validation failed',
            message: validation.errors.join(', '),
        });
    }

    try {
        const { data, status } = await forumsApi.auth.login(login, password);
        return res.status(status).json(data);
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.status).json({ 
                error: error.message,
                ...error.data 
            });
        }
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}