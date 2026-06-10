import axios from "axios";
import { baseURL } from "./_urls";

const axiosApi = axios.create({
  baseURL,
});
const handleLogout = () => {
  localStorage.clear();
  window.location.href = "/";
};
axiosApi.interceptors.request.use(async function (configurations: any) {
  const accessToken = localStorage.getItem("token");
  if (
    accessToken &&
    accessToken !== "undefined" &&
    accessToken !== null &&
    accessToken !== undefined
  ) {
    if (configurations.headers) {
      configurations.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  // add loader
  if (!configurations.headers[`noLoader`]) {
    document.body.classList.add("loading-indicator");
  }

  return configurations;
});
axiosApi.interceptors.response.use(
  function (response) {
    // remove loader
    document.body.classList.remove("loading-indicator");
    return response;
  },
  function (error) {
    document.body.classList.remove("loading-indicator");
    if (
      (!error.response && error.code !== "ERR_NETWORK") ||
      error.response.status === 401
    ) {
      handleLogout();
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  },
);

export const getApi = async (url: string, customHeaders?: any) => {
  try {
    const result = await axiosApi.get(`${url}`, customHeaders);
    return {
      status: result.status,
      body: result.data,
    };
  } catch (err: any) {
    const result = err.response;
    return { status: result.status, body: result.data };
  }
};

export const putApi = async (
  url: string,
  request: any,
  customHeaders?: any,
) => {
  try {
    const result = await axiosApi.put(`${url}`, request, customHeaders);
    if (result.status >= 400 && result.status <= 599) {
    }
    return {
      status: result.status,
      body: result.data,
    };
  } catch (err: any) {
    const result = err.response;
    return { status: result.status, body: result.data };
  }
};

export const deleteApi = async (url: string, customHeaders?: any) => {
  try {
    const result = await axiosApi.delete(`${url}`, customHeaders);
    return {
      status: result.status,
      body: result.data,
    };
  } catch (err: any) {
    const result = err.response;
    return { status: result.status, body: result.data };
  }
};

export const postApi = async (url: string, request: any, headers?: any) => {
  try {
    const result = await axiosApi.post(`${url}`, request, headers);
    if (!result) {
      return { status: 400, body: "Something Went Wrong!!" };
    }
    return {
      status: result.status,
      body: result.data,
    };
  } catch (err: any) {
    const result = err.response;
    return { status: result.status, body: result.data };
  }
};

export const patchApi = async (
  url: string,
  request: any,
  customHeaders?: any,
) => {
  try {
    const result = await axiosApi.patch(`${url}`, request, customHeaders);
    if (!result) {
      return;
    }
    if (result.status >= 400 && result.status <= 599) {
      // store.dispatch(handleResponse({ status: result.status, msg: "Something Went Wrong!!", isEnabled: true, type: "error"}  as any));
    }
    return {
      status: result.status,
      body: result.data,
    };
  } catch (err: any) {
    const result = err.response;
    return { status: result.status, body: result.data };
  }
};
export interface IApiResponse {
  status: number | string;
  body: any;
}
export { axiosApi };
