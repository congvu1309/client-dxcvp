import axios from '@/lib/axios';
import { LoginModel } from '@/models/login';
import { UserModel } from '@/models/user';

export const loginApi = (payload: LoginModel) => axios.post(`/api/log-in-user`, payload, {
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const getMeApi = () => axios.get(`/api/get-me`, {
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

export const logoutApi = (token: any) => axios.post(`/api/logout`, {}, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
    withCredentials: true,
});

export const createNewUser = (payload: UserModel) => axios.post(`/api/create-new-user`, payload);
