import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FRAMES: { text: string; type: "word" | "code" | "dim"; duration: number }[] = [
  { text: "some people",         type: "dim",  duration: 900  },
  { text: "dream",               type: "word", duration: 800  },
  { text: "about changing",      type: "dim",  duration: 850  },
  { text: "the world.",          type: "word", duration: 950  },
  { text: "others",              type: "dim",  duration: 800  },
  { text: "open their terminal", type: "word", duration: 1100 },
  { text: "and get to work.",    type: "word", duration: 1200 },
  { text: "$ git init",          type: "code", duration: 1000 },
  { text: "$ npm run build",     type: "code", duration: 900  },
  { text: "every great product", type: "dim",  duration: 950  },
  { text: "started with",        type: "dim",  duration: 750  },
  { text: "one line of code.",   type: "word", duration: 1200 },
  { text: "which one",           type: "dim",  duration: 800  },
  { text: "are you?",            type: "word", duration: 1400 },
];

const TRANSITION_MS = 400;

function useScramble(text: string, running: boolean) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!running || !text) {
      setDisplayText(text);
      return;
    }

    let intervalId: ReturnType<typeof setInterval>;
    let timeoutId: ReturnType<typeof setTimeout>;

    // Start scrambling
    intervalId = setInterval(() => {
      const scrambled = text.split('').map(char => {
        if (char === ' ') return ' ';
        // Random printable ASCII (33-126)
        return String.fromCharCode(Math.floor(Math.random() * (126 - 33 + 1)) + 33);
      }).join('');
      setDisplayText(scrambled);
    }, 40);

    // Stop scrambling after ~400ms and snap to real text
    timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      setDisplayText(text);
    }, 400);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [text, running]);

  return displayText;
}

function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 256;
    canvas.height = 256;
    const imageData = ctx.createImageData(256, 256);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 12;
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        opacity: 0.35,
        pointerEvents: "none",
        imageRendering: "pixelated",
      }}
    />
  );
}

function FloatingCode() {
  const items = [
    "const future = build();",
    "while (alive) { create(); }",
    "if (dream) { execute(); }",
    "git commit -m 'init'",
    "function solve(problem) {}",
    "import { passion } from 'life';",
    "export default Developer;",
    "npm install ambition",
    "sudo make me a sandwich",
    "// TODO: change the world",
    "print('hello, world')",
    "for (;;) { learn(); }",
    "await success();",
    "let count = 0;",
    "return true;",
    "if (ready) start();"
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {items.map((item, i) => {
        const cols = 4;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = (col * 25) + 5;
        const yOffset = (row * 25) + 5;
        const delay = i * 0.4;
        const duration = 20 + (i % 3) * 5;
        
        return (
          <motion.span
            key={item + i}
            style={{
              position: "absolute",
              left: `${x}%`,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(9px, 1vw, 12px)",
              color: "rgba(255,255,255,1)",
              whiteSpace: "nowrap",
              letterSpacing: "0.05em",
            }}
            initial={{ top: `${yOffset + 100}%`, opacity: 0.08 }}
            animate={{ top: [`${yOffset + 100}%`, `${yOffset - 100}%`], opacity: [0.08, 0.14, 0.08] }}
            transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
          >
            {item}
          </motion.span>
        );
      })}
    </div>
  );
}

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [frameIndex, setFrameIndex] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setExiting(true);
    setTimeout(onComplete, 700);
  };

  useEffect(() => {
    const skipTimer = setTimeout(() => setShowSkip(true), 2500);

    let index = 0;
    let cancelled = false;

    // Calculate total duration for progress bar
    const totalDuration = FRAMES.reduce((acc, f) => acc + f.duration + TRANSITION_MS, 0);
    const startTime = Date.now() + 600; // 600ms initial delay

    const progressInterval = setInterval(() => {
      if (cancelled || doneRef.current) return;
      const elapsed = Date.now() - startTime;
      const p = Math.min(Math.max(elapsed / totalDuration, 0), 1);
      setProgress(p * 100);
    }, 50);

    const runFrame = () => {
      if (cancelled || doneRef.current) return;
      
      if (index === 7) {
        // Just before "$ git init", trigger the white flash beat
        setShowFlash(true);
        setTimeout(() => {
          if (!cancelled) setShowFlash(false);
        }, 120); // fade in 120ms then out 200ms is handled by css/framer
        
        // Wait a bit for the flash effect before showing the code
        setTimeout(() => {
          if (cancelled || doneRef.current) return;
          continueFrame();
        }, 300);
        return;
      }
      
      continueFrame();
    };
    
    const continueFrame = () => {
      if (cancelled || doneRef.current) return;
      if (index >= FRAMES.length) {
        setTimeout(finish, 300);
        return;
      }

      setFrameIndex(index);
      setVisible(true);

      const holdTime = FRAMES[index].duration;

      setTimeout(() => {
        if (cancelled || doneRef.current) return;
        setVisible(false);
        setTimeout(() => {
          if (cancelled || doneRef.current) return;
          index++;
          runFrame();
        }, TRANSITION_MS);
      }, holdTime);
    };

    const startTimer = setTimeout(runFrame, 600);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      clearTimeout(skipTimer);
      clearInterval(progressInterval);
    };
  }, []);

  const frame = frameIndex >= 0 && frameIndex < FRAMES.length ? FRAMES[frameIndex] : null;

  const isCode = frame?.type === "code";
  const isDim = frame?.type === "dim";
  
  const scrambledText = useScramble(frame?.text || "", visible);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: "#000000" }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <div 
        className="absolute top-0 left-0 h-[2px] bg-white z-40 transition-all duration-75 ease-linear"
        style={{ width: `${progress}%` }}
      />
      
      <GrainOverlay />
      <FloatingCode />

      <AnimatePresence>
        {showFlash && (
          <motion.div
            className="absolute inset-0 bg-white z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full flex items-center justify-center px-8">
        <AnimatePresence mode="wait">
          {frame && (
            <motion.div
              key={frameIndex}
              initial={{ opacity: 0, y: visible ? 10 : -10, filter: "blur(6px)" }}
              animate={visible
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: -8, filter: "blur(4px)" }
              }
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="text-center"
            >
              {isCode ? (
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
                    fontWeight: 400,
                    letterSpacing: "0.04em",
                    color: "rgba(165, 180, 252, 0.7)",
                  }}
                >
                  {scrambledText}
                </span>
              ) : (
                <span
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                    fontWeight: isDim ? 300 : 600,
                    letterSpacing: isDim ? "0.01em" : "-0.02em",
                    color: isDim ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.96)",
                    lineHeight: 1.15,
                  }}
                >
                  {scrambledText}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showSkip && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={finish}
            className="absolute bottom-8 right-8 z-20 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 transition-colors px-3 py-1 rounded-full"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
            }}
            data-testid="button-skip-intro"
          >
            skip
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
