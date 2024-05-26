import axios, { CreateAxiosDefaults } from "axios";
import { getCurretToken } from "./cookie";
export const axiosConfig: CreateAxiosDefaults = {
  baseURL: "/api",
  headers: {
    Authorization: `Bearer ${getCurretToken()}`,
  },
};

export const apiBase = axios.create(axiosConfig);
