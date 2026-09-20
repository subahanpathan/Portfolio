import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";

const ROLES = ["AI Developer", "Software Engineer", "Robotics Enthusiast", "Full Stack Developer"];

function FloatingOrb({ x, y, size, color, delay }: { x: string; y: string; size: number; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color }}
      animate={{ y: [-12, 12, -12], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function GridLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.2 + 0.3,
        a: Math.random() * Math.PI * 2,
      });
    }

    let raf: number;
    let t = 0;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.006;

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165,180,252,${0.2 + 0.2 * Math.sin(t + i)})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(99,102,241,${(1 - d / 100) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "radial-gradient(ellipse at 60% 50%, rgba(99,102,241,0.07) 0%, transparent 60%)" }}>
      <GridLines />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
      />

      <FloatingOrb x="65%" y="15%" size={480} color="rgba(99,102,241,0.08)" delay={0} />
      <FloatingOrb x="75%" y="55%" size={320} color="rgba(139,92,246,0.07)" delay={2} />
      <FloatingOrb x="10%" y="70%" size={260} color="rgba(99,102,241,0.05)" delay={4} />

      <div className="max-w-6xl mx-auto px-6 w-full pt-28 pb-20 relative z-10">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div variants={itemVariants}>
              <span className="section-tag">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Available for opportunities
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Subahan
              <br />
              <span className="gradient-text">Pathan</span>
            </motion.h1>

            <motion.div variants={itemVariants} className="h-9 mb-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={ROLES[roleIndex]}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-lg text-white/50 font-medium tracking-wide"
                >
                  {ROLES[roleIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-white/40 text-base leading-relaxed mb-10 max-w-xl"
            >
              I engineer intelligent systems at the intersection of AI, robotics, and full-stack development — driven by a mission to build the tools of tomorrow.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              <button
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all glow-indigo"
                data-testid="hero-explore-btn"
              >
                Explore Projects
              </button>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-semibold text-sm transition-all"
                data-testid="hero-contact-btn"
              >
                Get In Touch
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-4 mt-8">
              {[
                { href: "https://github.com", icon: <Github size={18} />, label: "GitHub" },
                { href: "https://linkedin.com", icon: <Linkedin size={18} />, label: "LinkedIn" },
                { href: "mailto:subahan@example.com", icon: <Mail size={18} />, label: "Email" },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/30 hover:text-indigo-300 transition-colors text-sm"
                  data-testid={`hero-social-${label.toLowerCase()}`}
                >
                  {icon}
                  <span className="hidden sm:inline">{label}</span>
                </a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="hidden lg:flex flex-col gap-4"
          >
            {[
              { value: "20+", label: "Projects Built" },
              { value: "3+", label: "Years Coding" },
              { value: "5+", label: "Tech Domains" },
              { value: "∞", label: "Lines of Code" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="glass rounded-2xl px-8 py-5 text-center glass-hover"
              >
                <p className="text-3xl font-bold gradient-text mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{value}</p>
                <p className="text-white/35 text-xs font-medium tracking-wide">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} className="text-white/20" />
        </motion.div>
      </motion.div>
    </section>
  );
}
