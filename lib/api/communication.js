function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const fetchConversationById = async (id) => {
  const response = await fetch(`http://localhost:5000/communication/conversations/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch conversation with ID ${id}`);
  }
  return response.json();
};
