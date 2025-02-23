import axios, { ResponseType } from "axios";

interface RequestConfigs {
  params?: Record<string, unknown>;
  responseType?: ResponseType;
}

export abstract class AbstractService {
  private static readonly api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  constructor(private readonly rootPath: string) {
    AbstractService.api.interceptors.request.use(
      (config) => {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    AbstractService.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error("Unauthorized! Redirect to login?");
        }
        return Promise.reject(error);
      }
    );
  }

  private buildPath(path?: string) {
    return this.rootPath + (path ?? "");
  }

  protected async GET<T = unknown>(
    path: string,
    params?: RequestConfigs["params"]
  ): Promise<T> {
    return (await AbstractService.api.get(this.buildPath(path), { params }))
      .data;
  }

  protected async POST<T = unknown>(
    path: string,
    body: unknown,
    configs?: RequestConfigs
  ): Promise<T> {
    return (await AbstractService.api.post(this.buildPath(path), body, configs))
      .data;
  }

  protected async PUT<T = unknown>(
    path: string,
    body: unknown,
    configs?: RequestConfigs
  ): Promise<T> {
    return (await AbstractService.api.put(this.buildPath(path), body, configs))
      .data;
  }

  protected async DELETE(
    path: string,
    params?: RequestConfigs["params"]
  ): Promise<void> {
    await AbstractService.api.delete(this.buildPath(path), { params });
  }
}
