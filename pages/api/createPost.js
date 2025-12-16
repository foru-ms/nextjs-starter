import { forumsApi, ApiError } from '@/lib/forumsApi';
import { validatePost } from '@/lib/validation';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { body, threadId, parentId, extendedData } = req.body;
    const { forumUserToken } = req.cookies;

    // Check authentication
    if (!forumUserToken) {
        return res.status(401).json({ 
            error: 'Unauthorized',
            message: 'You must be logged in to create a post',
        });
    }

    // Validate thread ID
    if (!threadId || typeof threadId !== 'string' || threadId.trim().length === 0) {
        return res.status(400).json({ 
            error: 'Validation failed',
            message: 'Valid Thread ID is required',
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
        const { data, status } = await forumsApi.posts.create({
            body: validation.sanitized.body,
            threadId,
            parentId,
            extendedData,
        }, forumUserToken);
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