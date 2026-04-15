const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('libraryToken')}`
});

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/api/users`, {
    headers: getHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch users');
  }

  return data;
};

export const deleteUser = async (userId) => {
  const response = await fetch(`${API_URL}/api/users/${userId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete user');
  }

  return data;
};
