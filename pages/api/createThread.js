import { forumsApi, ApiError } from '@/lib/forumsApi';
import { validateThread } from '@/lib/validation';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { title, body, userId } = req.body;

    // Validate user ID (UUID string)
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
        return res.status(400).json({ 
            error: 'Validation failed',
            message: 'Valid User ID is required',
        });
    }

    // Validate thread data
    const validation = validateThread(title, body);
    if (!validation.isValid) {
        return res.status(400).json({ 
            error: 'Validation failed',
            message: validation.errors.join(', '),
        });
    }

    try {
        const { data, status } = await forumsApi.threads.create(
            validation.sanitized.title, 
            validation.sanitized.body, 
            userId
        );
        return res.status(status).json(data);
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.status).json({ 
                error: error.message,
                ...error.data 
            });
        }
        console.error('Error creating thread:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}