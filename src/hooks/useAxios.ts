"use client";
import axios from "axios";
import { useMemo } from "react";
import { axiosConfig } from "@/lib/axios";

export const useAxios = () => {
  const apiBase = useMemo(() => axios.create(axiosConfig), []);
  return { apiBase };
};
