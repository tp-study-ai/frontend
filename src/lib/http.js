import axios from 'axios';

const options = {
  baseURL: 'https://study-ai.tu/api',
  timeout: 1000
};

export default axios.create(options);
