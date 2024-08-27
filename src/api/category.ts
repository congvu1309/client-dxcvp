import axios from '../lib/axios';

export const getAllCategoryApi = () => axios.get(`/api/get-all-category`);

export const getAllProductByCategoryApi = (categoryId: number) => axios.get(`/api/get-all-product?categoryId=${categoryId}`);
