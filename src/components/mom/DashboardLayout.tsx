"use client";

import React, { useState } from "react";
import Navbar from "@/components/mom/Navbar";
import PairingModal from "@/components/mom/PairingModal";
import AudioRecordModal from "@/components/mom/AudioRecordModal";
import { useAppStore } from "@/lib/mom/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useAppStore();
  const [pairingModalOpen, setPairingModalOpen] = useState(false);
  const [recordModalOpen, setRecordModalOpen] = useState(false);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        theme === "dark"
          ? "bg-[#070D1E] text-white selection:bg-[#1E4FFF] selection:text-white"
          : "bg-[#F8FAFD] text-[#0A1633] selection:bg-[#1E4FFF] selection:text-white"
      }`}
    >
      <Navbar onOpenPairingModal={() => setPairingModalOpen(true)} />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 pb-24">
        {children}
      </main>

      <PairingModal
        isOpen={pairingModalOpen}
        onClose={() => setPairingModalOpen(false)}
      />

      <AudioRecordModal
        isOpen={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
      />
    </div>
  );
}

