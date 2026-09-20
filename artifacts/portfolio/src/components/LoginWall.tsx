import { motion } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";

interface LoginWallProps {
  title: string;
  subtitle: string;
  onOpenAuth: () => void;
}

export default function LoginWall({ title, subtitle, onOpenAuth }: LoginWallProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
      className="flex flex-col items-center justify-center py-24"
    >
      <div className="relative">
        {/* blurred background cards for visual interest */}
        <div className="absolute -inset-12 flex gap-4 opacity-[0.07] pointer-events-none select-none">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-48 h-32 rounded-xl bg-white border border-white/10"
              style={{ transform: `rotate(${(i - 2) * 6}deg) translateY(${i * 12}px)` }}
            />
          ))}
        </div>

        <div className="relative glass rounded-2xl border border-white/[0.08] p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
            <Lock size={24} className="text-indigo-400" />
          </div>

          <h3
            className="text-2xl font-bold text-white mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
          >
            {title}
          </h3>

          <p className="text-white/40 text-sm leading-relaxed mb-8">{subtitle}</p>

          <button
            onClick={onOpenAuth}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all glow-indigo"
          >
            Sign In or Create Account
            <ArrowRight size={16} />
          </button>

          <p className="text-white/25 text-xs mt-6">
            Free and instant. No spam, ever.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
