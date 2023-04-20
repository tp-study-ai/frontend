import axios from 'axios';

const options = {
  baseURL: 'https://study-ai.ru/api',
  withCredentials: true
};

const axiosInstance = axios.create(options);
const IGNORED_URLS = ['/get_user', '/calendar'];

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
    let event;
    if (error.response?.data?.error) {
      if (IGNORED_URLS.includes(error.config.url)) {
        return Promise.reject(error);
      }

      event = new CustomEvent(
        'show:snackbar',
        { detail: { text: error.response.data.error, color: 'warning' } }
      );
      document.dispatchEvent(event);
    } else {
      event = new CustomEvent(
        'show:snackbar',
        { detail: { text: 'При выполнении запроса произошла неизвестная ошибка', color: 'error' } }
      );
    }

    document.dispatchEvent(event);
    return Promise.reject(error);
  }
);

export default axiosInstance;
