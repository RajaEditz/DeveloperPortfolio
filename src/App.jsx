import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Core UI Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ParticleBg from './components/ParticleBg';
import StatCounter from './components/StatCounter';

// Admin Portal Components
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

// Sections
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Certificates from './sections/Certificates';
import Publications from './sections/Publications';
import Freelancing from './sections/Freelancing';
import Contact from './sections/Contact';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("admin_token"));

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    window.location.hash = "#admin";
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    window.location.hash = "";
  };

  // Route router check
  if (currentRoute === "#admin") {
    if (isAuthenticated) {
      return <AdminDashboard onLogout={handleLogout} />;
    } else {
      return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }
  }

  return (
    <>
      <div className="min-h-screen relative bg-slate-50 text-slate-900 transition-colors duration-300 overflow-hidden font-sans">
          {/* Custom Ambient Background Elements */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <ParticleBg />
          </div>

          {/* Custom Cursor dynamics */}
          <CustomCursor />

          {/* Navigation Bar */}
          <Navbar />

          {/* Main Portfolio Sections */}
          <main className="relative z-10">
            {/* Hero Entry */}
            <Hero />

            {/* Animated Statistics Divider */}
            <section className="py-12 bg-slate-100/50 dark:bg-slate-900/40 border-y border-slate-200/50 dark:border-slate-800/40 relative z-10 transition-colors duration-300 select-none">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-3xl md:text-4xl font-extrabold text-gradient">
                    <StatCounter endValue={1} suffix="+" />
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">
                    Years Experience
                  </span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-3xl md:text-4xl font-extrabold text-gradient">
                    <StatCounter endValue={100} suffix="%" />
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">
                    Custom Code & Design
                  </span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-3xl md:text-4xl font-extrabold text-gradient">
                    <StatCounter endValue={15} suffix="+" />
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">
                    Client & Personal Projects
                  </span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-3xl md:text-4xl font-extrabold text-gradient">
                    <StatCounter endValue={4} suffix="" />
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">
                    Coursework Years
                  </span>
                </motion.div>
              </div>
            </section>

            {/* About */}
            <About />

            {/* Skills */}
            <Skills />

            {/* Projects */}
            <Projects />

            {/* Experience */}
            <Experience />

            {/* Certificates */}
            <Certificates />

            {/* Publications */}
            <Publications />

            {/* Freelancing */}
            <Freelancing />

            {/* Contact */}
            <Contact />
          </main>

          {/* Footer Component */}
          <Footer />
        </div>
    </>
  );
}
