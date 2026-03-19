"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NotesMain from "@/components/NotesMain";
import AuthModal from "@/components/AuthModal";
import { getToken, removeToken, setToken } from "@/utils/auth";

export default function Home() {
  const [token, setTokenState] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  // On mount, check for existing token
  useEffect(() => {
    const t = getToken();
    if (!t) setShowAuth(true);
    else setTokenState(t);
  }, []);

  // If login/logout events occur, update token state accordingly
  const handleLogin = (t: string) => {
    setToken(t);
    setTokenState(t);
    setShowAuth(false);
  };
  const handleLogout = () => {
    removeToken();
    setTokenState(null);
    setShowAuth(true);
  };

  // If not authenticated, show login
  if (!token || showAuth)
    return <AuthModal onSuccess={handleLogin} />;

  // Otherwise, main notes UI
  return (
    <div className="bg-[#f9fafb] min-h-screen flex flex-col">
      <Header onLogout={handleLogout} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar token={token} />
        <NotesMain token={token} />
      </div>
    </div>
  );
}
