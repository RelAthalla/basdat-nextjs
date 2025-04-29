"use client"

import { useEffect, useState } from "react";

interface ToasterProps {
  position: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
}

export function Toaster({ position }: ToasterProps) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setMessage("This is a toaster notification!");
    }, 1000); 
  }, []);

  return (
    message && (
      <div
        className={`fixed ${position} bg-black text-white p-4 rounded-lg shadow-lg`}
        style={{ zIndex: 9999 }}
      >
        {message}
      </div>
    )
  );
}
