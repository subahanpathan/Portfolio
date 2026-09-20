import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink, Layers, Target, Zap } from "lucide-react";
import { api, type Project } from "@/lib/api";

interface ProjectPanelProps {
  projectId: number | null;
  onClose: () => void;
}

const CATEGORY_COLOR: Record<string, string> = {
  "AI/ML": "bg-indigo-500/15 text-indigo-300 border-indigo-500/25",
  Robotics: "bg-violet-500/15 text-violet-300 border-violet-500/25",
  Cloud: "bg-sky-500/15 text-sky-300 border-sky-500/25",
  Security: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  "Web Dev": "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
};

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 p-8 pt-16">
      <div className="h-3 w-24 bg-white/10 rounded-full" />
      <div className="h-8 w-3/4 bg-white/10 rounded-xl" />
      <div className="h-4 w-1/2 bg-white/10 rounded-lg" />
      <div className="h-px bg-white/[0.06] my-6" />
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 bg-white/[0.06] rounded-lg" style={{ width: `${70 + i * 7}%` }} />
        ))}
      </div>
    </div>
  );
}

export default function ProjectPanel({ projectId, onClose }: ProjectPanelProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId === null) { setProject(null); return; }
    setLoading(true);
    api.projects.get(projectId)
      .then(setProject)
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isOpen = projectId !== null;

  return (
    <AnimatePresence>
      {isOpen && (
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

            {loading && <Skeleton />}

            {!loading && project && (
              <div className="p-8 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`text-[11px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-full border ${
                      CATEGORY_COLOR[project.category] ?? "bg-white/10 text-white/50 border-white/10"
                    }`}
                  >
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="text-[11px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Featured
                    </span>
                  )}
                </div>

                <h2
                  className="text-3xl font-bold text-white mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
                >
                  {project.title}
                </h2>

                <p className="text-white/50 text-sm leading-relaxed mb-6">{project.shortDesc}</p>

                <div className="flex gap-3 mb-8">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.07] text-white/60 hover:text-white text-sm transition-all"
                    >
                      <Github size={15} /> GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white text-sm transition-all"
                    >
                      <ExternalLink size={15} /> Live Demo
                    </a>
                  )}
                </div>

                <div className="h-px bg-white/[0.06] mb-8" />

                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers size={14} className="text-indigo-400" />
                    <span className="text-xs font-semibold tracking-wider uppercase text-white/40">Overview</span>
                  </div>
                  <p className="text-white/65 text-sm leading-relaxed">{project.fullDesc}</p>
                </div>

                {project.challenges && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap size={14} className="text-amber-400" />
                      <span className="text-xs font-semibold tracking-wider uppercase text-white/40">Challenges</span>
                    </div>
                    <p className="text-white/65 text-sm leading-relaxed">{project.challenges}</p>
                  </div>
                )}

                {project.outcomes && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Target size={14} className="text-emerald-400" />
                      <span className="text-xs font-semibold tracking-wider uppercase text-white/40">Outcomes</span>
                    </div>
                    <p className="text-white/65 text-sm leading-relaxed">{project.outcomes}</p>
                  </div>
                )}

                <div className="h-px bg-white/[0.06] mb-6" />

                <div>
                  <span className="text-xs font-semibold tracking-wider uppercase text-white/40 block mb-3">Tech Stack</span>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-white/50"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!loading && !project && projectId !== null && (
              <div className="flex items-center justify-center h-full text-white/30 text-sm">
                Failed to load project details.
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
