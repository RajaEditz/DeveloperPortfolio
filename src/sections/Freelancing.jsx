import React from 'react';
import { motion } from 'framer-motion';
import { 
  Laptop, Code2, Server, Settings, CheckCircle2, MessageSquare, 
  Map, Paintbrush, Layers, ShieldCheck, Mail, ArrowRight, Zap
} from 'lucide-react';

const services = [
  {
    icon: <Laptop className="text-blue-500" size={22} />,
    title: "Portfolio & Landing Pages",
    desc: "Premium, responsive single-page websites to elevate your personal brand or product launch campaigns."
  },
  {
    icon: <Code2 className="text-purple-500" size={22} />,
    title: "PERN Stack Development",
    desc: "End-to-end full-stack web applications structured using MongoDB, Express, React, and Node.js."
  },
  {
    icon: <Server className="text-blue-500" size={22} />,
    title: "API Integrations & Backend",
    desc: "Robust backend logic, custom API development, database schemas (PostgreSQL/Mongo), and secure routes."
  },
  {
    icon: <Settings className="text-blue-500" size={22} />,
    title: "Redesign & Performance",
    desc: "Modernizing legacy structures, resolving bugs, upgrading UI styles, and optimizing loading times."
  }
];

const benefits = [
  { title: "Fast Delivery", desc: "Snappy workflows ensuring your project launches on schedule." },
  { title: "Clean Code", desc: "Production-ready, highly commented, modular development." },
  { title: "Responsive Design", desc: "Flawless rendering on mobile, tablet, and wide screens." },
  { title: "SEO Friendly", desc: "Curated markup structures to rank higher in searches." },
  { title: "Ongoing Support", desc: "Post-deployment debugging and assistance services." },
  { title: "Affordable Pricing", desc: "Optimized budgets built for startups and freelancers." }
];

const steps = [
  { num: "01", name: "Discussion", desc: "Gathering goals" },
  { num: "02", name: "Planning", desc: "Sitemaps & wireframes" },
  { num: "03", name: "Development", desc: "Clean React code" },
  { num: "04", name: "Testing", desc: "Debugging checks" },
  { num: "05", name: "Delivery", desc: "Going live" },
  { num: "06", name: "Support", desc: "Updates & assistance" }
];

export default function Freelancing() {
  const handleScrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="freelancing" className="py-20 bg-slate-50/50 dark:bg-slate-900/10 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-4 inline-block select-none">
            Freelance &amp; Services
          </span>
          <h2 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white sm:text-4xl mb-3">
            Let's Build Something <span className="text-gradient">Amazing Together</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-slate-900 mx-auto rounded-full" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-sans">
            I help startups, businesses, and individuals create modern websites, web applications, and creative digital solutions.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((svc, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              key={idx}
              className="glass-card p-6 rounded-2xl border border-slate-300/30 dark:border-slate-800/40 hover:scale-102 flex flex-col justify-between text-left"
            >
              <div>
                <div className="p-3 rounded-xl bg-slate-200/40 dark:bg-slate-900/50 border border-slate-300/20 dark:border-slate-800/40 w-max mb-5">
                  {svc.icon}
                </div>
                <h3 className="font-bold text-sm text-slate-850 dark:text-white mb-2 font-sans">
                  {svc.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  {svc.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout: Why Hire Me & Workflow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16 text-left">
          
          {/* Left Column: Why Hire Me */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-bold text-slate-850 dark:text-white flex items-center gap-2">
              <ShieldCheck className="text-blue-500" /> Why Hire Me?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
              Combining web development capabilities with data analytics, I focus on crafting apps that perform quickly, look premium, and satisfy business metrics.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex gap-2">
                  <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{b.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Workflow Progress */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-bold text-slate-850 dark:text-white flex items-center gap-2">
              <Layers className="text-blue-500" /> Work Process Flowchart
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed mb-6">
              A structured step-by-step methodology ensuring quality checks and alignment from wireframes to going live.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {steps.map((st, idx) => (
                <div key={idx} className="glass-card p-4 rounded-xl border border-slate-305/20 dark:border-slate-800/40 relative overflow-hidden flex flex-col justify-between h-28">
                  <span className="absolute top-1 right-2 text-2xl font-black font-sans text-slate-200 dark:text-slate-800/40 select-none">
                    {st.num}
                  </span>
                  <div className="z-10 mt-auto">
                    <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 leading-none mb-1">
                      {st.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-500 leading-tight">
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Calls to Action Panel */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass-card p-8 rounded-3xl border border-slate-300/35 dark:border-slate-800/50 bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-left"
        >
          <div className="max-w-md">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-850 dark:text-white mb-2">
              Have a Project Idea in Mind?
            </h3>
            <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-sans">
              Contact me to receive a free consultation quote. Let's design, code, and deploy your custom solution.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 select-none">
            <button
              onClick={handleScrollToContact}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-xs shadow-md shadow-blue-500/10 flex items-center gap-1.5 cursor-pointer"
            >
              Get Free Quote <ArrowRight size={14} />
            </button>
            <a
              href="https://wa.me/+919788156637" // Mock WhatsApp API Link
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-blue-650 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
            >
              <MessageSquare size={14} /> WhatsApp
            </a>
            <a
              href="mailto:rajaaysha78@gmail.com"
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center gap-1.5"
            >
              <Mail size={14} /> Email
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
