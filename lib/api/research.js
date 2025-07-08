function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const fetchBookmarkedResearch = async () => {
  const response = await fetch('http://localhost:5000/research/bookmarked', {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch bookmarked research');
  }
  return response.json();
};