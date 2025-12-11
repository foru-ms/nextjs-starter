import { forumsApi, ApiError } from '@/lib/forumsApi';
import { isValidSearchQuery, isValidSearchType, isValidPage } from '@/lib/validation';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query, type, page = 1 } = req.body;

    // Validate input
    if (!isValidSearchQuery(query)) {
        return res.status(400).json({ 
            error: 'Validation failed',
            message: 'Search query must be between 1 and 100 characters',
        });
    }

    if (!isValidSearchType(type)) {
        return res.status(400).json({ 
            error: 'Validation failed',
            message: 'Search type must be one of: threads, posts, all',
        });
    }

    if (!isValidPage(page)) {
        return res.status(400).json({ 
            error: 'Validation failed',
            message: 'Invalid page number',
        });
    }

    try {
        const { data, status } = await forumsApi.search.query(query, type.toLowerCase(), page);
        return res.status(status).json(data);
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.status).json({ 
                error: error.message,
                ...error.data 
            });
        }
        console.error('Error searching:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}