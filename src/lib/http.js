import axios from 'axios';

const options = {
  baseURL: 'http://146.186.208.233:8000/api',
  timeout: 1000
};

export default axios.create(options);
