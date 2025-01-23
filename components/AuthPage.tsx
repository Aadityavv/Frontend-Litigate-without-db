"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp, signIn } from "@/lib/api/auth";

export default function AuthPage({ onLogin }: { onLogin: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const taglines = [
    "Empowering legal professionals with cutting-edge technology.",
    "Streamline your legal workflows efficiently.",
    "Transforming the legal industry one step at a time.",
    "Your legal partner in technology innovation.",
  ];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = isSignUp
        ? await signUp({ name: formData.name, email: formData.email, password: formData.password })
        : await signIn({ email: formData.email, password: formData.password });

      if (response.error) {
        alert(response.error);
      } else {
        alert(`${isSignUp ? "Sign-up" : "Login"} successful!`);
        onLogin();
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-indigo-700 flex flex-col md:flex-row items-center justify-center overflow-hidden p-4">
      {/* Left Section */}
      <motion.div
        className="flex-1 h-full flex flex-col items-center justify-center text-white p-6 md:p-12 space-y-4"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold drop-shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          LitigateIQ
        </motion.h1>
        <motion.p
          className="text-base md:text-lg text-gray-200 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <Typewriter
            words={taglines}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
          />
        </motion.p>
      </motion.div>

      {/* Right Section */}
      <motion.div
        className="flex-1 bg-white/90 backdrop-blur-md flex flex-col justify-center p-6 md:p-8 rounded-lg shadow-2xl space-y-4 max-w-md w-full mx-4"
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center text-gray-800"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {isSignUp ? "Create an Account" : "Welcome Back!"}
        </motion.h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-sm font-semibold rounded-lg shadow-md transition-all duration-300"
            >
              {isSignUp ? "Sign Up" : "Login"}
            </Button>
          </motion.div>
        </form>

        <motion.div
          className="relative flex items-center justify-center py-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <div className="absolute inset-0 border-t border-gray-300"></div>
          <span className="bg-white px-3 text-gray-500 text-sm">OR</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <Button
            className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 text-sm font-semibold rounded-lg shadow-md transition-all duration-300"
          >
            <FaGoogle className="mr-2" /> Continue with Google
          </Button>
        </motion.div>

        <motion.p
          className="text-sm text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-600 font-semibold hover:underline"
          >
            {isSignUp ? "Login here" : "Sign up here"}
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}