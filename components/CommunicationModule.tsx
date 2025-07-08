"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarDays, FileText, MessageSquare, User, Users, Plus, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

interface Task {
  id: string;
  task: string;
  assignedTo: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
}

interface File {
  id: string;
  name: string;
  url: string;
  type: string;
}

interface Note {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

export default function CommunicationModule() {
  const [activeTab, setActiveTab] = useState<"personal" | "groups">("personal");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupMessages, setGroupMessages] = useState<Message[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personalRes, groupRes, tasksRes, filesRes, notesRes] = await Promise.all([
          fetch(`http://localhost:5000/communication/conversations/personal`, { headers: { Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : "" } }),
          fetch(`http://localhost:5000/communication/conversations/group`, { headers: { Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : "" } }),
          fetch(`http://localhost:5000/communication/tasks`, { headers: { Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : "" } }),
          fetch(`http://localhost:5000/communication/files`, { headers: { Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : "" } }),
          fetch(`http://localhost:5000/communication/notes`, { headers: { Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : "" } }),
        ]);

        setMessages((await personalRes.json()) || []);
        setGroupMessages((await groupRes.json()) || []);
        setTasks((await tasksRes.json()) || []);
        setFiles((await filesRes.json()) || []);
        setNotes((await notesRes.json()) || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const endpoint =
      activeTab === "personal"
        ? "/api/communication/conversations/personal"
        : "/api/communication/conversations/group";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      });

      const newMsg = await response.json();

      if (activeTab === "personal") {
        setMessages((prev) => [...prev, newMsg]);
      } else {
        setGroupMessages((prev) => [...prev, newMsg]);
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleAddTask = async () => {
    if (newTask.trim() === "") return;

    try {
      const response = await fetch("/api/communication/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: newTask }),
      });

      const newTaskItem = await response.json();
      setTasks((prev) => [...prev, newTaskItem]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleAddNote = async () => {
    if (newNote.trim() === "") return;

    try {
      const response = await fetch("/api/communication/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });

      const newNoteItem = await response.json();
      setNotes((prev) => [...prev, newNoteItem]);
      setNewNote("");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  return (
    <div className="space-y-6 p-4 bg-gradient-to-br from-slate-50 to-white-100 min-h-screen">
      {/* Communication Module */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl font-bold flex items-center space-x-3 text-slate-800">
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              <span>Team Communications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "personal" | "groups")}
              className="w-full"
            >
              <TabsList className="mb-4 px-2 sm:px-4 bg-transparent border-b rounded-none">
                <TabsTrigger
                  value="personal"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 sm:px-4 py-1 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-500 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                >
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  Direct Messages
                </TabsTrigger>
                <TabsTrigger
                  value="groups"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 sm:px-4 py-1 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-500 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  Group Channels
                </TabsTrigger>
              </TabsList>

              {/* Messages Content */}
              <TabsContent value="personal" className="relative">
                <ScrollArea className="h-[300px] sm:h-[400px] px-2 sm:px-4">
                  <div className="space-y-3 pr-2 sm:pr-4">
                    {messages.length > 0 ? (
                      messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start gap-2 sm:gap-3 group"
                        >
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-white shadow-sm">
                            <AvatarImage src={msg.avatar} />
                            <AvatarFallback className="bg-blue-100 text-blue-800 text-sm">
                              {msg.sender[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-1 sm:gap-2 mb-1">
                              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                                {msg.sender}
                              </span>
                              <span className="text-xs text-slate-400">{msg.timestamp}</span>
                            </div>
                            <div className="p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-100">
                              <p className="text-xs sm:text-sm text-slate-600">{msg.content}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-[250px] sm:h-[300px]">
                        <p className="text-xs sm:text-sm text-slate-400">No messages to display.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-slate-100 p-2 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Textarea
                      placeholder="Write a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 resize-none border-0 bg-slate-50 focus-visible:ring-1 ring-blue-500 text-xs sm:text-sm"
                      rows={1}
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-xs sm:text-sm"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Group Content */}
              <TabsContent value="groups" className="relative">
                <ScrollArea className="h-[300px] sm:h-[400px] px-2 sm:px-4">
                  <div className="space-y-3 pr-2 sm:pr-4">
                    {groupMessages.length > 0 ? (
                      groupMessages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start gap-2 sm:gap-3 group"
                        >
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-white shadow-sm">
                            <AvatarImage src={msg.avatar} />
                            <AvatarFallback className="bg-blue-100 text-blue-800 text-sm">
                              {msg.sender[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-1 sm:gap-2 mb-1">
                              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                                {msg.sender}
                              </span>
                              <span className="text-xs text-slate-400">{msg.timestamp}</span>
                            </div>
                            <div className="p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-100">
                              <p className="text-xs sm:text-sm text-slate-600">{msg.content}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-[250px] sm:h-[300px]">
                        <p className="text-xs sm:text-sm text-slate-400">No group messages to display.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-slate-100 p-2 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Textarea
                      placeholder="Write a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 resize-none border-0 bg-slate-50 focus-visible:ring-1 ring-blue-500 text-xs sm:text-sm"
                      rows={1}
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-xs sm:text-sm"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Task Assignment Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl font-bold flex items-center space-x-3 text-slate-800">
              <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              <span>Task Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] sm:h-[300px]">
              <div className="space-y-2 pr-2 sm:pr-4">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center p-2 sm:p-3 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            task.status === "completed" ? "bg-green-500" : "bg-amber-500"
                          )}
                        />
                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                          {task.task}
                        </span>
                      </div>
                      <div className="ml-4 sm:ml-5 mt-1 flex items-center gap-2 sm:gap-3">
                        <span className="text-xs text-slate-400">{task.assignedTo}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-400">{task.dueDate}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-4 flex items-center gap-2">
              <Input
                placeholder="Add new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="border-0 bg-slate-50 focus-visible:ring-1 ring-purple-500 text-xs sm:text-sm"
              />
              <Button
                onClick={handleAddTask}
                className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white shadow-sm text-xs sm:text-sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Collaborative Notes Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl font-bold flex items-center space-x-3 text-slate-800">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600" />
              <span>Collaborative Notes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] sm:h-[300px]">
              <div className="space-y-2 pr-2 sm:pr-4">
                {notes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2 sm:p-3 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                  >
                    <p className="text-xs sm:text-sm text-slate-600">{note.content}</p>
                    <div className="mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2">
                      <span className="text-xs text-slate-400">{note.author}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">{note.timestamp}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-4 flex items-center gap-2">
              <Textarea
                placeholder="Add a new note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="border-0 bg-slate-50 focus-visible:ring-1 ring-teal-500 text-xs sm:text-sm"
                rows={1}
              />
              <Button
                onClick={handleAddNote}
                className="shrink-0 bg-teal-600 hover:bg-teal-700 text-white shadow-sm text-xs sm:text-sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}