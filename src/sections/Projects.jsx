import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, BookOpen, X, Code } from 'lucide-react';
import { API_BASE } from '../utils/api';

const Github = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const projects = [
  {
    id: 1,
    title: "ShopZone E-Commerce Website",
    description: "A premium MERN stack e-commerce platform with secure user authentication, shopping cart operations, admin console, and Stripe gateway checkout.",
    features: [
      "JWT-based User Authentication and role-based routes (User/Admin)",
      "Dynamic filtering, sorting, and live text search for product items",
      "Full Stripe payment gateway integration with webhooks verification",
      "Comprehensive Admin dashboard to manage products, categories, and shipments"
    ],
    technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Stripe API"],
    tags: ["React", "Full Stack"],
    githubLink: "https://github.com",
    liveLink: "https://example.com",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "AI Chat Application",
    description: "An intelligent chatbot assistant integrating Generative AI APIs, supporting custom prompts, file attachments, and context-based conversational history.",
    features: [
      "Generative AI model orchestration with response streaming support",
      "File parsing capabilities (TXT/PDF) to summarize documents",
      "Full markdown response rendering with syntax highlighted code syntax",
      "Session history storage with custom categorization options"
    ],
    technologies: ["React.js", "Python", "Flask", "Tailwind CSS", "Gemini API", "MongoDB"],
    tags: ["React", "Full Stack", "AI"],
    githubLink: "https://github.com",
    liveLink: "https://example.com",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Task Management App",
    description: "A collaborative scrum-style project planning interface with drag-and-drop workflow status, notifications, and analytics charts.",
    features: [
      "Drag-and-drop workspace lanes for quick task status updates",
      "Analytics charts illustrating task completion velocities and workloads",
      "Team board invitation systems with custom task assignees",
      "In-app push notifications for task deadline reminders"
    ],
    technologies: ["React.js", "Node.js", "Express.js", "PostgreSQL", "Socket.io", "Tailwind CSS"],
    tags: ["React", "Full Stack"],
    githubLink: "https://github.com",
    liveLink: "https://example.com",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "The digital home you are browsing right now. Premium React workspace designed with glassmorphism UI, theme settings, and canvas dynamics.",
    features: [
      "Fully customized glassmorphism design with responsive Tailwind spacing",
      "Responsive navigation drawer and active page tracking",
      "Lightweight canvas particle physics for ambient graphics",
      "Optimized load times and high accessibility ratings (WCAG compliant)"
    ],
    technologies: ["React.js", "Tailwind CSS", "Framer Motion", "Lucide React", "Canvas Confetti"],
    tags: ["React", "JavaScript"],
    githubLink: "https://github.com",
    liveLink: "https://example.com",
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Weather App",
    description: "A smart weather radar integrating OpenWeather API to check current metrics, map coordinates, and forecast statistics.",
    features: [
      "Dynamic weather graphics adapting to climate codes (snow, rain, clear)",
      "Geocoding support to load current weather based on user location",
      "5-day atmospheric pressure and temperature progression charts",
      "Lightweight styling optimized for slow connections"
    ],
    technologies: ["JavaScript", "HTML5", "CSS3", "OpenWeather API"],
    tags: ["JavaScript"],
    githubLink: "https://github.com",
    liveLink: "https://example.com",
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Authentication System",
    description: "A robust multi-strategy user security module supporting standard login, email validation links, OTP, and OAuth profiles.",
    features: [
      "Secured login flow using Argon2 password hashing and salt generators",
      "Verification mailers for user onboarding and password reset actions",
      "Dual-factor checks (2FA) utilizing standard Google Authenticator codes",
      "Google and GitHub OAuth integration settings"
    ],
    technologies: ["Node.js", "Express.js", "PostgreSQL", "Redis", "Nodemailer", "JWT"],
    tags: ["Full Stack"],
    githubLink: "https://github.com",
    liveLink: "https://example.com",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 7,
    title: "Blog Platform",
    description: "A medium-style blogging workspace allowing creators to compile posts using rich-text editors and curate thematic tags.",
    features: [
      "Integrated WYSIWYG rich text editor for writing long-form posts",
      "Comment nesting controls with report and moderation queues",
      "Dynamic reading time calculations and bookmark folders",
      "Automatic thumbnail compression and responsive image serving"
    ],
    technologies: ["React.js", "Node.js", "MongoDB", "Tailwind CSS", "Cloudinary SDK"],
    tags: ["React", "Full Stack"],
    githubLink: "https://github.com",
    liveLink: "https://example.com",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 8,
    title: "Student Management System",
    description: "An educational dashboard to coordinate admissions, record student attendance schedules, publish marks, and compile report cards.",
    features: [
      "Intuitive student registry database dashboard",
      "Grades computing script generating automated performance graphs",
      "Exportable analytics reports (CSV/PDF) for school coordinators",
      "Teacher, student, and administrative staff portal views"
    ],
    technologies: ["Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Bootstrap", "Chart.js"],
    tags: ["Full Stack"],
    githubLink: "https://github.com",
    liveLink: "https://example.com",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop"
  }
];

export default function Projects() {
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectList, setProjectList] = useState(projects);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    setActiveImgIndex(0);
  }, [selectedProject]);

  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            technologies: typeof p.technologies === "string" ? p.technologies.split(",").map((s) => s.trim()) : p.technologies || [],
            features: Array.isArray(p.features) ? p.features : (typeof p.features === "string" ? p.features.split("\n").filter(Boolean) : (typeof p.description === "string" ? p.description.split("\n").filter(Boolean) : [])),
            tags: p.featured ? ["React", "Full Stack", "AI"] : ["React", "Full Stack"],
            githubLink: p.github_url || "#",
            liveLink: p.live_url || "#",
            image: p.thumbnail_url || p.image_url || "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=600&auto=format&fit=crop",
            modal_image: p.image_url || "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=600&auto=format&fit=crop",
            image_urls: p.image_urls || (p.image_url ? [p.image_url] : ["https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=600&auto=format&fit=crop"]),
          }));
          setProjectList(mapped);
        }
      })
      .catch((err) => console.error("Error loading projects from DB:", err));
  }, []);

  const filterTags = ["all", "React", "Full Stack", "AI", "JavaScript"];

  const filteredProjects = projectList.filter((project) => {
    const matchesTag = selectedTag === "all" || project.tags.includes(selectedTag);
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <section id="projects" className="py-20 bg-slate-50/50 dark:bg-slate-900/10 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white sm:text-4xl mb-3">
            My <span className="text-gradient">Projects</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Explore web apps, tools, and technical systems I have built.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 w-full max-w-5xl mx-auto">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center">
            {filterTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  selectedTag === tag
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/10"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850"
                }`}
              >
                {tag === "all" ? "All Projects" : tag}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-450">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by tech or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-250 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-sans"
            />
          </div>
        </div>

        {/* Projects Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className="glass-card rounded-2xl overflow-hidden border border-slate-300/30 dark:border-slate-800/40 flex flex-col h-full group interactive-card"
              >
                {/* Project Image Container */}
                <div className="h-44 w-full relative overflow-hidden bg-slate-200 dark:bg-slate-900 border-b border-slate-350/10 dark:border-slate-800/20">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 flex gap-1">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-950/70 border border-white/10 text-white backdrop-blur-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-850 dark:text-white mb-2 leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300/20 dark:border-slate-800/40 text-slate-650 dark:text-slate-350">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300/20 dark:border-slate-800/40 text-slate-500">
                          +{project.technologies.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex gap-2 pt-2 border-t border-slate-300/20 dark:border-slate-800/20 select-none">
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-all flex-1 text-center text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <Github size={14} /> GitHub
                    </a>
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-all flex-1 text-center text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink size={14} /> Demo
                    </a>
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all flex-1 text-center text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      <BookOpen size={14} /> Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No projects found matching the criteria. Try clearing search keywords or choosing a different filter.
            </p>
          </div>
        )}

      </div>

      {/* Case Study / Project Detail Modal overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 25 }}
              className="bg-white dark:bg-slate-900 border border-slate-300/30 dark:border-slate-800/80 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl relative flex flex-col text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Image Header with Gallery Slider */}
              <div className="aspect-video w-full relative overflow-hidden bg-slate-950">
                {selectedProject.image_urls && selectedProject.image_urls.length > 0 ? (
                  <>
                    <img 
                      src={selectedProject.image_urls[activeImgIndex]} 
                      alt={`${selectedProject.title} ${activeImgIndex + 1}`} 
                      className="w-full h-full object-cover transition-all duration-300 cursor-zoom-in hover:opacity-90"
                      onClick={() => setLightboxImg(selectedProject.image_urls[activeImgIndex])}
                    />
                    
                    {/* Navigation Arrows */}
                    {selectedProject.image_urls.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setActiveImgIndex((prev) => (prev === 0 ? selectedProject.image_urls.length - 1 : prev - 1))}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 text-white hover:bg-slate-950/85 transition-colors border border-white/10 z-10 font-bold"
                        >
                          &larr;
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveImgIndex((prev) => (prev === selectedProject.image_urls.length - 1 ? 0 : prev + 1))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 text-white hover:bg-slate-950/85 transition-colors border border-white/10 z-10 font-bold"
                        >
                          &rarr;
                        </button>

                        {/* Dots Indicators */}
                        <div className="absolute bottom-4 right-4 flex gap-1.5 bg-slate-950/50 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md z-10">
                          {selectedProject.image_urls.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveImgIndex(idx)}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${
                                idx === activeImgIndex ? "bg-white scale-125" : "bg-white/40"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <img 
                    src={selectedProject.modal_image || selectedProject.image} 
                    alt={selectedProject.title} 
                    className="w-full h-full object-cover cursor-zoom-in hover:opacity-90"
                    onClick={() => setLightboxImg(selectedProject.modal_image || selectedProject.image)}
                  />
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/65 text-white hover:bg-slate-950/80 transition-colors border border-white/10 z-10 cursor-pointer"
                  aria-label="Close details"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content Scroll Area */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                <div className="border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
                  <h3 className="text-lg md:text-xl font-extrabold text-slate-850 dark:text-white leading-snug">
                    {selectedProject.title}
                  </h3>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5">
                    <Code size={14} className="text-blue-500" /> Project Description
                  </h4>
                  <p className="text-xs md:text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-sans">
                    {selectedProject.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                    💡 Key Features &amp; Capabilities
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.features.map((feature, idx) => (
                      <li key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                    🔧 Technologies &amp; Frameworks
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.technologies.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-200/55 dark:bg-slate-950/65 border border-slate-305/20 dark:border-slate-800/80 text-slate-700 dark:text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-300/10 dark:border-slate-900/60 flex justify-end gap-3 rounded-b-2xl">
                <a
                  href={selectedProject.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-350 hover:bg-slate-200/50 dark:hover:bg-slate-850 transition-colors flex items-center gap-1.5"
                >
                  <Github size={14} /> GitHub Repository
                </a>
                <a
                  href={selectedProject.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-md shadow-blue-500/10"
                >
                  <ExternalLink size={14} /> Launch Live Demo
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Lightbox Popup Overlay */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImg(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-zoom-out"
          >
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition-colors border border-white/10 cursor-pointer"
              aria-label="Close image popup"
            >
              <X size={20} />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={lightboxImg}
              alt="Project view fullscreen"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
