import axios from 'axios';

const options = {
  baseURL: 'https://study-ai.ru/api',
  timeout: 5_000
};

const axiosInstance = axios.create(options)

axiosInstance.interceptors.response.use(
  function (response) {
    if (!response.data.error) {
      return response;
    }

    const event = new CustomEvent(
      'show:snackbar',
      { detail: { text: response.data.error, color: 'warning' } }
    );
    document.dispatchEvent(event);

    return Promise.reject(response);
  },
  function (error) {
    const event = new CustomEvent(
      'show:snackbar',
      { detail: { text: 'При выполнении запроса произошла неизвестная ошибка', color: 'error' }}
    );
    document.dispatchEvent(event);

    return Promise.reject(error);
  }
);

export default axiosInstance;
