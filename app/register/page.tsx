"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

function getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { Authorization: token ? `Bearer ${token}` : "" };
}

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await fetch(`https://litigate-backend.onrender.com/auth/register`,  {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        });
        const data = await response.json();
        if (data.success) {
            alert("Registration successful!");
        } else {
            alert("Registration failed.");
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <Button type="submit">Register</Button>
        </form>
    );
};

export default RegisterPage;
