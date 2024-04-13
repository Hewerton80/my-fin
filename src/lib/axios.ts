import axios from "axios";
import { getCurretToken } from "./cookie";

export const apiBase = axios.create({
  baseURL: "/api",
  headers: {
    Authorization: `Bearer ${getCurretToken()}`,
  },
});
