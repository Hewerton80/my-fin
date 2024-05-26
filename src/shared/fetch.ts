import { defaultHead } from "next/head";

type ApiResponse = ResponseInit & { data: any; url: string };
export class ApiError extends Error {
  public response: ApiResponse;
  constructor(message: string, response: ApiResponse) {
    super(message);
    this.response = {
      data: response.data,
      headers: response.headers,
      url: response.url,
      status: response.status,
      statusText: response.statusText,
    };
  }
}

export class Fetch {
  private baseURL: string;
  private headers: HeadersInit;

  constructor(baseUrl: string, headers?: HeadersInit) {
    this.baseURL = baseUrl;
    this.headers = {
      "Content-Type": "application/json",
      ...(headers || {}),
    };
  }

  public async request<T>(url: string, { headers, ...options }: RequestInit) {
    const response = await fetch(this.baseURL + url, {
      ...options,
      headers: { ...this.headers, ...headers },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(`API request failed with status ${response.status}`, {
        data: errorData,
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
    }

    let responseData = await response.json();
    return { data: responseData as T, status: response.status };
  }

  public get<T>(url: string, options?: RequestInit) {
    return this.request<T>(url, { method: "GET", ...options });
  }

  public post<T>(url: string, data: any, options?: RequestInit) {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  }

  public put<T>(url: string, data: any, options?: RequestInit) {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  }

  public delete<T>(url: string, options?: RequestInit) {
    return this.request<T>(url, {
      method: "DELETE",
      ...options,
    });
  }
}
