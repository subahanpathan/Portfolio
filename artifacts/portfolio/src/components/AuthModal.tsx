import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, User as UserIcon, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (tab === "signin") {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-md bg-[rgba(15,15,20,0.95)] border border-white/[0.08] rounded-2xl p-8 overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-2"
          >
            <X size={20} />
          </button>

          <div className="flex gap-6 border-b border-white/[0.08] mb-8">
            <button
              onClick={() => setTab("signin")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                tab === "signin" ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              Sign In
              {tab === "signin" && (
                <motion.div
                  layoutId="tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                />
              )}
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                tab === "signup" ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              Create Account
              {tab === "signup" && (
                <motion.div
                  layoutId="tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {tab === "signup" && (
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm py-2.5 rounded-lg transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Please wait..." : tab === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {tab === "signin" && (
            <p className="text-center text-xs text-white/30 mt-6">
              Are you the owner? Sign in with your admin credentials.
            </p>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
