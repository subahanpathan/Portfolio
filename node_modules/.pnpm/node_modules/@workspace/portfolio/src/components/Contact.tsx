import { motion } from "framer-motion";
import { useState } from "react";
import { Send, Mail, Github, Linkedin, ArrowRight } from "lucide-react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => { setStatus("idle"); setForm({ name: "", email: "", message: "" }); }, 4000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-32 relative" style={{ background: "radial-gradient(ellipse at 50% 80%, rgba(99,102,241,0.06) 0%, transparent 60%)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <span className="section-tag">Contact</span>
          <h2
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
          >
            Let's build something{" "}
            <span className="gradient-text">extraordinary</span>
          </h2>
          <p className="text-white/40 text-base leading-relaxed">
            Open to full-time roles, research collaborations, and ambitious side projects. If you have something worth building, I want to hear about it.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-[1fr_1.5fr] gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-4"
          >
            <a
              href="mailto:subahan@example.com"
              className="group glass rounded-2xl p-5 border border-white/[0.06] hover:border-indigo-500/25 transition-all flex items-center gap-4 glass-hover"
              data-testid="contact-email-link"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/30 text-xs mb-0.5">Email</p>
                <p className="text-white/70 text-sm font-medium truncate">subahan@example.com</p>
              </div>
              <ArrowRight size={16} className="text-white/20 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group glass rounded-2xl p-5 border border-white/[0.06] hover:border-violet-500/25 transition-all flex items-center gap-4 glass-hover"
              data-testid="contact-github-link"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                <Github size={18} className="text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/30 text-xs mb-0.5">GitHub</p>
                <p className="text-white/70 text-sm font-medium">@subahan-pathan</p>
              </div>
              <ArrowRight size={16} className="text-white/20 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group glass rounded-2xl p-5 border border-white/[0.06] hover:border-indigo-500/25 transition-all flex items-center gap-4 glass-hover"
              data-testid="contact-linkedin-link"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <Linkedin size={18} className="text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/30 text-xs mb-0.5">LinkedIn</p>
                <p className="text-white/70 text-sm font-medium">Subahan Pathan</p>
              </div>
              <ArrowRight size={16} className="text-white/20 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            {status === "success" ? (
              <div className="glass rounded-2xl p-10 border border-white/[0.06] flex flex-col items-center justify-center text-center min-h-[340px]">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mb-5"
                >
                  <Send size={26} className="text-indigo-400" />
                </motion.div>
                <h3 className="text-white font-semibold text-xl mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Message sent
                </h3>
                <p className="text-white/35 text-sm">I'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass rounded-2xl p-8 border border-white/[0.06] flex flex-col gap-5"
                data-testid="contact-form"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Your name", type: "text" },
                    { key: "email", label: "Email address", type: "email" },
                  ].map(({ key, label, type }) => (
                    <div key={key}>
                      <label className="block text-white/35 text-xs mb-2 font-medium">{label}</label>
                      <input
                        type={type}
                        required
                        disabled={status === "submitting"}
                        value={form[key as keyof typeof form]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/[0.03] transition-all disabled:opacity-50"
                        placeholder={label}
                        data-testid={`contact-input-${key}`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-white/35 text-xs mb-2 font-medium">Message</label>
                  <textarea
                    required
                    rows={5}
                    disabled={status === "submitting"}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/[0.03] transition-all resize-none disabled:opacity-50"
                    placeholder="Tell me about your project or opportunity..."
                    data-testid="contact-input-message"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 glow-indigo disabled:opacity-60"
                  data-testid="contact-submit-btn"
                >
                  {status === "submitting" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message
                      <Send size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
