import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Download } from 'lucide-react';

const Github = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const words = [
  "Full Stack Developer",
  "AI & Data Science Graduate",
  "PERN Stack Specialist",
  "Problem Solver"
];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [resumeUrl, setResumeUrl] = useState("/resume.pdf");

  useEffect(() => {
    fetch("http://localhost:5000/api/contact")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.resume_url) {
          setResumeUrl(data.resume_url);
        }
      })
      .catch((err) => console.error("Error loading CV link from DB:", err));
  }, []);

  useEffect(() => {
    const handleTyping = () => {
      const fullWord = words[wordIndex];
      
      if (!isDeleting) {
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        setSpeed(80);
        
        if (currentText === fullWord) {
          setSpeed(2200); // Wait on complete word
          setIsDeleting(true);
        }
      } else {
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        setSpeed(40);
        
        if (currentText === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
          setSpeed(300); // Brief pause before starting next word
        }
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex, speed]);

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden"
    >
      {/* Decorative Blur Background Gimmick */}
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full radial-glow-blue pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full radial-glow-purple pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Hero Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-5">
            Welcome to my space
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white leading-tight mb-4">
            Hi, I'm <br className="sm:hidden" />
            <span className="text-gradient">Raja Mohamed</span>
          </h1>

          <div className="h-8 md:h-10 mb-6 flex items-center justify-center lg:justify-start">
            <span className="text-lg md:text-2xl font-bold font-sans text-slate-700 dark:text-slate-200">
              {currentText}
            </span>
            <span className="w-1.5 h-6 bg-blue-500 dark:bg-blue-400 ml-1.5 animate-pulse rounded-full" />
          </div>

          <p className="text-sm md:text-base text-slate-600 dark:text-slate-350 max-w-xl mb-8 leading-relaxed font-sans">
            Bridging full-stack engineering, AI integration, and user-centric design. Skilled in Python, React, Node.js, and PostgreSQL, coupled with a background in creative design (Figma, Photoshop, Canva). Dedicated to building fast, intelligent, and beautifully designed web solutions.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
            <a 
              onClick={() => handleScrollTo('projects')}
              className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm shadow-md hover:scale-102 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
            >
              Explore Work <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              onClick={() => handleScrollTo('contact')}
              className="px-6 py-3 rounded-xl bg-white text-blue-500 font-semibold text-sm border border-blue-500/80 hover:bg-blue-50 hover:scale-102 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              Let's Talk
            </a>
            <a 
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-white text-slate-700 font-semibold text-sm border border-slate-300 hover:border-blue-500 hover:text-blue-600 hover:scale-102 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <Download size={16} />
              Download CV
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-2">
              Connect:
            </span>
            <a 
              href="https://www.linkedin.com/in/rajamd18" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-xl bg-blue-50/70 border border-blue-200/50 text-blue-500 hover:scale-110 hover:-translate-y-0.5 transition-all shadow-sm"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a 
              href="https://github.com/RajaEditz" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-xl bg-blue-50/70 border border-blue-200/50 text-blue-500 hover:scale-110 hover:-translate-y-0.5 transition-all shadow-sm"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a 
              href="mailto:rajaaysha78@gmail.com" 
              className="p-2 rounded-xl bg-blue-50/70 border border-blue-200/50 text-blue-500 hover:scale-110 hover:-translate-y-0.5 transition-all shadow-sm"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
            <a 
              href="https://www.instagram.com/raja.editz._?igsh=MWI0MXN0OHQ1NnM0Yg==" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-xl bg-blue-50/70 border border-blue-200/50 text-blue-500 hover:scale-110 hover:-translate-y-0.5 transition-all shadow-sm"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>
        </motion.div>

        {/* Hero Right Graphic Illustration */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 flex justify-center w-full relative"
        >
          {/* Glass Card Container */}
          <div className="w-full max-w-md rounded-2xl glass-card overflow-hidden text-left relative z-10 flex flex-col h-[320px] font-mono text-xs border border-slate-300/40 dark:border-slate-800/70 bg-white/40 dark:bg-slate-950/40">
            {/* Editor Top Bar */}
            <div className="px-4 py-3 bg-slate-200/50 dark:bg-slate-900/50 border-b border-slate-300/30 dark:border-slate-800/50 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-blue-500/80" />
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold select-none">
                raja_portfolio.js
              </span>
              <div className="w-10 h-2 bg-slate-300/30 dark:bg-slate-800/30 rounded" />
            </div>

            {/* Editor Content Area */}
            <div className="p-4 flex-1 overflow-auto leading-relaxed select-none text-slate-800 dark:text-slate-350">
              <span className="text-purple-600 dark:text-purple-400">const</span>{' '}
              <span className="text-blue-600 dark:text-blue-400">developer</span>{' '}
              <span className="text-slate-600 dark:text-slate-400">=</span>{' '}
              <span className="text-slate-700 dark:text-slate-300">{`{`}</span>
              
              <div className="pl-4">
                <span className="text-slate-500 dark:text-slate-400">name:</span>{' '}
                <span className="text-blue-600 dark:text-blue-400">'Raja Mohamed'</span>
                <br />
                
                <span className="text-slate-500 dark:text-slate-400">education:</span>{' '}
                <span className="text-blue-600 dark:text-blue-400">'B.Tech [AI & DS]'</span>
                <br />
                
                <span className="text-slate-500 dark:text-slate-400">coreTech:</span>{' '}
                <span className="text-slate-700 dark:text-slate-300">[</span>
                <span className="text-blue-600 dark:text-blue-400">'React'</span>,{' '}
                <span className="text-blue-600 dark:text-blue-400">'Node.js'</span>,{' '}
                <span className="text-blue-600 dark:text-blue-400">'Python'</span>,{' '}
                <span className="text-blue-600 dark:text-blue-400">'PostgreSQL'</span>
                <span className="text-slate-700 dark:text-slate-300">]</span>
                <br />
                
                <span className="text-slate-500 dark:text-slate-400">designTools:</span>{' '}
                <span className="text-amber-600 dark:text-amber-500">'Figma', 'Photoshop','Canva'</span>
                <br />

                 <span className="text-slate-500 dark:text-slate-400">passions:</span>{' '}
                  <span className="text-blue-600 dark:text-blue-400">'Full-Stack Dev'</span>,{' '}
                <span className="text-blue-600 dark:text-blue-400">'AI Integration'</span>,{' '}
                <span className="text-blue-600 dark:text-blue-400">'UI/UX Design'</span>
                <br />
                
                
                <span className="text-slate-500 dark:text-slate-400">creativity:</span>{' '}
                <span className="text-blue-600 dark:text-blue-400">()</span>{' '}
                <span className="text-purple-600 dark:text-purple-400">=&gt;</span>{' '}
                <span className="text-slate-700 dark:text-slate-300">{`{`}</span>
                
                <div className="pl-4">
                  <span className="text-purple-600 dark:text-purple-400">return</span>{' '}
                  <span className="text-blue-600 dark:text-blue-400">'clean code &amp; sleek UI'</span>;
                </div>
                <span className="text-slate-700 dark:text-slate-300">{`}`}</span>
              </div>
              <span className="text-slate-700 dark:text-slate-300">{`};`}</span>
            </div>

            {/* Editor Footer */}
            <div className="px-4 py-2 bg-slate-200/30 dark:bg-slate-900/30 border-t border-slate-300/20 dark:border-slate-800/40 text-[10px] text-slate-500 dark:text-slate-500 flex justify-between select-none">
              <span>UTF-8</span>
              <span>Javascript</span>
              <span>Line 11, Col 32</span>
            </div>
          </div>

          {/* Decorative floating icons/elements */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute -top-6 -right-6 w-14 h-14 rounded-2xl glass flex items-center justify-center text-blue-500 shadow-xl border border-blue-500/20 pointer-events-none"
          >
            <span className="text-2xl font-bold font-sans">⚡</span>
          </motion.div>

          <motion.div
            animate={{ 
              y: [0, 8, 0],
              rotate: [0, -4, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5
            }}
            className="absolute -bottom-6 -left-6 w-12 h-12 rounded-xl glass flex items-center justify-center text-blue-500 shadow-xl border border-blue-500/20 pointer-events-none"
          >
            <span className="text-lg font-bold font-sans">🤖</span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
