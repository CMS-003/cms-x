import axios from 'axios';
import store from '../store';
import Config from '../config';
import services from '../services';

const shttp = axios.create({
  baseURL: '',
  withCredentials: false,
  timeout: 20000,
});

shttp.interceptors.request.use(
  (config) => {
    if (store.app.debug) {
      console.log(`${config.method} ${config.url}`);
    }
    config.headers['Authorization'] = store.user.access_token;
    return config;
  },
  (error) => {
    console.log(error, 'request error');
    return Promise.resolve(error);
  },
);

shttp.interceptors.response.use(
  (response) => {
    if (store.app.debug) {
      console.log(response.status, response.data);
    }
    const res = response.data;
    // 干点什么
    if (res.code !== 0) {
      if (
        res.code === 10110 &&
        response.config.url !==
        response.config.baseURL + '/v1/auth/user/refresh'
      ) {
        store.user.setAccessToken('')
        return new Promise(async (resolve) => {
          const result = await services.refresh({
            authorization: store.user.refresh_token,
          });
          if (result && result.data) {
            store.user.setAccessToken(result.data.token);
            store.user.setAccessToken(result.data.refresh_token);
            response.config.headers['Authorization'] = result.data.token;
            response.config.try = true;
            const newResult = await shttp(response.config);
            resolve(newResult);
          } else {
            resolve({});
          }
        });
      } else {
        // Modal.alert('请求失败', res.message);
      }
    }
    return res;
  },
  (error) => {
    console.log(error, 'response error');
    if (error.response) {
      if (error.response.data.code === 101020) {
        store.user.setAccessToken('');
      }
    } else {
    }
    return Promise.reject(error);
  },
);

export default shttp;
