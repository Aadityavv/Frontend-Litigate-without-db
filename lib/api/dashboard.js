function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const fetchUser = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/user', {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }

    const data = await response.json();
    console.log("User Data:", data);

    return data.name || "Guest";
  } catch (error) {
    console.error("Error fetching user details:", error);
    return "Guest";
  }
};

export const fetchDashboardStats = async (lawyerId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/getStats/?lawyerId=${lawyerId}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    const data = await response.json();
    console.log("Dashboard Stats:", data);

    return data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {};
  }
};

export const fetchNotifications = async (lawyerId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/getNotifications/?lawyerId=${lawyerId}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    const data = await response.json();
    console.log("Notifications Data:", data);

    return data.notifications || [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const fetchEvents = async (lawyerId, date) => {
  try {
    const response = await fetch(`http://localhost:5000/api/events?lawyerId=${lawyerId}&date=${date}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch events for date: ${date}`);
    }
    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const addEvent = async (eventData) => {
  try {
    const response = await fetch('http://localhost:5000/api/events', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      throw new Error('Failed to add event');
    }
    const newEvent = await response.json();
    return newEvent;
  } catch (error) {
    console.error("Error adding new event:", error);
    return null;
  }
};

export const updateEvent = async (updatedEvent) => {
  try {
    const response = await fetch(`http://localhost:5000/api/events/${updatedEvent._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updatedEvent),
    });
    if (!response.ok) {
      throw new Error(`Failed to update event with ID ${updatedEvent._id}`);
    }
    const updatedEventData = await response.json();
    return updatedEventData;
  } catch (error) {
    console.error("Error updating event:", error);
    return null;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete event with ID ${eventId}`);
    }
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
};
