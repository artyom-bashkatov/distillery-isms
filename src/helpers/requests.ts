import { tokenStore } from "helpers/auth";
import Cookies from "js-cookie";

type THeaderRequest = {
  [key: string]: string;
};

const exitFunction = () => {
  alert("Token устарел");
  setTimeout(() => {
    window.location.reload();
  }, 500);
};

export const getRequest = async <T>(url: string): Promise<T | unknown> => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
    method: "GET",
    credentials:
      process.env.NODE_ENV === "development" ? "same-origin" : "include",
    headers: {
      Authorization: `Token ${await (await tokenStore).getToken()}`,
      "X-CSRFToken": `${Cookies.get("csrftoken")}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    await (await tokenStore).removeToken();
    exitFunction();
  }

  return await res.json();
};

export const patchRequest = async <T>(
  url: string,
  requestData: BodyInit | null | undefined | T
): Promise<unknown> => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
    method: "PATCH",
    credentials:
      process.env.NODE_ENV === "development" ? "same-origin" : "include",
    headers: {
      Authorization: `Token ${await (await tokenStore).getToken()}`,
      "X-CSRFToken": `${Cookies.get("csrftoken")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  if (res.status === 401) {
    await (await tokenStore).removeToken();
    exitFunction();
  }

  return await res.json();
};

export const postRequest = async <T>(
  url: string,
  requestData: BodyInit | null | undefined | T | FormData,
  isManualContentType = false
): Promise<unknown> => {
  const headersObject: THeaderRequest = {
    Authorization: `Token ${await (await tokenStore).getToken()}`,
    "X-CSRFToken": `${Cookies.get("csrftoken")}`,
  };

  if (!isManualContentType) {
    headersObject["Content-Type"] = "application/json";
  }

  const res = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
    method: "POST",
    credentials:
      process.env.NODE_ENV === "development" ? "same-origin" : "include",
    headers: headersObject,
    body: isManualContentType
      ? (requestData as BodyInit)
      : JSON.stringify(requestData),
  });

  if (res.status === 401) {
    await (await tokenStore).removeToken();
    exitFunction();
  }

  return await res.json();
};

export const loginRequest = async <T>(
  requestData: BodyInit | null | undefined | T
): Promise<unknown> => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}rest-auth/login/`, {
    method: "POST",
    credentials:
      process.env.NODE_ENV === "development" ? "same-origin" : "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });
  return await res.json();
};
