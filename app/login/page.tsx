"use client";

import { useRouter } from "next/navigation";
import AuthPage from "@/components/AuthPage";

const LoginPage = () => {
    const router = useRouter();

    const handleLogin = (user: any) => {
        // User and token are already stored in localStorage by AuthPage
        router.push("/");
    };

    return (
      <>
        <AuthPage onLogin={handleLogin} />
      </>
    );
};

export default LoginPage;
