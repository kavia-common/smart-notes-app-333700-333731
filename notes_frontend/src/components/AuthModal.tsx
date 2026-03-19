"use client";
import { useState } from "react";
import { login, signup } from "@/utils/api";

// PUBLIC_INTERFACE
export default function AuthModal({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      let token: string = "";
      if (mode === "login") {
        token = await login(email, password);
      } else {
        token = await signup(email, password);
      }
      onSuccess(token);
    } catch (err) {
      let msg = "Something went wrong";
      if (err instanceof Error) msg = err.message;
      setErr(msg);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white w-80 max-w-[90vw] rounded-2xl px-6 py-8 shadow-lg flex flex-col">
        <h2 className="text-center mb-2 text-2xl font-bold text-[#3b82f6]">SmartNotes</h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="Email"
            autoComplete="email"
            value={email}
            className="px-3 py-2 rounded border border-gray-200 mt-1"
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            required
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            className="px-3 py-2 rounded border border-gray-200"
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          {err && <div className="text-red-600 text-xs mt-1 text-center">{err}</div>}
          <button
            type="submit"
            className="w-full mt-2 py-2 rounded text-white font-semibold bg-[#06b6d4] hover:bg-[#3b82f6] transition"
            disabled={loading}
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
        <div className="text-xs mt-3 text-center text-gray-500">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button className="text-[#3b82f6]" onClick={() => setMode("signup")} disabled={loading}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button className="text-[#3b82f6]" onClick={() => setMode("login")} disabled={loading}>
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
