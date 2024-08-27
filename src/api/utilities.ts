import axios from '../lib/axios';

export const getAllUtilitiesApi = () => axios.get(`/api/get-all-utilities`);
