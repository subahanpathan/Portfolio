import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Calendar, ExternalLink, Building2 } from "lucide-react";
import { type Certificate } from "@/lib/api";

interface CertificatePanelProps {
  certificate: Certificate | null;
  onClose: () => void;
}

const CATEGORY_COLOR: Record<string, string> = {
  "AI/ML": "bg-indigo-500/15 text-indigo-300 border-indigo-500/25",
  Robotics: "bg-violet-500/15 text-violet-300 border-violet-500/25",
  Cloud: "bg-sky-500/15 text-sky-300 border-sky-500/25",
  "Web Dev": "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
};

const ISSUER_ICON: Record<string, string> = {
  Google: "🇬",
  Amazon: "🅰",
  "Open Robotics": "🤖",
  Meta: "🅼",
};

export default function CertificatePanel({ certificate, onClose }: CertificatePanelProps) {
  const isOpen = certificate !== null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && certificate && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32, mass: 0.9 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full md:w-[45%] lg:w-[40%] overflow-y-auto"
            style={{
              background: "rgba(8,8,15,0.97)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(20px)",
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
            >
              <X size={18} />
            </button>

            <div className="p-8 pt-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                <Award size={28} className="text-indigo-400" />
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`text-[11px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-full border ${
                    CATEGORY_COLOR[certificate.category] ?? "bg-white/10 text-white/50 border-white/10"
                  }`}
                >
                  {certificate.category}
                </span>
              </div>

              <h2
                className="text-3xl font-bold text-white mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
              >
                {certificate.title}
              </h2>

              <div className="flex flex-col gap-3 mb-8">
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <Building2 size={14} className="text-white/30" />
                  <span>Issued by <span className="text-white/70 font-medium">{certificate.issuer}</span></span>
                </div>
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <Calendar size={14} className="text-white/30" />
                  <span>{certificate.date}</span>
                </div>
              </div>

              {certificate.credentialUrl && (
                <a
                  href={certificate.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white text-sm transition-all mb-8"
                >
                  <ExternalLink size={14} /> Verify Credential
                </a>
              )}

              {certificate.description && (
                <>
                  <div className="h-px bg-white/[0.06] mb-6" />
                  <div>
                    <span className="text-xs font-semibold tracking-wider uppercase text-white/40 block mb-3">About this certificate</span>
                    <p className="text-white/60 text-sm leading-relaxed">{certificate.description}</p>
                  </div>
                </>
              )}

              <div className="mt-10 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-xs text-white/30 text-center">
                  Certificate verified and issued by {certificate.issuer}
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
