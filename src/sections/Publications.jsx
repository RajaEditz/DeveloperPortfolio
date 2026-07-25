import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Clipboard, Check, Calendar, Users, Bookmark } from 'lucide-react';

export default function Publications() {
  const [copiedId, setCopiedId] = useState(null);
  
  const publicationsList = [
    {
      id: 1,
      title: "Intelligent Network Signal Strength Optimization Using Machine Learning and Real-Time Analytics",
      authors: "I. Raja Mohamed",
      journal: "International Journal of Science, Strategic Management and Technology (IJSMT)",
      date: "April 2026",
      doi: "10.55041/ijsmt.v2i4.381",
      url: "https://doi.org/10.55041/ijsmt.v2i4.381",
      citation: "Raja Mohamed, I. (2026). Intelligent Network Signal Strength Optimization Using Machine Learning and Real-Time Analytics. International Journal of Science, Strategic Management and Technology (IJSMT), 2(4). https://doi.org/10.55041/ijsmt.v2i4.381",
      abstract: "This research proposes a machine learning-based approach to optimize network signal strength using real-time analytics. The system continuously monitors network performance, analyzes signal quality, and predicts connectivity issues to improve reliability and user experience. By leveraging intelligent algorithms, the solution enhances network efficiency, minimizes signal degradation, and supports adaptive optimization for modern communication systems."
    },
    {
      id: 2,
      title: "AI-Based Smart Management System for Universities",
      authors: "I. Raja Mohamed",
      journal: "International Journal for Research in Applied Science & Engineering Technology (IJRASET)",
      date: "April 2026",
      doi: "10.22214/ijraset.2026.79351",
      url: "https://doi.org/10.22214/ijraset.2026.79351",
      citation: "Raja Mohamed, I. (2026). AI-Based Smart Management System for Universities. International Journal for Research in Applied Science & Engineering Technology (IJRASET), 14(IV).",
      abstract: "This paper presents an AI-powered university management system designed to streamline academic and administrative operations. The proposed solution integrates intelligent automation for student records, attendance, course management, and decision support. By utilizing artificial intelligence, the system improves operational efficiency, reduces manual workload, and enhances the overall educational management process."
    }
  ];

  const [pubList, setPubList] = useState(publicationsList);

  useEffect(() => {
    fetch("http://localhost:5000/api/publications")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((p) => ({
            id: p.id,
            title: p.title,
            authors: p.authors || "I. Raja Mohamed",
            journal: p.journal,
            date: new Date(p.publication_date).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
            doi: p.doi,
            url: p.doi ? `https://doi.org/${p.doi}` : "#",
            citation: p.citation || `${p.authors || "Raja Mohamed, I."} (${new Date(p.publication_date).getFullYear()}). ${p.title}. ${p.journal}.`,
            abstract: p.abstract,
          }));
          setPubList(mapped);
        }
      })
      .catch((err) => console.error("Error loading publications from DB:", err));
  }, []);

  const handleCopyCitation = (id, citation) => {
    navigator.clipboard.writeText(citation);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="publications" className="py-20 bg-slate-100/30 dark:bg-slate-950/20 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white sm:text-4xl mb-3">
            Research &amp; <span className="text-gradient">Publications</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Academic papers, research logs, and studies compiled during my B.Tech specialization.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          
          {pubList.map((pub) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 md:p-8 rounded-2xl border border-slate-300/30 dark:border-slate-800/40 relative overflow-hidden text-left"
            >
              {/* Glowing Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 radial-glow-blue opacity-40 pointer-events-none" />

              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4 inline-block select-none">
                Published Paper
              </span>

              <h3 className="text-base md:text-lg font-bold text-slate-850 dark:text-white leading-snug mb-3">
                {pub.title}
              </h3>

              {/* Meta details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                <span className="flex items-center gap-1.5"><Users size={14} /> Author: {pub.authors}</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} /> Date: {pub.date}</span>
                <span className="flex items-center gap-1.5 sm:col-span-2"><Bookmark size={14} /> Journal: {pub.journal}</span>
              </div>

              {/* Abstract */}
              <div className="mb-6">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Abstract
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  {pub.abstract}
                </p>
              </div>

              {/* Action controls */}
              <div className="pt-4 border-t border-slate-300/20 dark:border-slate-800/20 flex flex-wrap items-center justify-between gap-4 select-none">
                <span className="text-[10px] font-mono text-slate-400">
                  DOI: {pub.doi}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyCitation(pub.id, pub.citation)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedId === pub.id ? <Check size={12} className="text-blue-500" /> : <Clipboard size={12} />}
                    {copiedId === pub.id ? "Copied!" : "Copy Citation"}
                  </button>
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center gap-1.5 border border-transparent shadow-sm hover:scale-102 hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <FileText size={12} /> PDF Download
                  </a>
                </div>
              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
