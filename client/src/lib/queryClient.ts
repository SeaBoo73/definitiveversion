import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Detect if we're in Capacitor (iOS/Android native app)
const isCapacitor = typeof window !== 'undefined' && (window as any).Capacitor !== undefined;

// API base URL - for Capacitor use hardcoded Replit URL, otherwise use env var or current domain
const API_BASE_URL = isCapacitor 
  ? 'https://boat-rental-stefanoconsulti.replit.app'
  : (import.meta.env.VITE_API_URL || window.location.origin);

// Helper function to get full API URL
export function getApiUrl(path: string): string {
  if (!path.startsWith('/')) {
    return path; // Already a full URL
  }
  return `${API_BASE_URL}${path}`;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const clonedRes = res.clone();
    let message: string;
    try {
      const data = await clonedRes.json();
      message = data.message || res.statusText;
    } catch {
      message = await res.text() || res.statusText;
    }
    throw new Error(message);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Aggiungi base URL solo se l'URL inizia con /
  const fullUrl = url.startsWith('/') ? `${API_BASE_URL}${url}` : url;
  
  console.log('🌐 API Request:', { method, url, fullUrl, API_BASE_URL, data });
  
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  console.log('🌐 API Response:', { status: res.status, statusText: res.statusText, url: fullUrl });
  
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    // Aggiungi base URL solo se l'URL inizia con /
    const fullUrl = url.startsWith('/') ? `${API_BASE_URL}${url}` : url;
    
    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});