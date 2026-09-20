import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api, type Project } from "@/lib/api";
import ProjectPanel from "./ProjectPanel";
import LoginWall from "./LoginWall";

const CATEGORIES = ["All", "AI/ML", "Robotics", "Web Dev", "Cloud", "Security"];

const STATIC_PROJECTS: Project[] = [
  {
    id: 1,
    title: "NeuroVision",
    shortDesc: "Real-time neural network visualization platform.",
    fullDesc: "NeuroVision is a cutting-edge platform designed for real-time visualization of complex neural networks. It provides researchers and developers with a deep look into the inner workings of AI models, enabling better debugging and optimization.",
    tech: ["React", "Three.js", "TensorFlow.js", "Node.js"],
    category: "AI/ML",
    featured: true,
    githubUrl: "https://github.com",
    liveUrl: "https://neurovision.demo",
    imageUrl: null,
    challenges: "Handling large datasets in real-time while maintaining 60FPS visualization.",
    outcomes: "Reduced model debugging time by 40% for internal teams.",
    createdAt: "",
  },
  {
    id: 2,
    title: "RoboCore",
    shortDesc: "Distributed control system for swarm robotics.",
    fullDesc: "RoboCore is a robust distributed control system architecture specifically built for swarm robotics applications. It handles communication, task allocation, and synchronization across hundreds of individual robotic units.",
    tech: ["C++", "ROS", "Python", "MQTT"],
    category: "Robotics",
    featured: true,
    githubUrl: "https://github.com",
    liveUrl: "https://robocore.demo",
    imageUrl: null,
    challenges: "Ensuring low-latency communication in high-density environments.",
    outcomes: "Successfully deployed in a pilot with 50 autonomous warehouse robots.",
    createdAt: "",
  },
  {
    id: 3,
    title: "IntelliChat",
    shortDesc: "Enterprise-grade LLM orchestration layer.",
    fullDesc: "IntelliChat provides a secure and scalable orchestration layer for integrating Large Language Models into enterprise workflows. It features prompt management, cost tracking, and fine-grained access control.",
    tech: ["TypeScript", "Next.js", "OpenAI API", "Redis"],
    category: "Web Dev",
    featured: false,
    githubUrl: "https://github.com",
    liveUrl: "https://intellichat.demo",
    imageUrl: null,
    challenges: "Implementing robust prompt injection protection and PII filtering.",
    outcomes: "Enabled 5 enterprise clients to safely deploy LLM-based internal tools.",
    createdAt: "",
  },
  {
    id: 4,
    title: "CloudMind",
    shortDesc: "Serverless edge computing framework.",
    fullDesc: "CloudMind is a high-performance framework for deploying serverless functions at the network edge. It minimizes latency by executing code as close to the user as possible, with sub-millisecond cold starts.",
    tech: ["Rust", "WebAssembly", "Go", "gRPC"],
    category: "Cloud",
    featured: true,
    githubUrl: "https://github.com",
    liveUrl: "https://cloudmind.demo",
    imageUrl: null,
    challenges: "Optimizing WebAssembly runtime for multi-tenant isolation.",
    outcomes: "Achieved 30% lower latency compared to traditional regional cloud providers.",
    createdAt: "",
  },
  {
    id: 5,
    title: "CyberShield",
    shortDesc: "AI-powered threat detection system.",
    fullDesc: "CyberShield uses advanced machine learning algorithms to identify and neutralize network threats in real-time. It analyzes traffic patterns to detect anomalies that signify zero-day exploits or coordinated attacks.",
    tech: ["Python", "PyTorch", "Elasticsearch", "Docker"],
    category: "Security",
    featured: false,
    githubUrl: "https://github.com",
    liveUrl: "https://cybershield.demo",
    imageUrl: null,
    challenges: "Balancing false positive rates with detection sensitivity in high-volume traffic.",
    outcomes: "Stopped over 10,000 automated attack attempts during its first month.",
    createdAt: "",
  },
];

const ACCENT: Record<string, { badge: string; border: string; glow: string; dot: string }> = {
  "AI/ML": {
    badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    border: "hover:border-indigo-500/30",
    glow: "rgba(99,102,241,0.12)",
    dot: "bg-indigo-400",
  },
  Robotics: {
    badge: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    border: "hover:border-violet-500/30",
    glow: "rgba(139,92,246,0.12)",
    dot: "bg-violet-400",
  },
  Cloud: {
    badge: "bg-sky-500/10 text-sky-300 border-sky-500/20",
    border: "hover:border-sky-500/30",
    glow: "rgba(56,189,248,0.12)",
    dot: "bg-sky-400",
  },
  Security: {
    badge: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    border: "hover:border-amber-500/30",
    glow: "rgba(251,191,36,0.10)",
    dot: "bg-amber-400",
  },
  "Web Dev": {
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    border: "hover:border-emerald-500/30",
    glow: "rgba(52,211,153,0.10)",
    dot: "bg-emerald-400",
  },
};

const DEFAULT_ACCENT = {
  badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  border: "hover:border-indigo-500/30",
  glow: "rgba(99,102,241,0.12)",
  dot: "bg-indigo-400",
};

function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  const a = ACCENT[project.category] ?? DEFAULT_ACCENT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
      layout
      className={`group glass rounded-2xl p-6 border border-white/[0.06] ${a.border} transition-all duration-300 flex flex-col cursor-pointer`}
      style={{ boxShadow: "none" }}
      whileHover={{ boxShadow: `0 16px 48px ${a.glow}`, y: -3 } as never}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${a.dot}`} />
          {project.featured && (
            <span className={`text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full border ${a.badge}`}>
              Featured
            </span>
          )}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
              <Github size={15} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>

      <h3
        className="text-white font-semibold text-lg mb-2 group-hover:text-indigo-200 transition-colors flex items-center gap-1"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {project.title}
        <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-60 transition-opacity -mb-0.5" />
      </h3>

      <p className="text-white/40 text-sm leading-relaxed mb-4 flex-1">{project.shortDesc}</p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.07] text-white/45"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {t}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="text-[11px] px-2 py-1 text-white/25">+{project.tech.length - 3}</span>
          )}
        </div>
        <span className="text-[11px] text-indigo-400/50 group-hover:text-indigo-300 transition-colors whitespace-nowrap ml-2">
          View details →
        </span>
      </div>
    </motion.div>
  );
}

interface ProjectsProps {
  onOpenAuth?: () => void;
}

export default function Projects({ onOpenAuth }: ProjectsProps) {
  const { isLoggedIn } = useAuth();
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState<Project[]>(STATIC_PROJECTS);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    api.projects.list()
      .then((data) => { if (data?.length) setProjects(data); })
      .catch(() => {});
  }, [isLoggedIn]);

  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  const availableCategories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  return (
    <section
      id="projects"
      className="py-32 relative"
      style={{ background: "radial-gradient(ellipse at 30% 60%, rgba(99,102,241,0.05) 0%, transparent 60%)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="section-tag">Projects</span>
            <h2
              className="text-4xl md:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
            >
              Things I've <span className="gradient-text">shipped</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-white/[0.04] text-white/40 hover:text-white/70 border border-white/[0.07]"
                }`}
                data-testid={`filter-${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoggedIn ? (
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onClick={() => setSelectedId(project.id)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <LoginWall
            title="Projects are private"
            subtitle="Sign in or create a free account to explore my full project portfolio with detailed breakdowns, tech stacks, and outcomes."
            onOpenAuth={onOpenAuth || (() => {})}
          />
        )}
      </div>

      <ProjectPanel projectId={selectedId} onClose={() => setSelectedId(null)} />
    </section>
  );
}
