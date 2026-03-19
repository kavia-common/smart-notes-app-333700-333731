"use client";
import { useState } from "react";

// PUBLIC_INTERFACE
export default function Header({ onLogout }: { onLogout: () => void }) {
  const [search, setSearch] = useState("");

  // Emits search input to NotesMain via native event. Replace with better state management in future.
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    window.dispatchEvent(new CustomEvent("notes-search", { detail: e.target.value }));
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-[#3b82f6] tracking-tight select-none">
          <span className="text-[#3b82f6]">Smart</span>
          <span className="text-[#06b6d4]">Notes</span>
        </span>
      </div>
      <div className="hidden sm:flex flex-1 justify-center px-2">
        <input
          className="w-64 px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#3b82f6] bg-gray-50 transition"
          type="text"
          value={search}
          placeholder="Search notes…"
          onChange={handleSearchChange}
        />
      </div>
      <button
        className="ml-4 px-4 py-2 font-medium bg-[#06b6d4] text-white rounded hover:bg-[#3b82f6] transition"
        onClick={onLogout}
      >
        Logout
      </button>
    </header>
  );
}
