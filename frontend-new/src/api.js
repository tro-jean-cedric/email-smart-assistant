import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

export const getEmails = async () => {
    const { data } = await api.get('/emails');
    return data;
};

export const syncEmails = async () => {
    const { data } = await api.post('/emails/sync');
    return data;
};

export default api;
