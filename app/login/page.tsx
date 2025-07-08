"use client";

import { useRouter } from "next/navigation";
import AuthPage from "@/components/AuthPage";
import BackButton from "@/components/BackButton";

const LoginPage = () => {
    const router = useRouter();

    const handleLogin = (user: any) => {
        // User and token are already stored in localStorage by AuthPage
        router.push("/");
    };

    return (
      <>
        <BackButton label="Back" />
        <AuthPage onLogin={handleLogin} />
      </>
    );
};

export default LoginPage;
