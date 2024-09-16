import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const instance = axios.create({
    baseURL: BACKEND_URL,
});

instance.interceptors.response.use(
    (response) => {
        const { data } = response;

        return data;
    },
    (error) => {
        return new Error(error);
    }
);

export default instance;