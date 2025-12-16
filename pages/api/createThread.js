import { forumsApi, ApiError } from '@/lib/forumsApi';
import { validateThread } from '@/lib/validation';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { title, slug, body, locked, pinned, tags, poll, extendedData } = req.body;
    const { forumUserToken } = req.cookies;

    // Check authentication
    if (!forumUserToken) {
        return res.status(401).json({ 
            error: 'Unauthorized',
            message: 'You must be logged in to create a thread',
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
        const { data, status } = await forumsApi.threads.create({
            title: validation.sanitized.title,
            slug,
            body: validation.sanitized.body,
            locked,
            pinned,
            tags,
            poll,
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
        console.error('Error creating thread:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}