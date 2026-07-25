import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Download, Search } from 'lucide-react';
import { API_BASE } from '../utils/api';

const certificates = [
  {
    id: 1,
    title: "Meta Front-End Developer Specialization",
    organization: "Coursera / Meta",
    issueDate: "Dec 2024",
    category: "Web Development",
    credentialLink: "https://coursera.org",
    downloadLink: "/resume.pdf",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Deep Learning Specialization",
    organization: "DeepLearning.AI / Coursera",
    issueDate: "Oct 2024",
    category: "AI",
    credentialLink: "https://coursera.org",
    downloadLink: "/resume.pdf",
    image: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Python for Data Science & AI",
    organization: "IBM / Coursera",
    issueDate: "Jul 2024",
    category: "Programming",
    credentialLink: "https://coursera.org",
    downloadLink: "/resume.pdf",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "AWS Cloud Practitioner",
    organization: "Amazon Web Services (AWS)",
    issueDate: "May 2024",
    category: "Cloud",
    credentialLink: "https://aws.amazon.com",
    downloadLink: "/resume.pdf",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Responsive Web Design Certification",
    organization: "freeCodeCamp",
    issueDate: "Feb 2024",
    category: "Web Development",
    credentialLink: "https://freecodecamp.org",
    downloadLink: "/resume.pdf",
    image: "https://images.unsplash.com/photo-1481487196290-c152efe083f5?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "UI/UX Design Certificate",
    organization: "Google / Coursera",
    issueDate: "Nov 2023",
    category: "Design",
    credentialLink: "https://coursera.org",
    downloadLink: "/resume.pdf",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=400&auto=format&fit=crop"
  }
];

function CertificateCard({ cert }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      key={cert.id}
      className="glass-card rounded-2xl overflow-hidden border border-slate-300/30 dark:border-slate-800/40 flex flex-col h-full group"
    >
      {/* Certificate image banner */}
      <div className="h-44 w-full relative overflow-hidden bg-slate-200 dark:bg-slate-900 border-b border-slate-350/10 dark:border-slate-800/20">
        <img 
          src={cert.image_urls && cert.image_urls.length > 0 ? cert.image_urls[activeImgIndex] : cert.image} 
          alt={cert.title} 
          className="w-full h-full object-cover transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Navigation Arrows for Card */}
        {cert.image_urls && cert.image_urls.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setActiveImgIndex((prev) => (prev === 0 ? cert.image_urls.length - 1 : prev - 1));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-950/60 text-white hover:bg-slate-950/80 transition-colors border border-white/10 opacity-0 group-hover:opacity-100 duration-300 font-bold text-xs z-10"
            >
              &larr;
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setActiveImgIndex((prev) => (prev === cert.image_urls.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-950/60 text-white hover:bg-slate-950/80 transition-colors border border-white/10 opacity-0 group-hover:opacity-100 duration-300 font-bold text-xs z-10"
            >
              &rarr;
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 bg-slate-950/50 px-2 py-1 rounded-full border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 duration-300 z-10">
              {cert.image_urls.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1 h-1 rounded-full transition-all ${
                    idx === activeImgIndex ? "bg-white scale-125" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-950/70 border border-white/10 text-white backdrop-blur-md">
            {cert.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-1.5">
            <Award size={14} className="text-blue-500 animate-pulse-slow" /> {cert.organization}
          </h3>
          <h4 className="text-sm font-extrabold text-slate-850 dark:text-white leading-snug mb-3">
            {cert.title}
          </h4>
        </div>

        <div className="pt-3 border-t border-slate-300/20 dark:border-slate-800/20 flex items-center justify-between gap-4 select-none">
          <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-500">
            Issued: {cert.issueDate}
          </span>
          <div className="flex gap-2">
            <a
              href={cert.image_urls && cert.image_urls.length > 0 ? cert.image_urls[activeImgIndex] : cert.downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-450 transition-all flex items-center gap-1 text-[10px] font-semibold"
              aria-label={`View certificate for ${cert.title}`}
            >
              View
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Certificates() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [certList, setCertList] = useState(certificates);

  useEffect(() => {
    fetch(`${API_BASE}/certificates`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((c) => ({
            id: c.id,
            title: c.title,
            organization: c.issuer,
            issueDate: new Date(c.issue_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
            category: c.title.toLowerCase().includes("ai") || c.title.toLowerCase().includes("learning") ? "AI" : c.title.toLowerCase().includes("python") || c.title.toLowerCase().includes("programming") ? "Programming" : c.title.toLowerCase().includes("aws") || c.title.toLowerCase().includes("cloud") ? "Cloud" : c.title.toLowerCase().includes("design") || c.title.toLowerCase().includes("ux") ? "Design" : "Web Development",
            credentialLink: c.credential_url || "#",
            downloadLink: c.image_url || "#",
            image: c.image_url || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop",
            image_urls: c.image_urls || (c.image_url ? [c.image_url] : ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop"]),
          }));
          setCertList(mapped);
        }
      })
      .catch((err) => console.error("Error loading certificates from DB:", err));
  }, []);

  const filters = ["all", "Programming", "AI", "Web Development", "Cloud", "Design"];

  const filteredCertificates = certList.filter((cert) => {
    const matchesFilter = selectedFilter === "all" || cert.category === selectedFilter;
    const matchesSearch = 
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="certificates" className="py-20 bg-slate-50/50 dark:bg-slate-900/10 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white sm:text-4xl mb-3">
            Licenses &amp; <span className="text-gradient">Certificates</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Review specializations, badges, and credentials earned from global academies.
          </p>
        </div>

        {/* Filters and search controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 w-full max-w-5xl mx-auto">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  selectedFilter === filter
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/10"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-455 hover:bg-slate-50 dark:hover:bg-slate-850"
                }`}
              >
                {filter === "all" ? "All Credentials" : filter}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-450">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-250 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-sans"
            />
          </div>
        </div>

        {/* Certificate Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredCertificates.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredCertificates.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
              No credentials match the search terms.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
