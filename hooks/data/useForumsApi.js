const useForumsApi = () => {
    const fetchUsers = async (page) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/users?page=${page}`, {
            method: 'GET',
            headers: {
                'x-api-key': process.env.FORU_MS_API_KEY,
            },
        });
        const data = await response.json();
        return data;
    };

    const registerUser = async (username, email, password) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.FORU_MS_API_KEY,
            },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        return data;
    };

    const loginUser = async (email, password) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.FORU_MS_API_KEY,
            },
            body: JSON.stringify({ login: email, password }),
        });
        const data = await response.json();
        console.log('loginUser data:', data);
        return data;
    };

    const updateUser = async (id, username, email, password) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/user/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.FORU_MS_API_KEY,
            },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        return data;
    };

    const fetchUser = async (token) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/auth/me`, {
            method: 'GET',
            headers: {
                'x-api-key': process.env.FORU_MS_API_KEY,
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return data;
    };

    const deleteUser = async (id) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/user/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': process.env.FORU_MS_API_KEY,
            },
        });
        const data = await response.json();
        return data;
    };

    const fetchThreads = async (page = 1) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/threads?page=${page}`, {
            method: 'GET',
            headers: {
                'x-api-key': process.env.FORU_MS_API_KEY,
            },
        });
        const data = await response.json();
        return data;
    };

    const createThread = async (title, body, userId) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/thread`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.FORU_MS_API_KEY,
            },
            body: JSON.stringify({ title, body, userId }),
        });
        const data = await response.json();
        return data;
    };

    const fetchThread = async (id) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/thread/${id}`, {
            method: 'GET',
            headers: {
                'x-api-key': process.env.FORU_MS_API_KEY,
            },
        });
        const data = await response.json();
        return data;
    };

    const updateThread = async (id, title, body) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/thread/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.FORU_MS_API_KEY,
            },
            body: JSON.stringify({ title, body }),
        });
        const data = await response.json();
        return data;
    };

    const deleteThread = async (id) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/thread/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': process.env.FORU_MS_API_KEY,
            },
        });
        const data = await response.json();
        return data;
    };

    const fetchThreadPosts = async (threadId, page = 1) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/thread/${threadId}/posts?page=${page}`, {
            method: 'GET',
            headers: {
                'x-api-key': process.env.FORU_MS_API_KEY,
            },
        });
        const data = await response.json();
        return data;
    };

    const fetchPosts = async (page = 1) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/posts?page=${page}`, {
            method: 'GET',
            headers: {
                'x-api-key': process.env.FORU_MS_API_KEY,
            },
        });
        const data = await response.json();
        return data;
    };

    const createPost = async (body, threadId, userId) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.FORU_MS_API_KEY,
            },
            body: JSON.stringify({ body, threadId, userId }),
        });
        const data = await response.json();
        return data;
    };

    const fetchPost = async (id) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/post/${id}`, {
            method: 'GET',
            headers: {
                'x-api-key': process.env.FORU_MS_API_KEY,
            },
        });
        const data = await response.json();
        return data;
    };

    const updatePost = async (id, body) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/post/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.FORU_MS_API_KEY,
            },
            body: JSON.stringify({ body }),
        });
        const data = await response.json();
        return data;
    };

    const deletePost = async (id) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/post/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': process.env.FORU_MS_API_KEY,
            },
        });
        const data = await response.json();
        return data;
    };

    const search = async (query, type, page = 1) => {
        const response = await fetch(`${process.env.FORU_MS_API_URL}/api/v1/search/${query}?type=${type}&page=${page}`, {
            method: 'POST',
            headers: {
                'x-api-key': process.env.FORU_MS_API_KEY,
            },
        });
        const data = await response.json();
        return data;
    };

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