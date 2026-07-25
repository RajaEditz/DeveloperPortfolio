import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Globe, Award, Briefcase, BookOpen } from 'lucide-react';
import { API_BASE } from '../utils/api';

export default function About() {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/profile-photo`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.profile_photo) {
          setProfilePhoto(data.profile_photo);
        }
      })
      .catch((err) => console.error("Error loading profile photo:", err));
  }, []);
  const highlights = [
    { icon: <GraduationCap size={20} className="text-blue-500" />, title: "B.Tech AI & Data Science", desc: "Strong foundation in AI, Data Science, Web Development, and Software Engineering." },
    { icon: <Award size={20} className="text-blue-500" />, title: "CGPA: 8.2/10", desc: "Maintained consistent academic performance with hands-on projects in full-stack web development." },
    { icon: <BookOpen size={20} className="text-blue-500" />, title: "PERN Stack Developer", desc: "Skilled in PostgreSQL, Express.js, React.js, Node.js, JavaScript, HTML, CSS, and REST APIs." },
    { icon: <Briefcase size={20} className="text-blue-500" />, title: "Open to Opportunities", desc: "Available for Full-Time, Remote, Freelance, and Internship opportunities." },
  ];

  const educationTimeline = [
    {
      degree: "B.Tech. Artificial Intelligence & Data Science",
      institution: "M.I.E.T ENGINEERING COLLEGE [Anna University Affiliate Institution]",
      duration: "2022 - 2026",
      details: "CGPA: 8.2 Focused on computer science foundations, Machine Learning, Deep Learning, and Database Systems to build intelligent, scalable digital solutions."
    },
    {
      degree: "Higher Secondary Certificate (HSC)",
      institution: "State Board School Academy",
      duration: "2020 - 2022",
      details: "Major: Physics, Chemistry, Mathematics & Computer Science. Secured top honors."
    }
  ];

  return (
    <section id="about" className="py-20 bg-slate-50/50 dark:bg-slate-900/10 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white sm:text-4xl mb-3">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Passionate about bridging intelligent AI solutions with full-stack web engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Visual frame & Details */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
            {/* Photo Placeholder Frame with premium tilt effect */}
            <motion.div 
              whileHover={{ scale: 1.02, rotate: -2 }}
              className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden glass border-2 border-white/20 dark:border-slate-800/80 shadow-2xl mb-8 group"
            >
              {/* Sleek SVG Developer avatar backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 z-0" />
              <motion.img 
                src={profilePhoto || "/default_profile.png"}
                alt="Raja Mohamed"
                className="w-full h-full object-cover relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
              {/* Glass label */}
              <div className="absolute bottom-4 left-4 right-4 glass py-2.5 px-4 rounded-xl text-center border border-white/10 shadow-lg">
                <span className="text-xs font-semibold text-slate-800 dark:text-white uppercase tracking-wider block">
                  Raja Mohamed
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  AI Full Stack Developer
                </span>
              </div>
            </motion.div>

            {/* Quick Details List */}
            <div className="w-full max-w-sm glass-card p-6 rounded-2xl border border-slate-300/30 dark:border-slate-800/40">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                <Award size={16} className="text-blue-500" /> Professional Info
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-slate-350/20 dark:border-slate-800/40">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><MapPin size={14} /> Location</span>
                  <span className="font-semibold text-slate-800 dark:text-white">Chennai, India</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-350/20 dark:border-slate-800/40">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Globe size={14} /> Languages</span>
                  <span className="font-semibold text-slate-800 dark:text-white">English, Tamil</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><GraduationCap size={14} /> Degree</span>
                  <span className="font-semibold text-slate-800 dark:text-white">B.Tech [AI &amp; DS]</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio, Objectives, and Timeline */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Bio & Objective */}
            <div className="glass-card p-8 rounded-2xl border border-slate-300/30 dark:border-slate-800/40">
              <h3 className="text-xl font-bold text-slate-850 dark:text-white mb-4">
                Career Objective
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-sans mb-6">
                Passionate B.Tech Artificial Intelligence & Data Science graduate with expertise in the PERN Stack (PostgreSQL, Express.js, React.js, Node.js). Dedicated to building scalable, responsive, and user-centric web applications while continuously enhancing backend development and problem-solving skills. Seeking opportunities to contribute to innovative software solutions and grow as a Full-Stack Developer.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {highlights.map((h, idx) => (
                  <div key={idx} className="flex gap-3 p-3.5 rounded-xl bg-slate-200/20 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/40">
                    <div className="mt-1">{h.icon}</div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{h.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{h.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Timeline */}
            <div className="glass-card p-8 rounded-2xl border border-slate-300/30 dark:border-slate-800/40">
              <h3 className="text-xl font-bold text-slate-850 dark:text-white mb-6">
                Education Journey
              </h3>
              <div className="relative pl-6 border-l border-slate-300 dark:border-slate-800/80 space-y-8">
                {educationTimeline.map((edu, idx) => (
                  <div key={idx} className="relative">
                    {/* Timeline dot widget */}
                    <div className="absolute -left-[10px] top-1 w-4.5 h-4.5 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {edu.degree}
                      </h4>
                      <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-450 bg-blue-500/10 px-2.5 py-1 rounded-full w-max mt-1 sm:mt-0">
                        {edu.duration}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                      {edu.institution}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed font-sans">
                      {edu.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
