import axios from 'axios';

const options = {
  baseURL: 'https://study-ai.ru/api',
  timeout: 1000
};

export default axios.create(options);
