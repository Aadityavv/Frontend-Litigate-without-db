function getLawyerId() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) return JSON.parse(user).id;
  }
  return '';
}

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return { Authorization: token ? `Bearer ${token}` : "" };
}

export const fetchCases = async () => {
  const lawyerId = getLawyerId();
  try {
    const response = await fetch(`http://localhost:5000/api/cases?lawyerId=${lawyerId}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    console.log("Fetching cases response:", response);

    if (!response.ok) {
      console.error("Error fetching cases:", response.statusText);
      throw new Error('Failed to fetch cases');
    }

    const data = await response.json();
    console.log("Cases Data:", data);

    if (data && Array.isArray(data.cases)) {
      return data.cases.map(case_ => ({
        id: case_.caseId,
        title: case_.caseTitle,
        status: case_.status,
        deadline: case_.eventDate || case_.dateOfFile || "No deadline",
        isPinned: false
      }));
    } else {
      console.error("Unexpected API response format:", data);
      return [];
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

export const fetchCaseById = async (caseId) => {
  const lawyerId = getLawyerId();
  try {
    const response = await fetch(`http://localhost:5000/caseDetails/?lawyerId=${lawyerId}&caseId=${caseId}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch case with ID ${caseId}`);
    }

    const data = await response.json();
    console.log(`Case Details Data for ${caseId}:`, data);

    return data;
  } catch (error) {
    console.error("Error fetching case by ID:", error);
    return null;
  }
};

// Add this new function to delete a case
export const deleteCase = async (caseId) => {
  const lawyerId = getLawyerId();
  try {
    console.log("Attempting to delete case with ID:", caseId);
    const response = await fetch(
      `http://localhost:5000/delete/case/?lawyerId=${lawyerId}&caseId=${caseId}`,
      {
        method: 'DELETE', // Use DELETE method
        headers: {
          ...getAuthHeaders(),
        },
      }
    );

    console.log("Delete case response:", response);

    if (!response.ok) {
      console.error("Error deleting case:", response.statusText);
      throw new Error('Failed to delete case');
    }

    const data = await response.json();
    console.log("Delete case response data:", data);

    return data; // Return the response data if needed
  } catch (error) {
    console.error("Error deleting case:", error);
    throw error; // Re-throw the error for handling in the component
  }
};

export const fetchStats = async () => {
  const lawyerId = getLawyerId();
  try {
    const response = await fetch(`http://localhost:5000/api/stats?lawyerId=${lawyerId}`, {
      headers: { ...getAuthHeaders() },
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch stats error:', error);
    return null;
  }
};

export const fetchStatDetails = async (type) => {
  const lawyerId = getLawyerId();
  try {
    const response = await fetch(`http://localhost:5000/api/stats/details?lawyerId=${lawyerId}&type=${type}`, {
      headers: { ...getAuthHeaders() },
    });
    if (!response.ok) throw new Error('Failed to fetch stat details');
    const data = await response.json();
    return data.cases || [];
  } catch (error) {
    console.error('Fetch stat details error:', error);
    return [];
  }
};