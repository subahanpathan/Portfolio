import { motion } from "framer-motion";
import { BookOpen, Award, Star } from "lucide-react";

const COURSES = [
  "Machine Learning", "Neural Networks", "Robotics & Automation",
  "Data Structures & Algorithms", "Operating Systems", "Cloud Computing",
  "Computer Vision", "Distributed Systems",
];

const ACHIEVEMENTS = [
  { icon: <Star size={14} />, text: "Published paper on optimized object detection for edge devices" },
  { icon: <Award size={14} />, text: "Winner, National Robotics Hackathon 2023" },
  { icon: <BookOpen size={14} />, text: "Dean's List — all semesters" },
];

export default function Education() {
  return (
    <section id="education" className="py-32 relative" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.04) 0%, transparent 60%)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="section-tag">Education</span>
          <h2
            className="text-4xl md:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
          >
            The <span className="gradient-text">foundation</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="glass rounded-2xl border border-white/[0.06] overflow-hidden"
        >
          <div className="grid md:grid-cols-[1fr_1px_1fr] divide-y md:divide-y-0 divide-white/[0.06]">
            <div className="p-8 md:p-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                <BookOpen size={22} className="text-indigo-400" />
              </div>
              <p
                className="text-xs font-medium tracking-widest uppercase text-indigo-400/60 mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Degree
              </p>
              <h3
                className="text-white font-bold text-2xl mb-1 leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                B.Tech Computer Science
              </h3>
              <p className="text-violet-300/60 text-sm mb-6 font-medium">
                Specialization in Artificial Intelligence
              </p>

              <div className="flex flex-col gap-3">
                {ACHIEVEMENTS.map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0 text-indigo-400/60 mt-0.5">
                      {icon}
                    </div>
                    <p className="text-white/45 text-sm leading-snug">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:block w-px bg-white/[0.06]" />

            <div className="p-8 md:p-10">
              <p
                className="text-xs font-medium tracking-widest uppercase text-violet-400/60 mb-6"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Relevant Coursework
              </p>
              <div className="flex flex-wrap gap-2">
                {COURSES.map((course) => (
                  <span
                    key={course}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-white/50 text-xs font-medium hover:border-violet-500/25 hover:text-white/65 transition-all cursor-default"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
