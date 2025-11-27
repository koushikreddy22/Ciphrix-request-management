
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const getAuthToken = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).token : null;
};

const api = {
    get: async (endpoint: string) => {
        const token = getAuthToken();
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token || '',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    },
    post: async (endpoint: string, data: any) => {
        const token = getAuthToken();
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token || '',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    },
    put: async (endpoint: string, data: any) => {
        const token = getAuthToken();
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token || '',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    },
};

export default api;
