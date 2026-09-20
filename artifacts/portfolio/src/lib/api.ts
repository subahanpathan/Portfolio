const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "") + "/api";

export interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "user";
}

export interface Project {
  id: number;
  title: string;
  shortDesc: string;
  fullDesc: string;
  tech: string[];
  category: string;
  featured: boolean;
  githubUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
  challenges: string | null;
  outcomes: string | null;
  createdAt: string;
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string | null;
  category: string;
  description: string | null;
  createdAt: string;
}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = path.startsWith("/") ? path : `/api${path.startsWith("/") ? "" : "/"}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    let message = "API request failed";
    try {
      const data = await response.json();
      message = data.message || message;
    } catch (e) {
      // ignore
    }
    throw new Error(message);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : (undefined as unknown as T);
}

export const api = {
  auth: {
    me: () => fetchApi<User>("/api/auth/me"),
    login: (email: string, password: string) =>
      fetchApi<User>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (email: string, password: string, name: string) =>
      fetchApi<User>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      }),
    logout: () => fetchApi<unknown>("/api/auth/logout", { method: "POST" }),
  },
  projects: {
    list: () => fetchApi<Project[]>("/api/projects"),
    get: (id: number) => fetchApi<Project>(`/api/projects/${id}`),
    create: (data: Partial<Project>) =>
      fetchApi<Project>("/api/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Project>) =>
      fetchApi<Project>(`/api/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) => fetchApi<unknown>(`/api/projects/${id}`, { method: "DELETE" }),
  },
  certificates: {
    list: () => fetchApi<Certificate[]>("/api/certificates"),
    create: (data: Partial<Certificate>) =>
      fetchApi<Certificate>("/api/certificates", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Certificate>) =>
      fetchApi<Certificate>(`/api/certificates/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) => fetchApi<unknown>(`/api/certificates/${id}`, { method: "DELETE" }),
  },
};
