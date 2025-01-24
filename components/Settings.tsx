"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Star, Upload, Lock, Bell, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsComponent() {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode class to the root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-8 bg-gradient-to-br from-gray-50 to-white-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="grid gap-6">
        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span>Account Settings</span>
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                Manage your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Language
                  </Label>
                  <Select>
                    <SelectTrigger
                      id="language"
                      className="border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    >
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="en" className="dark:text-gray-100">
                        English
                      </SelectItem>
                      <SelectItem value="es" className="dark:text-gray-100">
                        Español
                      </SelectItem>
                      <SelectItem value="fr" className="dark:text-gray-100">
                        Français
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-photo" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Profile Photo
                  </Label>
                  <div className="flex items-center gap-4">
                    {profilePhoto && (
                      <Image
                        src={profilePhoto}
                        alt="Profile Preview"
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    )}
                    <Input
                      id="profile-photo"
                      type="file"
                      accept="image/*"
                      className="border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      onChange={handlePhotoChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Bell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                Customize how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Notifications
                  </Label>
                  <Switch
                    id="email-notifications"
                    className="data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-400"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Push Notifications
                  </Label>
                  <Switch
                    id="push-notifications"
                    className="data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-400"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    SMS Notifications
                  </Label>
                  <Switch
                    id="sms-notifications"
                    className="data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* User Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
                <span>User Feedback</span>
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                Help us improve by sharing your thoughts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {feedbackSubmitted ? (
                <div className="text-center py-8">
                  <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                    Thank you for your feedback!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Experience</Label>
                    <div className="flex items-center gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant={rating >= star ? "default" : "outline"}
                          size="icon"
                          className={`transition-colors duration-200 ${
                            rating >= star ? "bg-yellow-400 hover:bg-yellow-500" : "border-gray-300"
                          }`}
                          onClick={() => setRating(star)}
                          type="button"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              rating >= star ? "text-white" : "text-gray-400"
                            }`}
                          />
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="comments" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Comments
                    </Label>
                    <Textarea
                      id="comments"
                      placeholder="Share your thoughts..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="suggestions" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Suggestions for Improvement
                    </Label>
                    <Textarea
                      id="suggestions"
                      placeholder="How can we make this better?"
                      value={suggestions}
                      onChange={(e) => setSuggestions(e.target.value)}
                      className="border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Submit Feedback
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                Keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Password
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <Button className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}