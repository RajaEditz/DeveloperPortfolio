import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'publications', label: 'Publications' },
    { id: 'freelancing', label: 'Freelancing' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Scrolled state
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      // Active Section Detection
      const scrollPosition = window.scrollY + 100;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-350 ${
        scrolled 
          ? 'glass shadow-md shadow-slate-900/5 dark:shadow-black/25 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      {/* Scroll Progress Indicator */}
      <div 
        className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, 'home')} 
          className="flex items-center gap-2 group focus:outline-none"
        >
          
          <span className="text-xl font-bold tracking-tight font-sans text-slate-800 dark:text-white group-hover:text-blue-500 transition-colors duration-300">
            PORTFOLIO<span className="text-gradient"></span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`text-xs font-semibold tracking-wider uppercase transition-all duration-300 relative py-1.5 px-2.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/40 ${
                activeSection === item.id 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.span
                  layoutId="activeNavLine"
                  className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-blue-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* Mobile Control Section */}
        <div className="flex items-center gap-3 lg:hidden">
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300/30 dark:border-slate-700/30 hover:bg-slate-300/70 dark:hover:bg-slate-700/50 transition-colors text-slate-700 dark:text-slate-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-slate-300/20 dark:border-slate-800/30 glass overflow-hidden shadow-2xl"
          >
            <nav className="flex flex-col py-4 px-6 gap-2">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`text-sm font-semibold tracking-wide py-2.5 px-4 rounded-xl transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/20 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
