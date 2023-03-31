import axios from 'axios';

const options = {
  baseURL: 'http://backend:8000/api',
  timeout: 1000
};

export default axios.create(options);
