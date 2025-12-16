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

        async resetPassword({ email, password, oldPassword }) {
            return apiFetch('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ email, password, oldPassword }),
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
        async fetchAll({ query, filter, cursor } = {}) {
            const params = new URLSearchParams();
            if (query) params.set('query', query);
            if (filter) params.set('filter', filter);
            if (cursor) params.set('cursor', cursor);
            const qs = params.toString() ? `?${params.toString()}` : '';
            return apiFetch(`/users${qs}`, { method: 'GET' });
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
        async fetchAll({ query, tagId, filter, type, cursor, userId } = {}) {
            const params = new URLSearchParams();
            if (query) params.set('query', query);
            if (tagId) params.set('tagId', tagId);
            if (filter) params.set('filter', filter);
            if (type) params.set('type', type);
            if (cursor) params.set('cursor', cursor);
            if (userId) params.set('userId', userId);
            const qs = params.toString() ? `?${params.toString()}` : '';
            return apiFetch(`/threads${qs}`, { method: 'GET' });
        },

        async fetchById(id) {
            return apiFetch(`/thread/${id}`, {
                method: 'GET',
            });
        },

        async create({ title, slug, body, locked, pinned, tags, poll, extendedData }) {
            return apiFetch('/thread', {
                method: 'POST',
                body: JSON.stringify({ title, slug, body, locked, pinned, tags, poll, extendedData }),
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

        async fetchPosts(threadId, { query, cursor, filter } = {}) {
            const params = new URLSearchParams();
            if (query) params.set('query', query);
            if (cursor) params.set('cursor', cursor);
            if (filter) params.set('filter', filter);
            const qs = params.toString() ? `?${params.toString()}` : '';
            return apiFetch(`/thread/${threadId}/posts${qs}`, { method: 'GET' });
        },
    },

    // Post endpoints
    posts: {
        async fetchAll({ query, filter, type, cursor, userId } = {}) {
            const params = new URLSearchParams();
            if (query) params.set('query', query);
            if (filter) params.set('filter', filter);
            if (type) params.set('type', type);
            if (cursor) params.set('cursor', cursor);
            if (userId) params.set('userId', userId);
            const qs = params.toString() ? `?${params.toString()}` : '';
            return apiFetch(`/posts${qs}`, { method: 'GET' });
        },

        async fetchById(id) {
            return apiFetch(`/post/${id}`, {
                method: 'GET',
            });
        },

        async create({ body, threadId, parentId, extendedData }) {
            return apiFetch('/post', {
                method: 'POST',
                body: JSON.stringify({ body, threadId, parentId, extendedData }),
            });
        },

        async update(id, { body, extendedData }) {
            return apiFetch(`/post/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ body, extendedData }),
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
        async query({ query, type, cursor }) {
            const params = new URLSearchParams();
            if (query) params.set('query', query);
            if (type) params.set('type', type);
            if (cursor) params.set('cursor', cursor);
            const qs = params.toString() ? `?${params.toString()}` : '';
            return apiFetch(`/search${qs}`, { method: 'GET' });
        },
    },

    // Roles
    roles: {
        async list({ filter } = {}) {
            const params = new URLSearchParams();
            if (filter) params.set('filter', filter);
            const qs = params.toString() ? `?${params.toString()}` : '';
            return apiFetch(`/roles${qs}`, { method: 'GET' });
        },
        async get(id) {
            return apiFetch(`/role/${id}`, { method: 'GET' });
        },
        async create({ name, description, color, extendedData }) {
            return apiFetch('/role', {
                method: 'POST',
                body: JSON.stringify({ name, description, color, extendedData }),
            });
        },
        async update(id, { name, description, color, extendedData }) {
            return apiFetch(`/role/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ name, description, color, extendedData }),
            });
        },
        async delete(id) {
            return apiFetch(`/role/${id}`, { method: 'DELETE' });
        },
    },

    // Tags
    tags: {
        async list({ query, cursor } = {}) {
            const params = new URLSearchParams();
            if (query) params.set('query', query);
            if (cursor) params.set('cursor', cursor);
            const qs = params.toString() ? `?${params.toString()}` : '';
            return apiFetch(`/tags${qs}`, { method: 'GET' });
        },
        async listSubscribed({ userId, query, cursor }) {
            const params = new URLSearchParams();
            if (userId) params.set('userId', userId);
            if (query) params.set('query', query);
            if (cursor) params.set('cursor', cursor);
            const qs = params.toString() ? `?${params.toString()}` : '';
            return apiFetch(`/tags/subscribed${qs}`, { method: 'GET' });
        },
        async get(id, { userId } = {}) {
            const params = new URLSearchParams();
            if (userId) params.set('userId', userId);
            const qs = params.toString() ? `?${params.toString()}` : '';
            return apiFetch(`/tag/${id}${qs}`, { method: 'GET' });
        },
        async create({ name, description, color, extendedData }) {
            return apiFetch('/tag', {
                method: 'POST',
                body: JSON.stringify({ name, description, color, extendedData }),
            });
        },
        async update(id, { name, description, color, extendedData }) {
            return apiFetch(`/tag/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ name, description, color, extendedData }),
            });
        },
        async delete(id) {
            return apiFetch(`/tag/${id}`, { method: 'DELETE' });
        },
        async subscribe(id, { userId }) {
            return apiFetch(`/tag/${id}/subscribers`, {
                method: 'POST',
                body: JSON.stringify({ userId }),
            });
        },
        async unsubscribe(id, { userId }) {
            const params = new URLSearchParams();
            if (userId) params.set('userId', userId);
            const qs = params.toString() ? `?${params.toString()}` : '';
            return apiFetch(`/tag/${id}/subscribers${qs}`, { method: 'DELETE' });
        },
    },

    // Thread interactions
    threadInteractions: {
        async like(id, { extendedData } = {}) {
            return apiFetch(`/thread/${id}/likes`, {
                method: 'POST',
                body: JSON.stringify({ extendedData }),
            });
        },
        async unlike(id) {
            return apiFetch(`/thread/${id}/likes`, { method: 'DELETE' });
        },
        async dislike(id, { extendedData } = {}) {
            return apiFetch(`/thread/${id}/dislikes`, {
                method: 'POST',
                body: JSON.stringify({ extendedData }),
            });
        },
        async undislike(id) {
            return apiFetch(`/thread/${id}/dislikes`, { method: 'DELETE' });
        },
        async upvote(id, { extendedData } = {}) {
            return apiFetch(`/thread/${id}/upvotes`, {
                method: 'POST',
                body: JSON.stringify({ extendedData }),
            });
        },
        async unupvote(id) {
            return apiFetch(`/thread/${id}/upvotes`, { method: 'DELETE' });
        },
        async downvote(id, { extendedData } = {}) {
            return apiFetch(`/thread/${id}/downvotes`, {
                method: 'POST',
                body: JSON.stringify({ extendedData }),
            });
        },
        async undownvote(id) {
            return apiFetch(`/thread/${id}/downvotes`, { method: 'DELETE' });
        },
        async subscribe(id, { extendedData } = {}) {
            return apiFetch(`/thread/${id}/subscribers`, {
                method: 'POST',
                body: JSON.stringify({ extendedData }),
            });
        },
        async unsubscribe(id, { userId } = {}) {
            const params = new URLSearchParams();
            if (userId) params.set('userId', userId);
            const qs = params.toString() ? `?${params.toString()}` : '';
            return apiFetch(`/thread/${id}/subscribers${qs}`, { method: 'DELETE' });
        },
    },

    // Polls
    polls: {
        async create(threadId, { title, expiresAt, options, extendedData }) {
            return apiFetch(`/thread/${threadId}/poll`, {
                method: 'POST',
                body: JSON.stringify({ title, expiresAt, options, extendedData }),
            });
        },
        async update(threadId, { title, expiresAt, closed, options, extendedData }) {
            return apiFetch(`/thread/${threadId}/poll`, {
                method: 'PUT',
                body: JSON.stringify({ title, expiresAt, closed, options, extendedData }),
            });
        },
        async delete(threadId) {
            return apiFetch(`/thread/${threadId}/poll`, { method: 'DELETE' });
        },
        async get(threadId) {
            return apiFetch(`/thread/${threadId}/poll`, { method: 'GET' });
        },
        async getResults(threadId) {
            return apiFetch(`/thread/${threadId}/poll/results`, { method: 'GET' });
        },
        async vote(threadId, { optionId }) {
            return apiFetch(`/threads/${threadId}/poll/votes`, {
                method: 'POST',
                body: JSON.stringify({ optionId }),
            });
        },
        async upsertVote(threadId, { optionId }) {
            return apiFetch(`/threads/${threadId}/poll/votes`, {
                method: 'PUT',
                body: JSON.stringify({ optionId }),
            });
        },
        async deleteVote(threadId) {
            return apiFetch(`/threads/${threadId}/poll/votes`, { method: 'DELETE' });
        },
    },

    // Notifications
    notification: {
        async create(payload) {
            return apiFetch('/notification', { method: 'POST', body: JSON.stringify(payload) });
        },
        async update(id, { read }) {
            return apiFetch(`/notification/${id}`, { method: 'PATCH', body: JSON.stringify({ read }) });
        },
        async delete(id) {
            return apiFetch(`/notification/${id}`, { method: 'DELETE' });
        },
        async get(id) {
            return apiFetch(`/notification/${id}`, { method: 'GET' });
        },
    },
    notifications: {
        async list({ userId, read, filter, cursor } = {}) {
            const params = new URLSearchParams();
            if (userId) params.set('userId', userId);
            if (read !== undefined) params.set('read', String(read));
            if (filter) params.set('filter', filter);
            if (cursor) params.set('cursor', cursor);
            const qs = params.toString() ? `?${params.toString()}` : '';
            return apiFetch(`/notifications${qs}`, { method: 'GET' });
        },
        async bulkUpdate({ userId, read }) {
            return apiFetch('/notifications', { method: 'PATCH', body: JSON.stringify({ userId, read }) });
        },
    },

    // Reports
    report: {
        async create(payload) {
            return apiFetch('/report', { method: 'POST', body: JSON.stringify(payload) });
        },
        async update(id, payload) {
            return apiFetch(`/report/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
        },
        async patch(id, { read }) {
            return apiFetch(`/report/${id}`, { method: 'PATCH', body: JSON.stringify({ read }) });
        },
        async delete(id) {
            return apiFetch(`/report/${id}`, { method: 'DELETE' });
        },
        async get(id) {
            return apiFetch(`/report/${id}`, { method: 'GET' });
        },
    },
    reports: {
        async list({ reporterId, reportedId, read, cursor, filter } = {}) {
            const params = new URLSearchParams();
            if (reporterId) params.set('reporterId', reporterId);
            if (reportedId) params.set('reportedId', reportedId);
            if (read !== undefined) params.set('read', String(read));
            if (cursor) params.set('cursor', cursor);
            if (filter) params.set('filter', filter);
            const qs = params.toString() ? `?${params.toString()}` : '';
            return apiFetch(`/reports${qs}`, { method: 'GET' });
        },
        async bulkUpdate({ reportIds, read }) {
            return apiFetch('/reports', { method: 'PATCH', body: JSON.stringify({ reportIds, read }) });
        },
    },

    // Users follow
    follows: {
        async add(userId, { extendedData } = {}) {
            return apiFetch(`/user/${userId}/followers`, { method: 'POST', body: JSON.stringify({ extendedData }) });
        },
        async remove(userId) {
            return apiFetch(`/user/${userId}/followers`, { method: 'DELETE' });
        },
        async getFollowers(userId, { query, cursor } = {}) {
            const params = new URLSearchParams();
            if (query) params.set('query', query);
            if (cursor) params.set('cursor', cursor);
            const qs = params.toString() ? `?${params.toString()}` : '';
            return apiFetch(`/user/${userId}/followers${qs}`, { method: 'GET' });
        },
        async getFollowing(userId, { query, cursor, filter } = {}) {
            const params = new URLSearchParams();
            if (query) params.set('query', query);
            if (cursor) params.set('cursor', cursor);
            if (filter) params.set('filter', filter);
            const qs = params.toString() ? `?${params.toString()}` : '';
            return apiFetch(`/user/${userId}/following${qs}`, { method: 'GET' });
        },
    },

    // Webhooks
    webhooks: {
        async create({ name, url, events }) {
            return apiFetch('/webhooks', { method: 'POST', body: JSON.stringify({ name, url, events }) });
        },
        async list() {
            return apiFetch('/webhooks', { method: 'GET' });
        },
        async update(id, payload) {
            return apiFetch(`/webhooks/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
        },
        async delete(id) {
            return apiFetch(`/webhooks/${id}`, { method: 'DELETE' });
        },
        async get(id) {
            return apiFetch(`/webhooks/${id}`, { method: 'GET' });
        },
        async deliveries(id, { cursor } = {}) {
            const params = new URLSearchParams();
            if (cursor) params.set('cursor', cursor);
            const qs = params.toString() ? `?${params.toString()}` : '';
            return apiFetch(`/webhooks/${id}/deliveries${qs}`, { method: 'GET' });
        },
    },

    // Integrations
    integrations: {
        async create({ type, name, config }) {
            return apiFetch('/integrations', { method: 'POST', body: JSON.stringify({ type, name, config }) });
        },
        async list() {
            return apiFetch('/integrations', { method: 'GET' });
        },
        async delete(id) {
            return apiFetch(`/integrations/${id}`, { method: 'DELETE' });
        },
        async get(id) {
            return apiFetch(`/integrations/${id}`, { method: 'GET' });
        },
        async oauthAuthorize(provider) {
            // This returns a 302 redirect typically; handled by server-side
            return apiFetch(`/integrations/oauth/${provider}/authorize`, { method: 'GET' });
        },
        async oauthCallback(provider, { code, state }) {
            const params = new URLSearchParams({ code, state });
            return apiFetch(`/integrations/oauth/${provider}/callback?${params.toString()}`, { method: 'GET' });
        },
        async test({ integrationId }) {
            return apiFetch('/integrations/test', { method: 'POST', body: JSON.stringify({ integrationId }) });
        },
    },

    // SSO
    sso: {
        async create({ provider, domain, config }) {
            return apiFetch('/sso', { method: 'POST', body: JSON.stringify({ provider, domain, config }) });
        },
        async list() {
            return apiFetch('/sso', { method: 'GET' });
        },
        async delete(id) {
            return apiFetch(`/sso/${id}`, { method: 'DELETE' });
        },
    },
};

export { forumsApi, ApiError };
