function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const updateSettings = async (settingsData) => {
  const response = await fetch('https://litigate-backend.onrender.com/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(settingsData),
  });
  if (!response.ok) {
    throw new Error('Failed to update settings');
  }
  return response.json();
};
