import { motion } from "framer-motion";
import { Code2, BrainCircuit, Cpu, Rocket } from "lucide-react";

const PILLARS = [
  {
    icon: <Code2 size={20} className="text-indigo-400" />,
    title: "Full-Stack Engineering",
    desc: "Building resilient, scalable web applications — from database architecture to pixel-perfect UIs — with a focus on performance and maintainability.",
  },
  {
    icon: <BrainCircuit size={20} className="text-violet-400" />,
    title: "AI & Machine Learning",
    desc: "Engineering intelligent systems — neural networks, computer vision pipelines, and NLP models — that solve real-world problems at scale.",
  },
  {
    icon: <Cpu size={20} className="text-indigo-300" />,
    title: "Robotics & Embedded",
    desc: "Bridging software and the physical world through ROS, autonomous navigation, sensor fusion, and embedded system design.",
  },
  {
    icon: <Rocket size={20} className="text-violet-300" />,
    title: "Systems Thinking",
    desc: "Designing architectures that are not just functional but elegant — resilient under load, easy to evolve, and joyful to maintain.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function About() {
  return (
    <section id="about" className="py-32 relative" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.04) 0%, transparent 60%)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:sticky lg:top-32"
          >
            <span className="section-tag">About</span>
            <h2
              className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
            >
              Building at the edge of{" "}
              <span className="gradient-text">what's possible</span>
            </h2>
            <p className="text-white/45 text-base leading-relaxed mb-6">
              I'm a developer who lives at the intersection of AI, robotics, and software engineering. My work is driven by a belief that the most meaningful technology is built by people who care deeply about both the craft and the impact.
            </p>
            <p className="text-white/35 text-sm leading-relaxed">
              From training neural networks to deploying full-stack applications, I approach every problem with curiosity, rigor, and a relentless bias toward shipping.
            </p>

            <div className="mt-10 flex flex-col gap-3">
              {[
                { label: "Based in", value: "India" },
                { label: "Specialization", value: "AI + Full Stack" },
                { label: "Status", value: "Open to work" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                  <span className="text-white/35 text-sm">{label}</span>
                  <span className="text-white/70 text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {PILLARS.map((p) => (
              <motion.div
                key={p.title}
                variants={cardVariants}
                className="glass rounded-2xl p-6 glass-hover"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                  {p.icon}
                </div>
                <h3
                  className="text-white font-semibold text-base mb-3"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {p.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}

            <motion.div
              variants={cardVariants}
              className="sm:col-span-2 glass rounded-2xl p-6 border border-indigo-500/10"
              style={{ background: "rgba(99,102,241,0.04)" }}
            >
              <p
                className="text-white/60 text-base leading-relaxed italic"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                "I don't just write code — I engineer experiences. Every system I build is a reflection of how I think: clearly, deeply, and with an eye for what lasts."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
