import axios from "axios";
import { Cookies } from "react-cookie";

const Cookie = new Cookies();

const saveAccessToken = (accessToken: any) => {
  Cookie.set("access_token", accessToken);
};

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  timeout: 5000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Call your "/refreshToken" API
      return axios
        .post(
          "/auth/refreshToken",
          {},
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          saveAccessToken(response.data.access_token);

          originalRequest.headers["Authorization"] =
            "Bearer " + response.data.accessToken;

          return axios(originalRequest);
        });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
