import axios from 'axios';
const BASE_URL = 'http://192.168.1.4:5000';

export const getSubjects = () => axios.get(`${BASE_URL}/subjects`);
export const addSubject = (subject) => axios.post(`${BASE_URL}/subjects`, subject);
export const updateSubject = (id, subject) => axios.put(`${BASE_URL}/subjects/${id}`, subject);
export const deleteSubject = (id) => axios.delete(`${BASE_URL}/subjects/${id}`);
