import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, LogOut, LayoutDashboard, Award, FolderOpen, ChevronLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api, type Project, type Certificate } from "@/lib/api";
import { useLocation } from "wouter";

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-2xl bg-[rgba(10,10,18,0.98)] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
          <h3 className="text-white font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
      </motion.div>
    </div>
  );
}

function InputField({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-1.5">{label}</label>
      <input
        {...props}
        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg py-2.5 px-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
      />
    </div>
  );
}

function TextareaField({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-1.5">{label}</label>
      <textarea
        {...props}
        rows={3}
        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg py-2.5 px-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
      />
    </div>
  );
}

function ProjectForm({ initial, onSave, onClose }: {
  initial?: Partial<Project>;
  onSave: (data: Partial<Project>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    shortDesc: initial?.shortDesc ?? "",
    fullDesc: initial?.fullDesc ?? "",
    category: initial?.category ?? "AI/ML",
    tech: (initial?.tech ?? []).join(", "),
    featured: initial?.featured ?? false,
    githubUrl: initial?.githubUrl ?? "",
    liveUrl: initial?.liveUrl ?? "",
    challenges: initial?.challenges ?? "",
    outcomes: initial?.outcomes ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setErr("");
    try {
      await onSave({
        ...form,
        tech: form.tech.split(",").map((t) => t.trim()).filter(Boolean),
      });
      onClose();
    } catch (ex: any) {
      setErr(ex.message || "Save failed");
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {err && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{err}</div>}
      <InputField label="Title" value={form.title} onChange={(e) => set("title", e.target.value)} required />
      <InputField label="Short Description" value={form.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} required />
      <TextareaField label="Full Description" value={form.fullDesc} onChange={(e) => set("fullDesc", e.target.value)} required />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Category</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
          >
            {["AI/ML", "Robotics", "Web Dev", "Cloud", "Security"].map((c) => (
              <option key={c} value={c} className="bg-[#0a0a12]">{c}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="w-4 h-4 accent-indigo-500"
            />
            <span className="text-sm text-white/60">Featured</span>
          </label>
        </div>
      </div>
      <InputField label="Tech Stack (comma separated)" value={form.tech} onChange={(e) => set("tech", e.target.value)} placeholder="React, Node.js, Python" />
      <div className="grid grid-cols-2 gap-4">
        <InputField label="GitHub URL" value={form.githubUrl ?? ""} onChange={(e) => set("githubUrl", e.target.value)} placeholder="https://github.com/..." />
        <InputField label="Live URL" value={form.liveUrl ?? ""} onChange={(e) => set("liveUrl", e.target.value)} placeholder="https://..." />
      </div>
      <TextareaField label="Challenges" value={form.challenges ?? ""} onChange={(e) => set("challenges", e.target.value)} />
      <TextareaField label="Outcomes" value={form.outcomes ?? ""} onChange={(e) => set("outcomes", e.target.value)} />
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/[0.08] text-white/50 hover:text-white text-sm transition-all">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all disabled:opacity-50">
          {saving ? "Saving..." : "Save Project"}
        </button>
      </div>
    </form>
  );
}

function CertForm({ initial, onSave, onClose }: {
  initial?: Partial<Certificate>;
  onSave: (data: Partial<Certificate>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    issuer: initial?.issuer ?? "",
    date: initial?.date ?? "",
    category: initial?.category ?? "AI/ML",
    credentialUrl: initial?.credentialUrl ?? "",
    description: initial?.description ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setErr("");
    try { await onSave(form); onClose(); }
    catch (ex: any) { setErr(ex.message || "Save failed"); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {err && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{err}</div>}
      <InputField label="Title" value={form.title} onChange={(e) => set("title", e.target.value)} required />
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Issuer" value={form.issuer} onChange={(e) => set("issuer", e.target.value)} required />
        <InputField label="Date" value={form.date} onChange={(e) => set("date", e.target.value)} placeholder="2024" required />
      </div>
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Category</label>
        <select
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
        >
          {["AI/ML", "Cloud", "Robotics", "Web Dev", "Security"].map((c) => (
            <option key={c} value={c} className="bg-[#0a0a12]">{c}</option>
          ))}
        </select>
      </div>
      <InputField label="Credential URL" value={form.credentialUrl ?? ""} onChange={(e) => set("credentialUrl", e.target.value)} placeholder="https://..." />
      <TextareaField label="Description" value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} />
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/[0.08] text-white/50 hover:text-white text-sm transition-all">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all disabled:opacity-50">
          {saving ? "Saving..." : "Save Certificate"}
        </button>
      </div>
    </form>
  );
}

type Tab = "projects" | "certificates";

export default function AdminDashboard() {
  const { user, logout, isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [modal, setModal] = useState<{ type: "addProject" | "editProject" | "addCert" | "editCert"; item?: Project | Certificate } | null>(null);

  useEffect(() => {
    if (!isAdmin) navigate("/");
  }, [isAdmin]);

  useEffect(() => {
    api.projects.list().then(setProjects).catch(() => {});
    api.certificates.list().then(setCerts).catch(() => {});
  }, []);

  const refresh = () => {
    api.projects.list().then(setProjects).catch(() => {});
    api.certificates.list().then(setCerts).catch(() => {});
  };

  const deleteProject = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    await api.projects.delete(id);
    refresh();
  };

  const deleteCert = async (id: number) => {
    if (!confirm("Delete this certificate?")) return;
    await api.certificates.delete(id);
    refresh();
  };

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      <header className="border-b border-white/[0.06] bg-[rgba(8,8,15,0.9)] backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-bold text-white/90" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Admin<span className="text-indigo-400">.</span>
            </span>
            <span className="text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/40">{user?.email}</span>
            <button
              onClick={async () => { await logout(); navigate("/"); }}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-1 mb-8 border-b border-white/[0.06] pb-0">
          {(["projects", "certificates"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${
                tab === t ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {t === "projects" ? <FolderOpen size={15} /> : <Award size={15} />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {tab === t && (
                <motion.div
                  layoutId="admin-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Projects <span className="text-white/30 text-base font-normal">({projects.length})</span>
                </h2>
                <button
                  onClick={() => setModal({ type: "addProject" })}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition-all"
                >
                  <Plus size={15} /> Add Project
                </button>
              </div>
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id} className="glass rounded-xl p-4 border border-white/[0.06] flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-white text-sm">{p.title}</span>
                        {p.featured && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Featured</span>}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/[0.06]">{p.category}</span>
                      </div>
                      <p className="text-xs text-white/30 truncate">{p.shortDesc}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setModal({ type: "editProject", item: p })}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-indigo-500/20 flex items-center justify-center text-white/40 hover:text-indigo-300 transition-all"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteProject(p.id)}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white/40 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "certificates" && (
            <motion.div
              key="certs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Certificates <span className="text-white/30 text-base font-normal">({certs.length})</span>
                </h2>
                <button
                  onClick={() => setModal({ type: "addCert" })}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition-all"
                >
                  <Plus size={15} /> Add Certificate
                </button>
              </div>
              <div className="space-y-3">
                {certs.map((c) => (
                  <div key={c.id} className="glass rounded-xl p-4 border border-white/[0.06] flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-white text-sm">{c.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/[0.06]">{c.category}</span>
                      </div>
                      <p className="text-xs text-white/30">{c.issuer} &middot; {c.date}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setModal({ type: "editCert", item: c })}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-indigo-500/20 flex items-center justify-center text-white/40 hover:text-indigo-300 transition-all"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteCert(c.id)}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white/40 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {modal && (
          <Modal
            title={
              modal.type === "addProject" ? "Add Project" :
              modal.type === "editProject" ? "Edit Project" :
              modal.type === "addCert" ? "Add Certificate" : "Edit Certificate"
            }
            onClose={() => setModal(null)}
          >
            {(modal.type === "addProject" || modal.type === "editProject") && (
              <ProjectForm
                initial={modal.type === "editProject" ? (modal.item as Project) : undefined}
                onSave={async (data) => {
                  if (modal.type === "editProject" && modal.item) {
                    await api.projects.update((modal.item as Project).id, data);
                  } else {
                    await api.projects.create(data);
                  }
                  refresh();
                }}
                onClose={() => setModal(null)}
              />
            )}
            {(modal.type === "addCert" || modal.type === "editCert") && (
              <CertForm
                initial={modal.type === "editCert" ? (modal.item as Certificate) : undefined}
                onSave={async (data) => {
                  if (modal.type === "editCert" && modal.item) {
                    await api.certificates.update((modal.item as Certificate).id, data);
                  } else {
                    await api.certificates.create(data);
                  }
                  refresh();
                }}
                onClose={() => setModal(null)}
              />
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
