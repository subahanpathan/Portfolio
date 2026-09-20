import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-white/[0.05] py-12 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <p className="font-semibold text-white/70 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Subahan<span className="text-indigo-400">.</span>
          </p>
          <p className="text-white/25 text-xs">
            &copy; {new Date().getFullYear()} Subahan Pathan. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {[
            { href: "https://github.com", icon: <Github size={16} />, label: "GitHub" },
            { href: "https://linkedin.com", icon: <Linkedin size={16} />, label: "LinkedIn" },
            { href: "https://twitter.com", icon: <Twitter size={16} />, label: "Twitter" },
            { href: "mailto:subahan@example.com", icon: <Mail size={16} />, label: "Email" },
          ].map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-indigo-500/15 border border-white/[0.07] hover:border-indigo-500/30 flex items-center justify-center text-white/30 hover:text-indigo-300 transition-all"
              aria-label={label}
              data-testid={`footer-${label.toLowerCase()}`}
            >
              {icon}
            </a>
          ))}

          <button
            onClick={scrollTop}
            className="w-9 h-9 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/25 flex items-center justify-center text-indigo-400 hover:text-indigo-300 transition-all ml-1"
            aria-label="Back to top"
            data-testid="footer-back-to-top"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
