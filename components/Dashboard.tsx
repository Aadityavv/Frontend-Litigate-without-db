"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import AddNewEventModal from "@/components/AddNewEvent";
import ConfirmDialog from "@/components/ConfirmDialog";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { toast } from "sonner";

// Interfaces for Type Safety
interface Event {
  eventId: string;
  caseId: string;
  caseTitle: string;
  partyName: string;
  eventType: string;
  eventDesc: string;
  eventLocation: string;
  eventDate: string;
  eventTime: string;
}

interface Stats {
  totalCases: number;
  totalCasesChange: number;
  pendingCases: number;
  pendingCasesChange: number;
  overduePendingCasesCount: number;
  resolvedCases: number;
  resolvedCasesChange: number;
  upcomingDeadlines: number;
  totalCasesDetails: any[];
  pendingCasesDetails: any[];
  overduePendingCasesDetails: any[];
  resolvedCasesDetails: any[];
  upcomingDeadlineDetails: any[];
}

export default function Dashboard() {
  // State Variables
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [lawyerName, setLawyerName] = useState("John Doe");
  const [lawyerId, setLawyerId] = useState<string>("12345");
  const [events, setEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCases: 0,
    totalCasesChange: 0,
    pendingCases: 0,
    pendingCasesChange: 0,
    overduePendingCasesCount: 0,
    resolvedCases: 0,
    resolvedCasesChange: 0,
    upcomingDeadlines: 0,
    totalCasesDetails: [],
    pendingCasesDetails: [],
    overduePendingCasesDetails: [],
    resolvedCasesDetails: [],
    upcomingDeadlineDetails: [],
  });
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showCount, setShowCount] = useState(5);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://dummy-backend-15jt.onrender.com/user`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLawyerName(data.name || "Guest");
        setLawyerId(data.lawyerId || "12345"); // Set lawyerId dynamically
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLawyerName("Guest");
        setLawyerId("12345"); // Fallback to default
      }
    };

    const fetchStats = async () => {
      try {
        const response = await fetch(`https://dummy-backend-15jt.onrender.com/dashboard/stats`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStats(data);

        // Set deadlines from the response
        if (data.upcomingDeadlineDetails) {
          setDeadlines(data.upcomingDeadlineDetails);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`https://dummy-backend-15jt.onrender.com/dashboard/notifications`);
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchUser();
    fetchStats();
    fetchNotifications();
  }, []);

  // Fetch events dynamically based on the selected date
  const fetchEvents = async (date: Date) => {
    try {
      const formattedDate = format(date, "yyyy-MM-dd"); // Format the date
      const response = await fetch(
        `https://dashboardservice-production.up.railway.app/api/getEvents/?lawyerId=${lawyerId}&eventDate=${formattedDate}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Events data fetched:", data);

      // Extract events from the nested response
      const casesWithEvents = data.message.casesWithEventsAndParties || [];
      const eventsArray = casesWithEvents.flatMap((caseData: any) =>
        caseData.events.map((event: any) => ({
          ...event,
          caseId: caseData.caseId,
          caseTitle: caseData.caseTitle,
          partyName: caseData.partyName,
        }))
      );

      setEvents(eventsArray);
      console.log("Updated Events State:", eventsArray);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events. Please try again.");
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchEvents(selectedDate); // Fetch events for the selected date
    }
  }, [selectedDate, lawyerId]); // Add lawyerId as a dependency

  const handleAddEvent = async (eventData: any) => {
    try {
      // Ensure the lawyerId is included in the payload
      const payload = {
        ...eventData,
        lawyerId: lawyerId, // Explicitly include the lawyerId
      };
  
      console.log("Payload:", payload); // Debugging
  
      const response = await fetch(`https://dashboardservice-production.up.railway.app/post/createEvent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const newEvent = await response.json();
      console.log("Response:", newEvent); // Debugging
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      setIsAddEventModalOpen(false);
      toast.success("Event added successfully!");
    } catch (error) {
      console.error("Error adding new event:", error);
      toast.error("Failed to add event. Please try again.");
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) {
      toast.error("Event ID is missing.");
      return;
    }

    try {
      const event = events.find((e) => e.eventId === eventToDelete);
      if (!event) {
        toast.error("Event not found.");
        return;
      }

      const response = await fetch(
        `https://dashboardservice-production.up.railway.app/delete/deleteEvent?lawyerId=${lawyerId}&caseId=${event.caseId}&eventId=${eventToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the deleted event from the state
      setEvents((prevEvents) => prevEvents.filter((event) => event.eventId !== eventToDelete));
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setEventToDelete(null);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
  };

  const handleUpdateEvent = async (updatedEvent: any) => {
    try {
      // Ensure the lawyerId is included in the payload
      const payload = {
        ...updatedEvent,
        lawyerId: lawyerId, // Explicitly include the lawyerId
      };
  
      console.log("Payload:", payload); // Debugging
  
      const response = await fetch(
        `https://dashboardservice-production.up.railway.app/put/updateEvent/${updatedEvent.eventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const updatedEventData = await response.json();
      console.log("Response:", updatedEventData); // Debugging
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.eventId === updatedEventData.eventId ? updatedEventData : event
        )
      );
      setEditingEvent(null);
      toast.success("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event. Please try again.");
    }
  };

  const getCardTitle = (card: string) => {
    switch (card) {
      case "total-cases":
        return "Total Cases";
      case "pending-cases":
        return "Pending Cases";
      case "resolved-cases":
        return "Resolved Cases";
      case "upcoming-deadlines":
        return "Upcoming Deadlines";
      default:
        return "";
    }
  };

  const getSampleData = (card: string) => {
    const casesToShow = (cases: any[]) =>
      cases.slice(0, showCount).map((caseItem, index) => (
        <li key={index}>
          <span className="font-semibold">Case #{caseItem.caseId}</span>: {caseItem.title}
        </li>
      ));

    switch (card) {
      case "total-cases":
        return (
          <>
            <ul className="list-disc ml-5 space-y-2 text-gray-800">
              {stats.totalCasesDetails && stats.totalCasesDetails.length > 0 ? (
                casesToShow(stats.totalCasesDetails)
              ) : (
                <p className="text-gray-500">No total cases found.</p>
              )}
            </ul>
            {stats.totalCasesDetails &&
              stats.totalCasesDetails.length > showCount && (
                <button
                  className="text-blue-600 mt-2 underline"
                  onClick={() => setShowCount(showCount + 5)}
                >
                  Show More
                </button>
              )}
          </>
        );
      case "pending-cases":
        return (
          <>
            <ul className="list-disc ml-5 space-y-2 text-gray-800">
              {stats.pendingCasesDetails && stats.pendingCasesDetails.length > 0 ? (
                casesToShow(stats.pendingCasesDetails)
              ) : (
                <p className="text-gray-500">No pending cases found.</p>
              )}
            </ul>
            <p className="text-sm text-red-500 mt-2">
              Overdue Pending Cases: {stats.overduePendingCasesCount}
            </p>
            {stats.pendingCasesDetails &&
              stats.pendingCasesDetails.length > showCount && (
                <button
                  className="text-blue-600 mt-2 underline"
                  onClick={() => setShowCount(showCount + 5)}
                >
                  Show More
                </button>
              )}
          </>
        );
      case "resolved-cases":
        return (
          <>
            <ul className="list-disc ml-5 space-y-2 text-gray-800">
              {stats.resolvedCasesDetails && stats.resolvedCasesDetails.length > 0 ? (
                casesToShow(stats.resolvedCasesDetails)
              ) : (
                <p className="text-gray-500">No resolved cases found.</p>
              )}
            </ul>
            {stats.resolvedCasesDetails &&
              stats.resolvedCasesDetails.length > showCount && (
                <button
                  className="text-blue-600 mt-2 underline"
                  onClick={() => setShowCount(showCount + 5)}
                >
                  Show More
                </button>
              )}
          </>
        );
      case "upcoming-deadlines":
        return (
          <>
            <ul className="list-disc ml-5 space-y-2 text-gray-800">
              {deadlines.length > 0 ? (
                casesToShow(deadlines)
              ) : (
                <p className="text-gray-500">No upcoming deadlines found.</p>
              )}
            </ul>
            {deadlines.length > showCount && (
              <button
                className="text-blue-600 mt-2 underline"
                onClick={() => setShowCount(showCount + 5)}
              >
                Show More
              </button>
            )}
          </>
        );
      default:
        return <p className="text-gray-500">No data available.</p>;
    }
  };

  return (
    <div className="space-y-8 p-2 bg-white min-h-screen">
      {/* Welcome Section */}
      <div className="flex items-center space-x-4">
        <UserCircleIcon className="w-16 h-16 text-blue-600" />
        <h1 className="text-3xl font-extrabold text-gray-800">
          Welcome, {lawyerName}!
        </h1>
      </div>

      {/* Calendar Section */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">
            Appointments and Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg mx-2 xl:mx-5 shadow-md">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="border rounded-md"
              />
            </div>
            <div className="bg-white rounded-lg p-2 shadow-md md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-xl text-gray-700">
                  Events on {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                </h3>
                <Button
                  onClick={() => setIsAddEventModalOpen(true)}
                  className="flex items-center px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
                >
                  Add Event
                </Button>
              </div>
              <ul className="space-y-3">
                {events.length > 0 ? (
                  events.map((event) => (
                    <li
                      key={event.eventId}
                      className="flex flex-col p-4 bg-gray-100 rounded-lg shadow-sm"
                    >
                      {/* Case ID and Buttons */}
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-bold">Case ID: {event.caseId}</p>
                        <div className="flex space-x-2">
                          {/* Edit Button */}
                          <Button
                            onClick={() => handleEditEvent(event)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 flex items-center"
                          >
                            <Edit className="w-4 h-4" />
                            <span className="hidden md:inline ml-2">Edit</span>
                          </Button>
                          {/* Delete Button */}
                          <Button
                            onClick={() => setEventToDelete(event.eventId)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 flex items-center"
                          >
                            <Trash className="w-4 h-4" />
                            <span className="hidden md:inline ml-2">Delete</span>
                          </Button>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div>
                        <p><strong>Case Title:</strong> {event.caseTitle}</p>
                        <p><strong>Party Name:</strong> {event.partyName}</p>
                        <p><strong>Event Type:</strong> {event.eventType}</p>
                        <p><strong>Description:</strong> {event.eventDesc}</p>
                        <p><strong>Location:</strong> {event.eventLocation}</p>
                        <p>
                          <strong>Date:</strong> {event.eventDate} | <strong>Time:</strong> {event.eventTime}
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No events for this date.</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card
          onClick={() =>
            setSelectedCard(selectedCard === "total-cases" ? null : "total-cases")
          }
          className={`shadow-md transition-transform hover:scale-105 bg-white cursor-pointer ${
            selectedCard === "total-cases" ? "border-blue-600 border-2" : ""
          }`}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-blue-600">
              {stats.totalCases}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              <span className="text-green-600 font-semibold">
                +{stats.totalCasesChange}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card
          onClick={() =>
            setSelectedCard(selectedCard === "pending-cases" ? null : "pending-cases")
          }
          className={`shadow-md transition-transform hover:scale-105 bg-white cursor-pointer ${
            selectedCard === "pending-cases" ? "border-yellow-600 border-2" : ""
          }`}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">
              Pending Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-yellow-600">
              {stats.pendingCases}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              <span className="text-red-600 font-semibold">
                Overdue: {stats.overduePendingCasesCount}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card
          onClick={() =>
            setSelectedCard(selectedCard === "resolved-cases" ? null : "resolved-cases")
          }
          className={`shadow-md transition-transform hover:scale-105 bg-white cursor-pointer ${
            selectedCard === "resolved-cases" ? "border-green-600 border-2" : ""
          }`}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">
              Resolved Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-green-600">
              {stats.resolvedCases}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              <span className="text-green-600 font-semibold">
                +{stats.resolvedCasesChange}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card
          onClick={() =>
            setSelectedCard(
              selectedCard === "upcoming-deadlines" ? null : "upcoming-deadlines"
            )
          }
          className={`shadow-md transition-transform hover:scale-105 bg-white cursor-pointer ${
            selectedCard === "upcoming-deadlines" ? "border-red-600 border-2" : ""
          }`}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-red-600">
              {stats.upcomingDeadlines}
            </div>
            <p className="text-sm text-gray-500">Within next 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Sample Data Display */}
      {selectedCard && (
        <div className="mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                {getCardTitle(selectedCard)}
              </CardTitle>
            </CardHeader>
            <CardContent>{getSampleData(selectedCard)}</CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {notifications.map((notification, index) => (
              <div key={index} className="space-y-4">
                <p className="text-lg font-semibold text-gray-800">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-500">
                  {notification.description}
                </p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Edit Event Modal */}
      {editingEvent && (
        <AddNewEventModal
          existingEvent={editingEvent}
          onClose={() => setEditingEvent(null)}
          onAddEvent={handleUpdateEvent}
        />
      )}

      {/* Confirm Delete Dialog */}
      {eventToDelete && (
        <ConfirmDialog
          message="Are you sure you want to delete this event?"
          onConfirm={handleDeleteEvent}
          onCancel={() => setEventToDelete(null)}
        />
      )}

      {/* Add Event Modal */}
      {isAddEventModalOpen && (
        <AddNewEventModal
          onClose={() => setIsAddEventModalOpen(false)}
          onAddEvent={handleAddEvent}
        />
      )}
    </div>
  );
}