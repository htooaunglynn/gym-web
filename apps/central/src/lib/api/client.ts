export interface ApiError extends Error {
  code?: string;
  details?: any;
}

let currentAccessToken: string | null = null;
let currentLogoutFn: (() => void) | null = null;

export const setApiContext = (token: string | null, logout: () => void) => {
  currentAccessToken = token;
  currentLogoutFn = logout;
};

// Extracted to be used by silentRefresh in CentralAuthContext directly
export async function silentRefreshApi() {
  const res = await fetch("/api/central/auth/refresh", { method: "POST" });
  if (!res.ok) throw new Error("Refresh failed");
  return res.json();
}

export async function apiClient<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {}
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers || {});

  if (!skipAuth && currentAccessToken) {
    headers.set("Authorization", `Bearer ${currentAccessToken}`);
  }

  const url = path.startsWith("http") ? path : `/api/central${path.startsWith("/") ? path : `/${path}`}`;

  let res = await fetch(url, { ...fetchOptions, headers });

  if (res.status === 401 && !skipAuth) {
    // Attempt ONE silent refresh
    try {
      const refreshRes = await silentRefreshApi();
      const newToken = refreshRes.data?.accessToken;
      if (newToken) {
        currentAccessToken = newToken;
        headers.set("Authorization", `Bearer ${newToken}`);
        res = await fetch(url, { ...fetchOptions, headers }); // retry
      } else {
        throw new Error("No token returned");
      }
    } catch {
      // Second 401/failure calls logout
      if (currentLogoutFn) currentLogoutFn();
      throw new Error("Session expired");
    }
  }

  const envelope = await res.json().catch(() => ({}));
  if (envelope.error) {
    const error = new Error(envelope.error.message || "API Error") as ApiError;
    error.code = envelope.error.code;
    error.details = envelope.error.details;
    throw error;
  }

  if (!res.ok) {
    throw new Error(envelope.message || "An unexpected error occurred");
  }

  return envelope.data;
}
