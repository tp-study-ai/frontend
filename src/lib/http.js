import axios from 'axios';

const options = {
  baseURL: 'http://146.185.208.233:8001/api/',
  timeout: 1000
};

export default axios.create(options);
