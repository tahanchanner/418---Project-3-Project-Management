
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function requestJSON(path, options = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await res.json().catch(() => ({}));

    return {
      ...data,
      success: res.ok && data.success === true,
      message: data.message || `Request failed (status ${res.status}).`,
    };
  } catch {
    return {
      success: false,
      message: "Cannot reach the server. Is the backend running?",
    };
  }
}

export function postJSON(path, body) {
  return requestJSON(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getJSON(path) {
  return requestJSON(path, {
    method: "GET",
  });
}

export function deleteJSON(path) {
  return requestJSON(path, {
    method: "DELETE",
  });
}



