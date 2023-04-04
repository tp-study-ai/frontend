import axios from 'axios';

const options = {
  baseURL: 'https://study-ai.ru/api',
  timeout: 10_000
};

const axiosInstance = axios.create(options)

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const event = new CustomEvent(
      'show:snackbar',
      { detail: { text: 'При выполнении запроса произошла ошибка', color: 'error' }}
    );
    document.dispatchEvent(event);

    return Promise.reject(error);
  }
);

export default axiosInstance;
