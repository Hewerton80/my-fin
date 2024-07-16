import axios, { CreateAxiosDefaults } from "axios";

export const axiosConfig: CreateAxiosDefaults = { baseURL: "/api" };

export const apiBase = axios.create(axiosConfig);
