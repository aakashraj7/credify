const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  events: `${API_BASE}/events`,
  participants: `${API_BASE}/participants`,
  templates: `${API_BASE}/templates`,
  credentials: `${API_BASE}/credentials`,
  pdf: (credentialId: string) => `${API_BASE}/credentials/${credentialId}/pdf`,
  verify: (credentialId: string) => `${API_BASE}/credentials/by-id/${credentialId}`,
};

export async function fetchJson(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      ...options
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'API Request Failed');
    }
    return data;
  } catch (err: any) {
    console.error(`API Error (${url}):`, err.message);
    throw err;
  }
}
