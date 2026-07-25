import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Server, Database, Settings, Cloud, Award } from 'lucide-react';
import { API_BASE } from '../utils/api';

const skillCategories = [
  {
    id: "frontend",
    title: "Frontend Development",
    icon: <Code className="text-blue-500" size={20} />,
    skills: [
      { name: "HTML5", percentage: 95 },
      { name: "CSS3", percentage: 90 },
      { name: "JavaScript (ES6+)", percentage: 88 },
      { name: "React.js", percentage: 85 },
      { name: "Tailwind CSS", percentage: 92 }
    ]
  },
  {
    id: "backend-db",
    title: "Backend & Databases",
    icon: <Server className="text-purple-500" size={20} />,
    skills: [
      { name: "Node.js", percentage: 82 },
      { name: "Express.js", percentage: 85 },
      { name: "MongoDB", percentage: 80 },
      { name: "PostgreSQL", percentage: 75 }
    ]
  },
  {
    id: "programming",
    title: "Programming Languages",
    icon: <Database className="text-indigo-500" size={20} />,
    skills: [
      { name: "Python", percentage: 85 },
      { name: "JavaScript", percentage: 88 }
    ]
  },
  {
    id: "tools",
    title: "Development Tools",
    icon: <Settings className="text-blue-500" size={20} />,
    skills: [
      { name: "Git & GitHub", percentage: 88 },
      { name: "VS Code", percentage: 92 },
      { name: "Postman", percentage: 85 },
      { name: "Figma & Canva", percentage: 78 }
    ]
  },
  {
    id: "deployment",
    title: "Deployment & Cloud",
    icon: <Cloud className="text-cyan-500" size={20} />,
    skills: [
      { name: "Vercel", percentage: 88 },
      { name: "Netlify", percentage: 85 },
      { name: "Render", percentage: 80 }
    ]
  },
  {
    id: "soft",
    title: "Soft Skills",
    icon: <Award className="text-amber-500" size={20} />,
    skills: [
      { name: "Problem Solving", percentage: 90 },
      { name: "Communication", percentage: 85 },
      { name: "Teamwork", percentage: 90 },
      { name: "Quick Learner", percentage: 92 },
      { name: "Time Management", percentage: 85 }
    ]
  }
];

export default function Skills() {
  const [activeTab, setActiveTab] = useState("all");
  const [categories, setCategories] = useState(skillCategories);

  useEffect(() => {
    fetch(`${API_BASE}/skills`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const grouped = {};
          data.forEach((s) => {
            const cat = s.category || "frontend";
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push({ name: s.skill_name, percentage: Number(s.proficiency) || 80 });
          });

          const updatedCategories = skillCategories.map((catItem) => {
            const dbSkills = grouped[catItem.id];
            if (dbSkills && dbSkills.length > 0) {
              return {
                ...catItem,
                skills: dbSkills,
              };
            }
            return catItem;
          });
          setCategories(updatedCategories);
        }
      })
      .catch((err) => console.error("Error loading skills from DB:", err));
  }, []);

  const filteredCategories = activeTab === "all"
    ? categories
    : categories.filter(cat => cat.id === activeTab);

  return (
    <section id="skills" className="py-20 bg-slate-100/30 dark:bg-slate-950/20 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white sm:text-4xl mb-3">
            Technical <span className="text-gradient">Skills</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            A comprehensive mapping of my tech stack, tools, and professional core competencies.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-3xl mx-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeTab === "all"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/10"
                : "bg-slate-200/50 dark:bg-slate-900/60 border border-slate-305/20 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-800/80"
            }`}
          >
            All Skills
          </button>
          {skillCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeTab === cat.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/10"
                  : "bg-slate-200/50 dark:bg-slate-900/60 border border-slate-305/20 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-800/80"
              }`}
            >
              {cat.id === "backend-db" ? "Backend & DB" : cat.id === "programming" ? "Languages" : cat.id === "soft" ? "Soft Skills" : cat.title.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCategories.map((category) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              key={category.id}
              className="glass-card p-6 rounded-2xl border border-slate-300/30 dark:border-slate-800/40 hover:scale-102 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-300/20 dark:border-slate-800/40">
                  <div className="p-2.5 rounded-xl bg-slate-200/40 dark:bg-slate-900/50 border border-slate-300/20 dark:border-slate-800/40">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-base text-slate-850 dark:text-white">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-5">
                  {category.skills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{skill.name}</span>
                        <span className="font-mono font-bold text-blue-500 dark:text-blue-400">{skill.percentage}%</span>
                      </div>
                      
                      {/* Animated Progress Bar */}
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
