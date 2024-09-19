import axios from '@/lib/axios';
import { EvaluationModel } from '@/models/evaluation';

export const createNewEvaluation = (payload: EvaluationModel) => axios.post(`/api/create-new-evaluation`, payload);

export const getEvaluation = (productId: number) => axios.get(`/api/get-evaluation?productId=${productId}`);

export const getEvaluationById = (evaluationId: number) => axios.get(`/api/get-evaluation?id=${evaluationId}`);

export const updateEvaluation = (payload: EvaluationModel) => axios.post(`/api/update-evaluation`, payload);


