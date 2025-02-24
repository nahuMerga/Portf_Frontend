import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Enable credentials in requests
axios.defaults.withCredentials = true;

// Create Axios instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});

// 🔥 Token Management
export const getToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const getUsername = () => localStorage.getItem('username');

export const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
};

export const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
};

const handleTokenRefresh = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        clearTokens();
        throw new Error("No refresh token available");
    }

    try {
        const response = await axios.post(`${BASE_URL}token/refresh/`, {
            refresh: refreshToken
        });

        if (response.data.access) {
            setTokens(response.data.access, refreshToken);
            return response.data.access;
        }
        throw new Error("No access token in refresh response");
    } catch (error) {
        clearTokens();
        throw error;
    }
};


// 🚀 Request Interceptor (Auto-Attach Token)
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// 🚀 Response Interceptor (Auto-Refresh Token)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 Unauthorized & Token is Expired, Try Refreshing
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await handleTokenRefresh();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}login/`, credentials);

        // ✅ Ensure tokens are stored correctly
        if (response.data.access_token && response.data.refresh_token) {
            setTokens(response.data.access_token, response.data.refresh_token);
            return response.data;
        }

        throw new Error("Invalid response format");
    } catch (error) {
        clearTokens();
        throw error;
    }
};


// 🚀 Register Function
export const register = async (userData) => {
    try {
        const response = await api.post('register/', userData);
        
        // ✅ Ensure tokens are stored correctly
        if (response.data.access_token && response.data.refresh_token) {
            setTokens(response.data.access_token, response.data.refresh_token);
            return response.data;
        }
        
        throw new Error('Invalid response format');
    } catch (error) {
        clearTokens();
        throw error;
    }
};



// apiRequests.js
export const checkIfReactionExists = async (memeId, username) => {
    try {
        const response = await api.get(`meme-reactions/?meme=${memeId}&user=${username}`);
        return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
        console.error("Error checking for existing reaction:", error);
        throw error;
    }
};




export const getMemes = async () => {
    try {
        const response = await api.get('memes/');
        // Return empty array if no data
        return { data: response?.data || [] };
    } catch (error) {
        console.error('Error fetching memes:', error);
        if (error.response?.status === 401) {
            clearTokens();
        }
        // Return empty array on error
        return { data: [] };
    }
};



export const deleteMeme = (id) => api.delete(`memes/${id}/`);
export const updateMeme = (id) => api.delete(`memes/${id}/`);


export const createMemeReaction = async (reactionData) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No authentication token');

        const response = await api.post('meme-reactions/', reactionData);
        return response.data;
    } catch (error) {
        console.error('Error creating meme reaction:', error);
        if (error.response?.status === 401) {
            clearTokens();
        }
        throw error;
    }
};

export const updateMemeReaction = async (reactionId, reactionData) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No authentication token');

        const response = await api.put(`meme-reactions/${reactionId}/`, reactionData);
        return response.data;
    } catch (error) {
        console.error('Error updating meme reaction:', error);
        if (error.response?.status === 401) {
            clearTokens();
        }
        throw error;
    }
};

export const deleteMemeReaction = async (reactionId) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No authentication token');

        await api.delete(`meme-reactions/${reactionId}/`);
        return true;
    } catch (error) {
        console.error('Error deleting meme reaction:', error);
        if (error.response?.status === 401) {
            clearTokens();
        }
        throw error;
    }
};


export const createComment = async (commentData) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No authentication token');

        const username = getUsername();
        if (!username) throw new Error('No username found');

        const response = await api.post('comments/', {
            ...commentData,
            user: username,
            date: new Date().toISOString()
        });
        return response.data;
    } catch (error) {
        console.error('Error creating comment:', error);
        if (error.response?.status === 401) {
            clearTokens();
        }
        throw error;
    }
};

export const updateComment = async (commentId, commentData) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No authentication token');

        const response = await api.patch(`comments/${commentId}/`, {
            ...commentData,
            date: new Date().toISOString()
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            clearTokens();
        }
        throw error;
    }
};

export const deleteComment = async (commentId) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No authentication token');

        const response = await api.delete(`comments/${commentId}/`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            clearTokens();
        }
        throw error;
    }
};


// Data Management APIs
export const getAbout = () => api.get('about/');
export const createAbout = (data) => api.post('about/', data);
export const updateAbout = (id, data) => api.put(`about/${id}/`, data);
export const deleteAbout = (id) => api.delete(`about/${id}/`);

export const getSkills = () => api.get('skills/');
export const createSkill = (data) => api.post('skills/', data);
export const updateSkill = (id, data) => api.put(`skills/${id}/`, data);
export const deleteSkill = (id) => api.delete(`skills/${id}/`);

export const getCertifications = () => api.get('certifications/');
export const createCertification = (data) => api.post('certifications/', data);
export const updateCertification = (id, data) => api.put(`certifications/${id}/`, data);
export const deleteCertification = (id) => api.delete(`certifications/${id}/`);

export const getExperiences = async () => {
    try {
        const response = await api.get('experiences/');
        if (!response.data) {
            return { data: [] };
        }
        return response;
    } catch (error) {
        console.error('Error fetching experiences:', error);
        if (error.response?.status === 401) {
            clearTokens();
        }
        return { data: [] };
    }
};
export const createExperience = (data) => api.post('experiences/', data);
export const updateExperience = (id, data) => api.put(`experiences/${id}/`, data);
export const deleteExperience = (id) => api.delete(`experiences/${id}/`);

export const getProjects = () => api.get('projects/');
export const createProject = (data) => api.post('projects/', data);
export const updateProject = (id, data) => api.put(`projects/${id}/`, data);
export const deleteProject = (id) => api.delete(`projects/${id}/`);

// Contact
export const getContactMe = () => api.get('contact_me/');


// Blogs API
export const getBlogs = () => api.get('blogs/');
export const createBlog = (data) => api.post('blogs/', data);
export const updateBlog = (id, data) => api.put(`blogs/${id}/`, data);
export const deleteBlog = (id) => api.delete(`blogs/${id}/`);

// Users API
export const getUsers = () => api.get('users/');
export const createUser = (data) => api.post('users/', data);
export const updateUser = (id, data) => api.put(`users/${id}/`, data);
export const deleteUser = (id) => api.delete(`users/${id}/`);



export const checkIfReactionExistsB = async (id, username) => {
    try {
        const response = await api.get(`blog-reactions/?blog=${id}&user=${username}`);
        return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
        console.error("Error checking for existing reaction:", error);
        throw error;
    }
};


// Blog Reactions API
export const getBlogReactions = () => api.get('blog-reactions/');
export const createBlogReaction = async (reactionData) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No authentication token');

        const response = await api.post('blog-reactions/', reactionData);
        return response.data;
    } catch (error) {
        console.error('Error creating blog reaction:', error);
        if (error.response?.status === 401) {
            clearTokens();
        }
        throw error;
    }
};

export const updateBlogReaction = async (reactionId, reactionData) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No authentication token');

        const response = await api.put(`blog-reactions/${reactionId}/`, reactionData);
        return response.data;
    } catch (error) {
        console.error('Error updating blog reaction:', error);
        if (error.response?.status === 401) {
            clearTokens();
        }
        throw error;
    }
};

export const deleteBlogReaction = async (reactionId) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No authentication token');

        await api.delete(`blog-reactions/${reactionId}/`);
        return true;
    } catch (error) {
        console.error('Error deleting blog reaction:', error);
        if (error.response?.status === 401) {
            clearTokens();
        }
        throw error;
    }
};
