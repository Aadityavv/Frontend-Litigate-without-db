export const fetchCases = async () => {
  try {
    const response = await fetch('https://cms-production-3675.up.railway.app/?lawyerId=12345');
    console.log("Fetching cases response:", response);

    if (!response.ok) {
      console.error("Error fetching cases:", response.statusText);
      throw new Error('Failed to fetch cases');
    }

    const data = await response.json();
    console.log("Cases Data:", data);

    // Ensure response structure matches expected format
    if (data && Array.isArray(data.message)) {
      return data.message.map(case_ => ({
        id: case_.caseId,                // ✅ Renamed from `caseId`
        title: case_.caseTitle,          // ✅ Renamed from `caseTitle`
        status: case_.status,            // ✅ No change
        deadline: case_.hearingDate || "No deadline",  // ✅ Default value if null
        isPinned: false                   // ✅ Adding a default property
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
  try {
    const response = await fetch(`https://cms-production-3675.up.railway.app/caseDetails/?lawyerId=12345&caseId=${caseId}`);
    
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
export const deleteCase = async (lawyerId, caseId) => {
  try {
    console.log("Attempting to delete case with ID:", caseId);
    const response = await fetch(
      `https://cms-production-3675.up.railway.app/delete/case/?lawyerId=${lawyerId}&caseId=${caseId}`,
      {
        method: 'DELETE', // Use DELETE method
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