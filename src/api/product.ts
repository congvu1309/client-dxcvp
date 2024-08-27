import axios from '../lib/axios';

export const getAllProductApi = () => axios.get(`/api/get-all-product`);

export const getProductByIdApi = (productId: number) => axios.get(`/api/get-product-by-id?id=${productId}`);
