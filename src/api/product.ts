import axios from '../lib/axios';

export const getAllProductApi = (pageNumber: number) => axios.get(`/api/get-all-product?page=${pageNumber}`);

export const getProductByIdApi = (productId: number) => axios.get(`/api/get-product-by-id?id=${productId}`);

export const getAllProductByAddressApi = (address: any) => axios.get(`/api/get-all-product?address=${address}`);


