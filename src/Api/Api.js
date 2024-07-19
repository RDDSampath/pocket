import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
  });

  const postApi = async (postData) => {
    try {
      const response = await api.post('/post/add', postData);
      return response.data;
    } catch (error) {
      throw error;

    }
  };
  const getPostApi = async () => {
    try {
      const response = await api.get('/post/getall');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export default {
    postApi,
    getPostApi,
  };