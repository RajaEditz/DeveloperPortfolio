import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code, Cpu, Award } from 'lucide-react';

const experiences = [
  {
    id: 1,
    role: "Full Stack Developer Trainee",
    company: "Noxon Infotech",
    duration: "June 2026 – Present",
    icon: <Code className="text-blue-500" size={18} />,
    description: "Working as a Full Stack Developer Trainee, contributing to real-world web application development using the PERN (PostgreSQL, Express.js, React.js, Node.js) stack. Collaborating with the development team to build scalable, responsive, and production-ready applications while following industry best practices.",
    bullets: [
      "Develop and maintain full-stack web applications using PostgreSQL, Express.js, React.js, and Node.js.",
      "Build RESTful APIs, integrate databases, and implement responsive user interfaces for real-world projects.",
      "Collaborate with team members using Git/GitHub, participate in debugging, testing, and performance optimization."
    ]
  },
  {
    id: 2,
    role: "Academic Projects Lead (B.Tech AI & DS)",
    company: "MIET Engineering College",
    duration: "January 2026 – May 2026",
    icon: <Cpu className="text-blue-500" size={18} />,
    description: "AI-Based Smart College Management System.Led the design and development of an AI-powered smart college management system that automated multiple academic and administrative processes using machine learning and intelligent scheduling techniques.",
    bullets: [
      "Built ML-based academic automation covering exam hall seat allocation, smart timetable generation, and real-time college bus tracking.",
      "Coordinated project planning, development, testing, and documentation while leading the academic project team.",
      "Research outcomes were published in the International Journal for Research in Applied Science & Engineering Technology (IJRASET)."
    ]
  },
  {
    id: 3,
    role: "Web Development Intern",
    company: "DLK Technology",
    duration: "August 2024 – September 2024",
    icon: <Award className="text-indigo-500" size={18} />,
    description: "Completed a web development internship focused on building responsive and user-friendly websites while strengthening core front-end development skills and understanding modern web development practices.",
    bullets: [
      "Developed responsive web pages using HTML5, CSS3, and JavaScript.",
      "Implemented clean layouts, interactive UI components, and cross-browser compatible designs.",
      "Improved problem-solving skills through hands-on development tasks and mini projects.."
    ]
  },
  {
    id: 4,
    role: "Graphic Designer & Video Editor (Freelance)",
    company: "Freelancing",
    duration: "June 2025 – Present",
    icon: <Briefcase className="text-blue-500" size={18} />,
    description: "Providing freelance creative services by designing engaging visual content and editing professional-quality videos for clients across various industries and social media platforms.",
    bullets: [
      "Designed branding materials, social media creatives, marketing assets, and UI mockups using Figma, Photoshop, and Canva.",
      "Produced promotional videos, reels, and advertisements using CapCut and DaVinci Resolve.",
      "Worked directly with clients to understand requirements, deliver high-quality designs, and meet project deadlines."
    ]
  }
];

export default function Experience() {
  const [expList, setExpList] = useState(experiences);

  useEffect(() => {
    fetch("http://localhost:5000/api/experiences")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((e) => {
            const start = new Date(e.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
            const end = e.currently_working ? "Present" : new Date(e.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
            return {
              id: e.id,
              role: e.role,
              company: e.company,
              duration: `${start} – ${end}`,
              icon: e.role.toLowerCase().includes("ai") || e.role.toLowerCase().includes("project") ? <Cpu className="text-blue-500" size={18} /> : <Code className="text-blue-500" size={18} />,
              description: e.description,
              bullets: typeof e.description === "string" ? e.description.split("\n").filter(Boolean) : [],
            };
          });
          setExpList(mapped);
        }
      })
      .catch((err) => console.error("Error loading experience from DB:", err));
  }, []);
  return (
    <section id="experience" className="py-20 bg-slate-100/30 dark:bg-slate-950/20 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white sm:text-4xl mb-3">
            Academic &amp; Professional <span className="text-gradient">Experience</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            A comprehensive record of my professional internships, academic projects, freelance work, and contributions.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative max-w-4xl mx-auto pl-6 border-l border-slate-300 dark:border-slate-800 space-y-12">
          {expList.map((exp, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={exp.id}
              className="relative"
            >
              {/* Timeline indicator node */}
              <div className="absolute -left-[35px] top-1.5 w-5.5 h-5.5 rounded-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-350 dark:border-slate-800 flex items-center justify-center shadow-sm">
                <div className="p-1">
                  {exp.icon}
                </div>
              </div>

              {/* Card content */}
              <div className="glass-card p-6 md:p-8 rounded-2xl border border-slate-300/30 dark:border-slate-800/40 relative">
                
                {/* Meta details */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-slate-850 dark:text-white">
                      {exp.role}
                    </h3>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {exp.company}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-650 dark:text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full w-max h-max">
                    {exp.duration}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm text-slate-550 dark:text-slate-400 leading-relaxed font-sans mb-4">
                  {exp.description}
                </p>

                {/* Key Responsibilities / Bullets */}
                <ul className="space-y-2 md:pl-2">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-450 leading-relaxed">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
