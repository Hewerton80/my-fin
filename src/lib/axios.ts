import axios, { CreateAxiosDefaults } from "axios";
import { getRequestHeaders } from "@/shared/getRequestHeader";

export const axiosConfig: CreateAxiosDefaults = {
  baseURL: "/api",
  headers: {
    ...getRequestHeaders(),
  },
};

export const apiBase = axios.create(axiosConfig);
