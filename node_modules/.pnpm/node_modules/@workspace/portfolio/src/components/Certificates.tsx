import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api, type Certificate } from "@/lib/api";
import CertificatePanel from "./CertificatePanel";
import LoginWall from "./LoginWall";

const STATIC_CERTS: Certificate[] = [
  {
    id: 1,
    title: "TensorFlow Developer Certificate",
    issuer: "Google",
    date: "2023",
    credentialUrl: "https://google.com/certificate",
    category: "AI/ML",
    description: "Proficiency in building and deploying ML models with TensorFlow.",
    createdAt: "",
  },
  {
    id: 2,
    title: "AWS Solutions Architect Associate",
    issuer: "Amazon",
    date: "2023",
    credentialUrl: "https://aws.amazon.com/certificate",
    category: "Cloud",
    description: "Design and deployment of scalable systems on AWS.",
    createdAt: "",
  },
  {
    id: 3,
    title: "ROS Developer Certification",
    issuer: "Open Robotics",
    date: "2022",
    credentialUrl: "https://ros.org/certificate",
    category: "Robotics",
    description: "Expertise in Robot Operating System (ROS) and robot programming.",
    createdAt: "",
  },
  {
    id: 4,
    title: "Meta React Developer",
    issuer: "Meta",
    date: "2022",
    credentialUrl: "https://coursera.org/certificate",
    category: "Web Dev",
    description: "Advanced frontend development using React and modern ecosystem.",
    createdAt: "",
  },
];

const CATEGORY_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  "AI/ML": { bg: "bg-indigo-500/10", text: "text-indigo-300", border: "border-indigo-500/20" },
  Cloud: { bg: "bg-sky-500/10", text: "text-sky-300", border: "border-sky-500/20" },
  Robotics: { bg: "bg-violet-500/10", text: "text-violet-300", border: "border-violet-500/20" },
  "Web Dev": { bg: "bg-emerald-500/10", text: "text-emerald-300", border: "border-emerald-500/20" },
};

const ISSUER_BADGE: Record<string, string> = {
  Google: "G",
  Amazon: "A",
  "Open Robotics": "R",
  Meta: "M",
};

function CertCard({ cert, index, onClick }: { cert: Certificate; index: number; onClick: () => void }) {
  const cat = CATEGORY_COLOR[cert.category] ?? { bg: "bg-white/5", text: "text-white/50", border: "border-white/10" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      onClick={onClick}
      className="group glass rounded-2xl p-6 border border-white/[0.06] hover:border-indigo-500/25 transition-all duration-300 cursor-pointer"
      whileHover={{ y: -3, boxShadow: "0 16px 40px rgba(99,102,241,0.12)" } as never}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-400">
          <Award size={18} />
        </div>
        <span
          className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}
        >
          {cert.category}
        </span>
      </div>

      <h3
        className="text-white font-semibold text-base mb-1.5 group-hover:text-indigo-200 transition-colors"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {cert.title}
      </h3>
      <p className="text-white/40 text-xs mb-4">{cert.issuer} &middot; {cert.date}</p>

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-indigo-400/70 group-hover:text-indigo-300 transition-colors flex items-center gap-1">
          View details
          <ExternalLink size={10} />
        </span>
        {cert.credentialUrl && (
          <span className="text-[10px] text-white/25 border border-white/[0.06] rounded-md px-2 py-0.5">
            Verified
          </span>
        )}
      </div>
    </motion.div>
  );
}

interface CertificatesProps {
  onOpenAuth?: () => void;
}

export default function Certificates({ onOpenAuth }: CertificatesProps) {
  const { isLoggedIn } = useAuth();
  const [certs, setCerts] = useState<Certificate[]>(STATIC_CERTS);
  const [selected, setSelected] = useState<Certificate | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    api.certificates.list()
      .then((data) => { if (data?.length) setCerts(data); })
      .catch(() => {});
  }, [isLoggedIn]);

  return (
    <section
      id="certificates"
      className="py-32 relative"
      style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.05) 0%, transparent 60%)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <span className="section-tag">Certificates</span>
          <h2
            className="text-4xl md:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
          >
            Proof of <span className="gradient-text">mastery</span>
          </h2>
          <p className="text-white/40 text-base mt-4 max-w-xl">
            Industry-recognized credentials validating expertise across AI, cloud, robotics, and software development.
          </p>
        </div>

        {isLoggedIn ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {certs.map((cert, i) => (
              <CertCard
                key={cert.id}
                cert={cert}
                index={i}
                onClick={() => setSelected(cert)}
              />
            ))}
          </div>
        ) : (
          <LoginWall
            title="Certificates are private"
            subtitle="Sign in or create a free account to view my verified certifications from Google, Amazon, Meta, and Open Robotics with credential links."
            onOpenAuth={onOpenAuth || (() => {})}
          />
        )}
      </div>

      <CertificatePanel certificate={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
