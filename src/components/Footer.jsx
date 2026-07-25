import { ArrowUp, Mail } from 'lucide-react';

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

export default function Footer() {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="relative bg-slate-100 dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-900/80 transition-colors duration-300 py-12">
      {/* Floating Back to Top Button */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <button
          onClick={handleScrollTop}
          className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/20 hover:scale-110 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          aria-label="Back to Top"
        >
          <ArrowUp size={18} className="group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          {/* Logo & Brief Description */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              
              <span className="text-base font-bold tracking-tight font-sans text-slate-800 dark:text-white">
                Raja Mohamed 
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto md:mx-0">
              Full Stack Developer & AI / Data Science Graduate. Building clean, scalable solutions for real-world problems.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <a href="#home" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Home</a>
            <a href="#about" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">About</a>
            <a href="#skills" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Projects</a>
            <a href="#contact" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Contact</a>
            <a href="#admin" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-slate-400/80">Admin Portal</a>
          </div>

          {/* Social Links */}
          <div className="flex justify-center md:justify-end gap-3.5">
            <a
              href="https://www.linkedin.com/in/rajamd18"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300/30 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-105 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://github.com/RajaEditz"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300/30 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-105 transition-all"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="mailto:rajaaysha78@gmail.com"
              className="p-2 rounded-xl bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300/30 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-105 transition-all"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
            <a
              href="https://www.instagram.com/raja.editz._?igsh=MWI0MXN0OHQ1NnM0Yg=="
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300/30 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-105 transition-all"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200/60 dark:border-slate-900/60 text-center flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} Raja Mohamed. All rights reserved.
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
            Made with <span className="text-rose-500 animate-pulse">❤️</span> by Raja Mohamed
          </p>
        </div>
      </div>
    </footer>
  );
}
