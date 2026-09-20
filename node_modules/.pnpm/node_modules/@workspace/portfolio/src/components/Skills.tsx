import { motion } from "framer-motion";

const SKILL_GROUPS = [
  {
    category: "Languages",
    color: "indigo",
    skills: [
      { name: "Python", level: 95 },
      { name: "TypeScript", level: 88 },
      { name: "JavaScript", level: 90 },
      { name: "C++", level: 72 },
    ],
  },
  {
    category: "Frontend",
    color: "violet",
    skills: [
      { name: "React", level: 90 },
      { name: "Next.js", level: 82 },
      { name: "Tailwind CSS", level: 92 },
      { name: "Framer Motion", level: 80 },
    ],
  },
  {
    category: "AI / ML",
    color: "indigo",
    skills: [
      { name: "TensorFlow", level: 82 },
      { name: "PyTorch", level: 78 },
      { name: "OpenCV", level: 86 },
      { name: "Scikit-learn", level: 84 },
    ],
  },
  {
    category: "Infrastructure",
    color: "violet",
    skills: [
      { name: "Node.js", level: 86 },
      { name: "Docker", level: 80 },
      { name: "AWS", level: 76 },
      { name: "PostgreSQL", level: 84 },
    ],
  },
];

const COLOR_MAP: Record<string, { bar: string; bg: string; border: string }> = {
  indigo: {
    bar: "from-indigo-500 to-indigo-400",
    bg: "bg-indigo-500/8",
    border: "border-indigo-500/15",
  },
  violet: {
    bar: "from-violet-500 to-violet-400",
    bg: "bg-violet-500/8",
    border: "border-violet-500/15",
  },
};

function SkillBar({ name, level, color, index }: { name: string; level: number; color: string; index: number }) {
  const c = COLOR_MAP[color];
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/70 text-sm font-medium group-hover:text-white/90 transition-colors">
          {name}
        </span>
        <span
          className="text-xs font-medium tabular-nums"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(165,180,252,0.5)" }}
        >
          {level}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${c.bar}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.3 + index * 0.07, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-32 relative" style={{ background: "radial-gradient(ellipse at 80% 30%, rgba(139,92,246,0.05) 0%, transparent 60%)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="section-tag">Skills</span>
          <h2
            className="text-4xl md:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
          >
            Tools I <span className="gradient-text">think with</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILL_GROUPS.map((group, gi) => {
            const c = COLOR_MAP[group.color];
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: gi * 0.1, ease: "easeOut" }}
                className={`glass rounded-2xl p-6 border ${c.border} ${c.bg} glass-hover`}
              >
                <p
                  className="text-xs font-medium tracking-widest uppercase mb-6"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: group.color === "indigo" ? "rgba(129,140,248,0.7)" : "rgba(167,139,250,0.7)" }}
                >
                  {group.category}
                </p>
                <div className="flex flex-col gap-5">
                  {group.skills.map((skill, si) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      level={skill.level}
                      color={group.color}
                      index={si}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 glass rounded-2xl p-6 flex flex-wrap gap-3"
        >
          {["ROS", "MongoDB", "Redis", "Git", "Linux", "FastAPI", "Kubernetes", "Elasticsearch", "WebRTC", "GraphQL", "Prisma", "Drizzle"].map((tool) => (
            <span
              key={tool}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-white/50 text-xs font-medium hover:text-white/70 hover:border-indigo-500/30 transition-all cursor-default"
            >
              {tool}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
