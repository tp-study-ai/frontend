import axios from 'axios';

const options = {
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 1000
};

export default axios.create(options);
