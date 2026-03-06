const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3009";
const AUTH_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost/admin";

const TOKEN_KEY = "bookzilla_admin_token";

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    }
    throw new ApiError(
      response.status,
      data?.message || `Request failed with status ${response.status}`,
      data
    );
  }

  return data.data as T;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  useAuthBaseUrl = false
): Promise<T> {
  const baseUrl = useAuthBaseUrl ? AUTH_BASE_URL : API_BASE_URL;
  const url = `${baseUrl}${endpoint}`;

  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return handleResponse<T>(response);
}

// Auth API
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    },
    true
  );
  console.log("Response Token ", response);
  if (response.token) {
    setToken(response.token);
  }

  return response;
}

export async function logout(): Promise<void> {
  removeToken();
}

// Books API
export interface Book {
  id?: string;
  title: string;
  description: string;
  format: "HARDCOVER" | "PAPERBACK" | "EBOOK" | "AUDIOBOOK";
  price: string;
  coverImageUrl: string;
  isbn: string;
  publisher: string;
  pageCount: number;
  language: string;
  stockQuantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BooksResponse {
  books?: Book[];
  total?: number;
  page?: number;
  limit?: number;
}

export async function getBooks(): Promise<Book[]> {
  const response = await apiRequest<BooksResponse>("/catalog/books", {
    method: "GET",
  });

  return response.books || [];
}

export async function getBook(id: string): Promise<Book> {
  return apiRequest<Book>(`/catalog/books/${id}`, {
    method: "GET",
  });
}

export async function createBook(
  book: Omit<Book, "id" | "createdAt" | "updatedAt">
): Promise<Book> {
  return apiRequest<Book>("/catalog/books", {
    method: "POST",
    body: JSON.stringify(book),
  });
}

export async function updateBook(
  id: string,
  book: Partial<Book>
): Promise<Book> {
  return apiRequest<Book>(`/catalog/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(book),
  });
}

export async function deleteBook(id: string): Promise<void> {
  return apiRequest<void>(`/catalog/books/${id}`, {
    method: "DELETE",
  });
}

// Media API
export interface MediaUploadResponse {
  url?: string;
  path?: string;
  filename?: string;
}

export async function uploadMedia(file: File): Promise<string> {
  const url = `${API_BASE_URL}/media/upload`;
  const token = getToken();

  const formData = new FormData();
  formData.append("image", file);

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message || "Failed to upload media",
      data
    );
  }

  // Return the URL from response (adjust based on your API response structure)
  return data.data?.url || data.url || data.path || "";
}
