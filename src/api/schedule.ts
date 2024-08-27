import axios from '@/lib/axios';
import { ScheduleModel } from '@/models/schedule';

export const createNewSchedule = (payload: ScheduleModel) => axios.post(`/api/create-new-schedule`, payload);

export const getAllScheduleByUserId = (userId: number) => axios.get(`/api/get-all-schedule-by-userId?userId=${userId}`);

