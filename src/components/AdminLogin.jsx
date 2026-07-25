import React, { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Mail, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { apiRequest } from "../utils/api";

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", "POST", { email, password });
      
      // Save credentials in storage
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_name", data.name);
      
      onLoginSuccess();
    } catch (err) {
      setError(err.message || "Invalid credentials, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    window.location.hash = "";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        {/* Header/Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/15"
          >
            <KeyRound size={26} />
          </motion.div>
          <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Admin Portal
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Authenticate to access the portfolio dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3.5 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
          >
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter admin email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-blue-500/80 text-sm focus:outline-none transition-all placeholder-slate-600 font-sans"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <KeyRound size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-blue-500/80 text-sm focus:outline-none transition-all placeholder-slate-700 font-sans"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Verifying...
                </>
              ) : (
                "Authenticate"
              )}
            </motion.button>

            <button
              type="button"
              onClick={handleBackToHome}
              className="w-full py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900/50 text-slate-400 hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Portfolio
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
