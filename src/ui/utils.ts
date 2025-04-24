import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: `https://randomuser.me` 
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})


export const isAuthenticated = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }

    try {
        const response = await axiosInstance.get(`/auth/verify`);
        return response.data.authenticated;
    } catch (error) {
        return false;
    }
}
