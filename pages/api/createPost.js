import { forumsApi, ApiError } from '@/lib/forumsApi';
import { validatePost } from '@/lib/validation';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { body, threadId, userId } = req.body;

    // Validate IDs
    if (!userId || typeof userId !== 'number') {
        return res.status(400).json({ 
            error: 'Validation failed',
            message: 'User ID is required',
        });
    }

    if (!threadId || typeof threadId !== 'number') {
        return res.status(400).json({ 
            error: 'Validation failed',
            message: 'Thread ID is required',
        });
    }

    // Validate post data
    const validation = validatePost(body);
    if (!validation.isValid) {
        return res.status(400).json({ 
            error: 'Validation failed',
            message: validation.errors.join(', '),
        });
    }

    try {
        const { data, status } = await forumsApi.posts.create(
            validation.sanitized.body,
            threadId,
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
        console.error('Error creating post:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}