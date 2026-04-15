const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const jsonHeaders = {
  'Content-Type': 'application/json'
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(credentials)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
};

export const register = async (payload) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
};
