import axios from 'axios';

const options = {
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 1000,
  withCredentials: true
};

export default axios.create(options);
