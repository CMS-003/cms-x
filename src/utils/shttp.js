import axios from 'axios';
import store from '../store';

const shttp = axios.create({
  baseURL: store.app.baseURL,
  withCredentials: false,
  timeout: 20000,
});

shttp.interceptors.request.use(
  (config) => {
    if (store.app.debug) {
      console.log(`${config.method} ${config.url}`);
    }
    config.headers['x-project-id'] = APP;
    config.headers['Authorization'] = 'Bearer ' + store.user.access_token;
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
    const body = response.data;
    // 干点什么
    if (body.code !== 0) {
      if (
        body.code === 101010 &&
        response.config.url !==
        response.config.baseURL + '/gw/user/oauth/user/refresh'
      ) {
        store.user.setAccessToken('')
        new Promise(async (resolve) => {
          const result = await axios.post(`${store.app.baseURL}/gw/user/oauth/refresh`, null, {
            headers: { authorization: store.user.refresh_token, }
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
        }).then(resp => {

        });
      } else {
        // Modal.alert('请求失败', res.message);
        // throw new Error(body.message || '失败')
      }
    }
    return body;
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
