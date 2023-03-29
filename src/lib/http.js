import axios from 'axios';

const options = {
  baseURL: 'http://109.120.182.154:8001/api/',
  timeout: 1000
};

export default axios.create(options);
