import { useState } from "react";
import IntroAnimation from "@/components/IntroAnimation";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);

  if (showIntro) {
    return <IntroAnimation onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-x-hidden">
      <CustomCursor />
      <Navigation onSignInClick={() => setAuthOpen(true)} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects onOpenAuth={() => setAuthOpen(true)} />
        <Experience />
        <Education />
        <Certificates onOpenAuth={() => setAuthOpen(true)} />
        <Contact />
      </main>
      <Footer />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
