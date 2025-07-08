"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ label = "Back" }: { label?: string }) {
  const router = useRouter();
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push("/"); // fallback to home/dashboard
    }
  };
  return (
    <Button
      variant="outline"
      onClick={handleBack}
      className="flex items-center gap-2 mb-4"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Button>
  );
} 