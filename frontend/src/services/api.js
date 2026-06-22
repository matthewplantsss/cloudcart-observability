const API_BASE_URL =
  import.meta.env.VITE_API_URL || "/api";

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(
      `CloudCart API request failed with status ${response.status}`
    );
  }

  return response.json();
}

export async function getProducts() {
  return request("/products");
}

export async function getDashboardMetrics() {
  return request("/dashboard");
}
