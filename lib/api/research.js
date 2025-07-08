function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const fetchBookmarkedResearch = async () => {
  const response = await fetch('https://litigate-backend.onrender.com/research/bookmarked', {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch bookmarked research');
  }
  return response.json();
};