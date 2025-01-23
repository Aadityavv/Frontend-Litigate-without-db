"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp, signIn } from "@/lib/api/auth";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

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

  // Particle Background Configuration
  const particlesInit = async (engine: any) => {
    await loadFull(engine);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden relative">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse",
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
      />

      {/* Main Content */}
      <motion.div
        className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-4 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Left Section */}
        <motion.div
          className="flex-1 flex flex-col items-center justify-center text-white p-6 md:p-12 space-y-6 text-center"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold drop-shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            LitigateIQ
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-200"
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
          className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-6 md:p-8 space-y-6 max-w-md w-full"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h2
            className="text-3xl font-bold text-center text-white"
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
                  <Input
                    type="text"
                    id="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-lg"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Input
                type="email"
                id="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Input
                type="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-lg"
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
                  <Input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-lg"
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
            <div className="absolute inset-0 border-t border-white/20"></div>
            <span className="bg-transparent px-3 text-white text-sm">OR</span>
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
            className="text-sm text-center text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-indigo-400 font-semibold hover:underline"
            >
              {isSignUp ? "Login here" : "Sign up here"}
            </button>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}