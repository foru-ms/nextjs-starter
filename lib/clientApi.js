/**
 * Client-side API helpers
 * These functions call Next.js API routes which then call the Foru.ms API
 * Use these for client-side data fetching only
 */

class ClientApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ClientApiError';
        this.status = status;
        this.data = data;
    }
}

/**
 * Base fetch wrapper for client-side API calls
 */
async function clientFetch(endpoint, options = {}) {
    try {
        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new ClientApiError(
                data.message || data.error || 'Request failed',
                response.status,
                data
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ClientApiError) {
            throw error;
        }
        throw new ClientApiError(
            error.message || 'Network error',
            500,
            { error: error.message }
        );
    }
}

/**
 * Client-side API helpers
 */
export const clientApi = {
    // Auth
    auth: {
        async login(email, password) {
            return clientFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ login: email, password }),
            });
        },

        async register(username, email, password) {
            return clientFetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
            });
        },

        async forgotPassword(email) {
            return clientFetch('/api/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });
        },

        async resetPassword({ email, password, oldPassword }) {
            return clientFetch('/api/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ email, password, oldPassword }),
            });
        },
    },

    // Threads
    threads: {
        async create({ title, slug, body, locked, pinned, tags, poll, extendedData }) {
            return clientFetch('/api/createThread', {
                method: 'POST',
                body: JSON.stringify({ title, slug, body, locked, pinned, tags, poll, extendedData }),
            });
        },
    },

    // Posts
    posts: {
        async create({ body, threadId, parentId, extendedData }) {
            return clientFetch('/api/createPost', {
                method: 'POST',
                body: JSON.stringify({ body, threadId, parentId, extendedData }),
            });
        },
    },

    // Search
    search: {
        async query({ query, type, cursor }) {
            return clientFetch('/api/search', {
                method: 'POST',
                body: JSON.stringify({ query, type, cursor }),
            });
        },
    },
};

export { ClientApiError };
