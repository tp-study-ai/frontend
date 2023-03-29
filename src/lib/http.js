import axios from 'axios';

const options = {
  baseURL: 'http://109.120.182.154:8000/api/',
  timeout: 1000
};

export default axios.create(options);
