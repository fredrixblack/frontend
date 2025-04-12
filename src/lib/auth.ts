import axios from 'axios';
import { Tokens, User } from '@/types';


// Create an axios instance with base URL
const api = axios.create({
    baseURL: '/api/auth', // This will route through our Next.js API routes
    headers: {
        'Content-Type': 'application/json',
    },
});


// Type definitions
export interface LoginResponse {
    message: string;
    user: User;
    tokens: Tokens;
}

export interface RegisterResponse {
    message: string;
    user: User;
    error: string | null | undefined
    errors: {
        type: string,
        msg: string,
        path: string,
        location: string
    }[]
}

// Auth functions
export async function login(email: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> {
    try {
        const response = await api.post<LoginResponse>('/login', {
            email,
            password,
            rememberMe,
        });

        // Store tokens in localStorage or sessionStorage based on rememberMe
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('access_token', response.data.tokens.access);
        storage.setItem('refresh_token', response.data.tokens.refresh);
        storage.setItem('user', JSON.stringify(response.data.user));

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function register(email: string, password: string): Promise<RegisterResponse> {
    try {
        const response = await api.post<RegisterResponse>('/register', {
            email,
            password,
        });

        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

export async function logout(): Promise<void> {
    try {
        const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');

        if (refreshToken) {
            await api.post('/logout', { refreshToken });
        }

        // Clear storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('user');
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

export async function logoutAll(): Promise<void> {
    try {
        const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

        if (accessToken) {
            await api.post('/logout-all', {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }

        // Clear storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('user');
    } catch (error) {
        console.error('Logout all error:', error);
        throw error;
    }
}

export async function getProfile(): Promise<User> {
    try {
        const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

        if (!accessToken) {
            throw new Error('No access token found');
        }

        const response = await api.get('/profile', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data.user;
    } catch (error) {
        console.error('Get profile error:', error);
        throw error;
    }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
        const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

        if (!accessToken) {
            throw new Error('No access token found');
        }

        await api.put('/change-password',
            { currentPassword, newPassword },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
    } catch (error) {
        console.error('Change password error:', error);
        throw error;
    }
}

export async function updateProfile(email: string): Promise<User> {
    try {
        const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

        if (!accessToken) {
            throw new Error('No access token found');
        }

        const response = await api.put('/profile',
            { email },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Update stored user
        const updatedUser = response.data.user;
        const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
        const newUserData = { ...storedUser, ...updatedUser };

        if (localStorage.getItem('user')) {
            localStorage.setItem('user', JSON.stringify(newUserData));
        }
        if (sessionStorage.getItem('user')) {
            sessionStorage.setItem('user', JSON.stringify(newUserData));
        }

        return updatedUser;
    } catch (error) {
        console.error('Update profile error:', error);
        throw error;
    }
}

export async function getActiveSessions(): Promise<unknown[]> {
    try {
        const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

        if (!accessToken) {
            throw new Error('No access token found');
        }

        const response = await api.get('/active-sessions', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data.sessions;
    } catch (error) {
        console.error('Get active sessions error:', error);
        throw error;
    }
}

export async function revokeSession(sessionId: string): Promise<void> {
    try {
        const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

        if (!accessToken) {
            throw new Error('No access token found');
        }

        await api.delete(`/sessions/${sessionId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } catch (error) {
        console.error('Revoke session error:', error);
        throw error;
    }
}

// Auth helper functions
export function isAuthenticated(): boolean {
    return !!(localStorage.getItem('access_token') || sessionStorage.getItem('access_token'));
}

export function getCurrentUser(): User | null {
    const userString = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userString) return null;

    try {
        return JSON.parse(userString);
    } catch (e) {
        console.error('Error parsing user from storage', e);
        return null;
    }
}

// Add token refresh interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and not a retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');

                if (!refreshToken) {
                    throw new Error('No refresh token found');
                }

                // Attempt to refresh the token
                const response = await api.post('/refresh-token', { refreshToken });
                const tokens = response.data.tokens;

                // Store the new tokens
                if (localStorage.getItem('access_token')) {
                    localStorage.setItem('access_token', tokens.access);
                    localStorage.setItem('refresh_token', tokens.refresh);
                }
                if (sessionStorage.getItem('access_token')) {
                    sessionStorage.setItem('access_token', tokens.access);
                    sessionStorage.setItem('refresh_token', tokens.refresh);
                }

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${tokens.access}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, log out the user
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                sessionStorage.removeItem('access_token');
                sessionStorage.removeItem('refresh_token');
                sessionStorage.removeItem('user');

                // Redirect to login page if in browser context
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;