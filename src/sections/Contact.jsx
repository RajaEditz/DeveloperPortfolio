import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Contact() {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle, sending, success, error

  const [contactData, setContactData] = useState({
    email: "rajaaysha78@gmail.com",
    phone: "+91 9788156637",
    location: "Chennai, Tamil Nadu, India",
    resume_url: "/resume.pdf"
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/contact")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.email) {
          setContactData({
            email: data.email || "rajaaysha78@gmail.com",
            phone: data.phone || "+91 9788156637",
            location: data.location || "Chennai, Tamil Nadu, India",
            resume_url: data.resume_url || "/resume.pdf"
          });
        }
      })
      .catch((err) => console.error("Error loading contact settings from DB:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }
    if (!formData.subject.trim()) tempErrors.subject = "Subject is required";
    if (!formData.message.trim()) tempErrors.message = "Message is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitStatus('sending');

    try {
      const response = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitStatus('success');
      
      // Trigger canvas confetti celebrate pop!
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Clear Form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (err) {
      console.error("Message send error:", err);
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }
  };
  const handleDownloadCV = async () => {
    try {
      const response = await fetch(contactData.resume_url);
      if (!response.ok) throw new Error('Failed to fetch CV image');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const extension = blob.type.includes('png')
        ? '.png'
        : blob.type.includes('jpeg')
        ? '.jpeg'
        : '.jpg';
      link.download = `cv_image${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download CV error:', err);
    }
  };
  return (
    <section id="contact" className="py-20 bg-slate-100/30 dark:bg-slate-950/20 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white sm:text-4xl mb-3">
            Contact <span className="text-gradient">Me</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Get in touch for contract work, employment offers, or project collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-6xl mx-auto text-left">
          
          {/* Left Column: Info & Map Card */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-slate-300/30 dark:border-slate-800/40 space-y-6 flex-1">
              <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-2">
                Connect Directly
              </h3>
              
              <div className="space-y-4 text-xs font-sans">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-650 dark:text-blue-450 border border-blue-500/20">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Email</h4>
                    <a href={`mailto:${contactData.email}`} className="text-slate-700 dark:text-slate-300 hover:text-blue-500 transition-colors">
                      {contactData.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-650 dark:text-blue-450 border border-blue-500/20">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Phone</h4>
                    <a href={`tel:${contactData.phone}`} className="text-slate-700 dark:text-slate-300 hover:text-blue-500 transition-colors">
                      {contactData.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-650 dark:text-blue-450 border border-blue-500/20">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Location</h4>
                    <p className="text-slate-700 dark:text-slate-300">
                      {contactData.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-6 border-t border-slate-300/25 dark:border-slate-800/40 select-none">
                <button
                  onClick={handleDownloadCV}
                  className="w-full py-3 rounded-xl bg-slate-200/60 dark:bg-slate-900 border border-slate-300/30 dark:border-slate-800 text-slate-705 dark:text-slate-200 hover:bg-slate-350/40 hover:scale-102 transition-all flex items-center justify-center gap-2 text-xs font-bold"
                >
                  <Download size={14} /> Download CV Image
                </button>
              </div>
            </div>

            {/* Stylized Mock Map Container */}
            <div className="h-44 rounded-2xl overflow-hidden glass border border-slate-300/30 dark:border-slate-800/40 relative shadow-lg">
              <div className="absolute inset-0 bg-slate-200 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center select-none z-10">
                <MapPin size={24} className="text-red-500 animate-bounce mb-2" />
                <h4 className="text-xs font-bold text-slate-850 dark:text-slate-300">Chennai Area Mapping</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-xs mt-1">
                  Open to local meetings, hybrid roles, and remote positions internationally.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-slate-300/30 dark:border-slate-800/40 h-full flex flex-col justify-between">
              <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-6">
                Send a Message
              </h3>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-450 font-sans">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-200/25 dark:bg-slate-950/20 border border-slate-300/50 dark:border-slate-800/70 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-sans"
                    />
                    {errors.name && <span className="text-[10px] text-rose-500 font-semibold">{errors.name}</span>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-450 font-sans">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-200/25 dark:bg-slate-950/20 border border-slate-300/50 dark:border-slate-800/70 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-sans"
                    />
                    {errors.email && <span className="text-[10px] text-rose-500 font-semibold">{errors.email}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-450 font-sans">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-200/25 dark:bg-slate-950/20 border border-slate-300/50 dark:border-slate-800/70 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-sans"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="subject" className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-450 font-sans">Subject Topic</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-200/25 dark:bg-slate-950/20 border border-slate-300/50 dark:border-slate-800/70 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-sans"
                    />
                    {errors.subject && <span className="text-[10px] text-rose-500 font-semibold">{errors.subject}</span>}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-450 font-sans">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-200/25 dark:bg-slate-950/20 border border-slate-300/50 dark:border-slate-800/70 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-sans resize-none"
                  />
                  {errors.message && <span className="text-[10px] text-rose-500 font-semibold">{errors.message}</span>}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitStatus === 'sending'}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold text-xs shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 hover:scale-102 transition-all cursor-pointer select-none"
                >
                  {submitStatus === 'sending' ? (
                    <span>Sending Message...</span>
                  ) : submitStatus === 'success' ? (
                    <span>Message Sent Successfully!</span>
                  ) : submitStatus === 'error' ? (
                    <span>Error! Please Try Again.</span>
                  ) : (
                    <>
                      <Send size={14} /> Send Message Mail
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
