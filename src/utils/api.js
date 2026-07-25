const API_BASE = "http://localhost:5000/api";

/**
 * Gets HTTP request headers, adding JWT authentication if present.
 * NOTE: For multipart/form-data, do NOT set Content-Type header. Let the browser assign the boundary.
 */
const getHeaders = (isMultipart = false) => {
  const headers = {};
  const token = localStorage.getItem("admin_token");

  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Perform a fetch request to the backend API.
 * @param {string} endpoint - The target endpoint (e.g. '/projects')
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object|FormData} body - Request body payload
 * @param {boolean} isMultipart - True if uploading files/FormData
 */
export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  isMultipart = false
) => {
  const config = {
    method,
    headers: getHeaders(isMultipart),
  };

  if (body) {
    config.body = isMultipart ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);

    // Some delete calls might return status 204 or no content, but our backend sends json
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = { text: await response.text() };
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${method} ${endpoint}:`, error.message);
    throw error;
  }
};
