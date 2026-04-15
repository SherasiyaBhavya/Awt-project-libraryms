const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('libraryToken')}`
});

export const getBooks = async () => {
  const response = await fetch(`${API_URL}/api/books`, {
    headers: getHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch books');
  }

  return data;
};

export const issueBook = async (bookId, dueDate) => {
  const response = await fetch(`${API_URL}/api/issues/issue-book`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ bookId, dueDate })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to issue book');
  }

  return data;
};

export const getMyIssuedBooks = async () => {
  const response = await fetch(`${API_URL}/api/issues/my-books`, {
    headers: getHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch my books');
  }

  return data;
};

export const returnBook = async (issueId) => {
  const response = await fetch(`${API_URL}/api/issues/return-book/${issueId}`, {
    method: 'POST',
    headers: getHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to return book');
  }

  return data;
};
