import axios from "axios";

export const instance = axios.create({
  baseURL: "/api",
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetcher = (url: string) =>
  instance.get(url).then((res) => res.data);
