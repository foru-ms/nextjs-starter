/**
 * Server-side Foru.ms API client
 * This should ONLY be used in getServerSideProps and API routes
 * DO NOT import this in client-side code
 */

class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

/**
 * Base fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
    const url = `${process.env.FORU_MS_API_URL}${endpoint}`;
    
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.FORU_MS_API_KEY,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(
                data.message || 'API request failed',
                response.status,
                data
            );
        }

        return { data, status: response.status };
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            error.message || 'Network error',
            500,
            { error: error.message }
        );
    }
}

/**
 * Server-side Foru.ms API Client
 */
const forumsApi = {
    // Auth endpoints
    auth: {
        async forgotPassword(email) {
            return apiFetch('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });
        },

        async resetPassword(email, password, token) {
            return apiFetch('/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ email, password }),
            });
        },

        async register(username, email, password) {
            return apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
            });
        },

        async login(email, password) {
            return apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ login: email, password }),
            });
        },

        async fetchCurrentUser(token) {
            return apiFetch('/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        },
    },

    // User endpoints
    users: {
        async fetchAll(page = 1) {
            return apiFetch(`/users?page=${page}`, {
                method: 'GET',
            });
        },

        async update(id, username, email, password) {
            return apiFetch(`/user/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ username, email, password }),
            });
        },

        async delete(id) {
            return apiFetch(`/user/${id}`, {
                method: 'DELETE',
            });
        },
    },

    // Thread endpoints
    threads: {
        async fetchAll(page = 1) {
            return apiFetch(`/threads?page=${page}`, {
                method: 'GET',
            });
        },

        async fetchById(id) {
            return apiFetch(`/thread/${id}`, {
                method: 'GET',
            });
        },

        async create(title, body, userId) {
            return apiFetch('/thread', {
                method: 'POST',
                body: JSON.stringify({ title, body, userId }),
            });
        },

        async update(id, title, body) {
            return apiFetch(`/thread/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ title, body }),
            });
        },

        async delete(id) {
            return apiFetch(`/thread/${id}`, {
                method: 'DELETE',
            });
        },

        async fetchPosts(threadId, page = 1) {
            return apiFetch(`/thread/${threadId}/posts?page=${page}`, {
                method: 'GET',
            });
        },
    },

    // Post endpoints
    posts: {
        async fetchAll(page = 1) {
            return apiFetch(`/posts?page=${page}`, {
                method: 'GET',
            });
        },

        async fetchById(id) {
            return apiFetch(`/post/${id}`, {
                method: 'GET',
            });
        },

        async create(body, threadId, userId) {
            return apiFetch('/post', {
                method: 'POST',
                body: JSON.stringify({ body, threadId, userId }),
            });
        },

        async update(id, body) {
            return apiFetch(`/post/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ body }),
            });
        },

        async delete(id) {
            return apiFetch(`/post/${id}`, {
                method: 'DELETE',
            });
        },
    },

    // Search endpoint
    search: {
        async query(query, type, page = 1) {
            return apiFetch(`/search/${query}?type=${type}&page=${page}`, {
                method: 'POST',
            });
        },
    },
};

export { forumsApi, ApiError };
