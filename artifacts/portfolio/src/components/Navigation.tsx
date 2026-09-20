import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, LayoutDashboard, User as UserIcon, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "certificates", label: "Certs" },
  { id: "contact", label: "Contact" },
];

interface NavigationProps {
  onSignInClick?: () => void;
}

export default function Navigation({ onSignInClick }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAdmin, isLoggedIn, logout } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = ["hero", ...NAV_ITEMS.map((n) => n.id)];
      let current = "hero";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "SP";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-[rgba(8,8,15,0.85)] backdrop-blur-xl border-b border-white/[0.05]"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <button
          onClick={() => scrollTo("hero")}
          className="font-heading font-bold text-white/90 hover:text-white transition-colors text-base tracking-tight"
          data-testid="nav-logo"
        >
          Subahan<span className="text-indigo-400">.</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                activeSection === item.id
                  ? "text-indigo-300"
                  : "text-white/50 hover:text-white/80"
              }`}
              data-testid={`nav-${item.id}`}
            >
              {activeSection === item.id && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-indigo-500/10 rounded-lg border border-indigo-500/20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {!isLoggedIn && (
            <button
              onClick={onSignInClick}
              className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 text-sm transition-all"
            >
              Sign In
            </button>
          )}

          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {initials}
                </div>
                <span className="text-sm text-white/70 hidden sm:block">{user?.name?.split(" ")[0]}</span>
                {isAdmin && (
                  <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/25">
                    Admin
                  </span>
                )}
                <ChevronDown size={12} className="text-white/30" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[rgba(10,10,18,0.97)] border border-white/[0.08] shadow-2xl overflow-hidden"
                    style={{ backdropFilter: "blur(20px)" }}
                  >
                    <div className="p-2 border-b border-white/[0.06]">
                      <p className="text-xs text-white/30 px-2 py-1 truncate">{user?.email}</p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => { navigate("/admin"); setDropdownOpen(false); }}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-all"
                      >
                        <LayoutDashboard size={14} /> Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-white/60 hover:text-red-400 hover:bg-red-500/[0.05] transition-all"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all glow-indigo"
            data-testid="nav-hire-btn"
          >
            Hire Me
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
