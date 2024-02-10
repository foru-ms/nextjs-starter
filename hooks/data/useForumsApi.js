import { useCallback } from "react";

const API_KEY = process.env.NEXT_PUBLIC_FORU_MS_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_FORU_MS_API_URL;

const useForumsApi = () => {
    const fetchUsers = useCallback(async (page) => {
        const response = await fetch(`${API_URL}/api/v1/users?page=${page}`, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
            },
        });
        const data = await response.json();
        return data;
    }, []);

    const registerUser = useCallback(async (username, email, password) => {
        const response = await fetch(`${API_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
            },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        return data;
    }, []);

    const loginUser = useCallback(async (email, password) => {
        const response = await fetch(`${API_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
            },
            body: JSON.stringify({ login: email, password }),
        });
        const data = await response.json();
        return data;
    }, []);

    const updateUser = useCallback(async (id, username, email, password) => {
        const response = await fetch(`${API_URL}/api/v1/user/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
            },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        return data;
    }, []);

    const fetchUser = useCallback(async (token) => {
        const response = await fetch(`${API_URL}/api/v1/auth/me`, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return data;
    }, []);

    const deleteUser = useCallback(async (id) => {
        const response = await fetch(`${API_URL}/api/v1/user/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY,
            },
        });
        const data = await response.json();
        return data;
    }, []);

    const fetchThreads = useCallback(async (page = 1) => {
        const response = await fetch(`${API_URL}/api/v1/threads?page=${page}`, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
            },
        });
        const data = await response.json();
        return data;
    }, []);

    const createThread = useCallback(async (title, body, userId) => {
        const response = await fetch(`${API_URL}/api/v1/thread`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
            },
            body: JSON.stringify({ title, body, userId }),
        });
        const data = await response.json();
        return data;
    }, []);

    const fetchThread = useCallback(async (id) => {
        const response = await fetch(`${API_URL}/api/v1/thread/${id}`, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
            },
        });
        const data = await response.json();
        return data;
    }, []);

    const updateThread = useCallback(async (id, title, body) => {
        const response = await fetch(`${API_URL}/api/v1/thread/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
            },
            body: JSON.stringify({ title, body }),
        });
        const data = await response.json();
        return data;
    }, []);

    const deleteThread = useCallback(async (id) => {
        const response = await fetch(`${API_URL}/api/v1/thread/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY,
            },
        });
        const data = await response.json();
        return data;
    }, []);

    const fetchThreadPosts = useCallback(async (threadId, page = 1) => {
        const response = await fetch(`${API_URL}/api/v1/thread/${threadId}/posts?page=${page}`, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
            },
        });
        const data = await response.json();
        return data;
    }, []);

    const fetchPosts = useCallback(async (page = 1) => {
        const response = await fetch(`${API_URL}/api/v1/posts?page=${page}`, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
            },
        });
        const data = await response.json();
        return data;
    }, []);

    const createPost = useCallback(async (body, threadId, userId) => {
        const response = await fetch(`${API_URL}/api/v1/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
            },
            body: JSON.stringify({ body, threadId, userId }),
        });
        const data = await response.json();
        return data;
    }, []);

    const fetchPost = useCallback(async (id) => {
        const response = await fetch(`${API_URL}/api/v1/post/${id}`, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
            },
        });
        const data = await response.json();
        return data;
    }, []);

    const updatePost = useCallback(async (id, body) => {
        const response = await fetch(`${API_URL}/api/v1/post/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
            },
            body: JSON.stringify({ body }),
        });
        const data = await response.json();
        return data;
    }, []);

    const deletePost = useCallback(async (id) => {
        const response = await fetch(`${API_URL}/api/v1/post/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY,
            },
        });
        const data = await response.json();
        return data;
    }, []);

    const search = useCallback(async (query, type, page = 1) => {
        const response = await fetch(`${API_URL}/api/v1/search/${query}?type=${type}&page=${page}`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
            },
        });
        const data = await response.json();
        return data;
    }, []);

    return {
        fetchUsers,
        registerUser,
        loginUser,
        updateUser,
        fetchUser,
        deleteUser,
        fetchThreads,
        createThread,
        fetchThread,
        updateThread,
        deleteThread,
        fetchThreadPosts,
        fetchPosts,
        createPost,
        fetchPost,
        updatePost,
        deletePost,
        search,
    };
};

export default useForumsApi;