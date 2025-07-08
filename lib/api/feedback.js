function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const submitFeedback = async (feedbackData) => {
  const response = await fetch('https://litigate-backend.onrender.com/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(feedbackData),
  });
  if (!response.ok) {
    throw new Error('Failed to submit feedback');
  }
  return response.json();
};