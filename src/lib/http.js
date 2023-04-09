import axios from 'axios';

const options = {
  baseURL: 'https://study-ai.ru/api',
  timeout: 5_000,
  withCredentials: true
};

const axiosInstance = axios.create(options);
const IGNORED_URLS = ['/get_user'];

axiosInstance.interceptors.response.use(
  function (response) {
    if (!response.data.error || IGNORED_URLS.includes(response.config.url)) {
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
