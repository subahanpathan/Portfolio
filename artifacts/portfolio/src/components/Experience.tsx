import { motion } from "framer-motion";

const EXPERIENCES = [
  {
    role: "AI Research Intern",
    company: "Tech Startup X",
    period: "2023 — 2024",
    type: "Internship",
    desc: "Developed and optimized computer vision models for real-time edge processing. Led a cross-functional initiative that reduced inference latency by 40% on resource-constrained hardware.",
    highlights: ["40% latency reduction", "Edge CV deployment", "TensorFlow + OpenCV"],
  },
  {
    role: "Full Stack Developer",
    company: "Freelance",
    period: "2022 — 2023",
    type: "Contract",
    desc: "Built scalable web applications for multiple clients using React, Node.js, and PostgreSQL. Delivered end-to-end solutions from database design to production deployment.",
    highlights: ["8+ client projects", "React + Node.js", "Production deployments"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="section-tag">Experience</span>
          <h2
            className="text-4xl md:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
          >
            Where I've <span className="gradient-text">contributed</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 via-violet-500/20 to-transparent" />

          <div className="flex flex-col gap-8">
            {EXPERIENCES.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                className="flex gap-8"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  </div>
                </div>

                <div className="glass rounded-2xl p-6 md:p-8 flex-1 border border-white/[0.06] hover:border-indigo-500/20 transition-colors glass-hover">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
                    <div>
                      <h3
                        className="text-white font-semibold text-xl mb-1"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {exp.role}
                      </h3>
                      <p className="text-indigo-300/70 text-sm font-medium">{exp.company}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className="text-white/30 text-xs tabular-nums"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {exp.period}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/35 text-[10px] tracking-wide">
                        {exp.type}
                      </span>
                    </div>
                  </div>

                  <p className="text-white/45 text-sm leading-relaxed mb-5">{exp.desc}</p>

                  <div className="flex flex-wrap gap-2">
                    {exp.highlights.map((h) => (
                      <span
                        key={h}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-indigo-500/8 border border-indigo-500/15 text-indigo-300/70"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
