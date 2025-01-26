"use client";

import { Button } from "@/components/ui/button";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export const CustomModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: CustomModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4 sm:mx-0">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};