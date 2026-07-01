const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    const message = data?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

// ---- Auth ----

export async function registerUser(data) {
  const result = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
  localStorage.setItem("token", result.token);
  localStorage.setItem("user", JSON.stringify(result.user));
  return result;
}

export async function loginUser(data) {
  const result = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  localStorage.setItem("token", result.token);
  localStorage.setItem("user", JSON.stringify(result.user));
  return result;
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

// ---- Campaigns ----

export function getCampaigns(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  return request(`/campaigns${params ? `?${params}` : ""}`);
}

export function getCampaignById(id) {
  return request(`/campaigns/${id}`);
}

export function createCampaign(data) {
  return request("/campaigns", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCampaign(id, data) {
  return request(`/campaigns/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteCampaign(id) {
  return request(`/campaigns/${id}`, {
    method: "DELETE",
  });
}

// ---- AI Email Generation ----

export function generateEmailWithAI(payload) {
  return request("/ai/generate-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---- Journeys ----

export function getJourneys() {
  return request("/journeys");
}

export function getJourneyById(id) {
  return request(`/journeys/${id}`);
}

export function createJourney(data) {
  return request("/journeys", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateJourney(id, data) {
  return request(`/journeys/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteJourney(id) {
  return request(`/journeys/${id}`, {
    method: "DELETE",
  });
}

// ---- Profile ----

export function updateProfile(data) {
  return request("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function updatePassword(data) {
  return request("/auth/password", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}