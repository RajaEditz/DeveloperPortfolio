import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderGit2,
  Briefcase,
  Award,
  BookOpen,
  Settings,
  Mail,
  UserCheck,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  ChevronRight,
  Upload,
} from "lucide-react";
import { apiRequest, API_BASE } from "../utils/api";

const uploadWithProgress = (endpoint, file, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `${API_BASE}${endpoint}`);

    const token = localStorage.getItem("admin_token");
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          resolve(xhr.responseText);
        }
      } else {
        try {
          const response = JSON.parse(xhr.responseText);
          reject(new Error(response.message || "Upload failed"));
        } catch (e) {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error occurred during upload."));
    };

    const formData = new FormData();
    formData.append("profile_photo", file);
    xhr.send(formData);
  });
};

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Database Data States
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [certificates, setCertifications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [publications, setPublications] = useState([]);
  const [contact, setContact] = useState({});
  const [messages, setMessages] = useState([]);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "project", "experience", "certificate", "skill", "publication"
  const [editItem, setEditItem] = useState(null); // Item being edited (null for "Add")

  // Form Fields States
  const [projectFields, setProjectFields] = useState({
    title: "",
    description: "",
    technologies: "",
    github_url: "",
    live_url: "",
    featured: false,
    image_url: "",
    image_urls: [],
    features: "",
  });

  const [experienceFields, setExperienceFields] = useState({
    role: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    currently_working: false,
    description: "",
  });

  const [certificateFields, setCertificateFields] = useState({
    title: "",
    issuer: "",
    issue_date: "",
    credential_url: "",
    image_url: "",
    image_urls: [],
  });

  const [skillFields, setSkillFields] = useState({
    category: "frontend",
    skill_name: "",
    proficiency: 80,
  });

  const [publicationFields, setPublicationFields] = useState({
    title: "",
    authors: "",
    journal: "",
    publication_date: "",
    doi: "",
    citation: "",
    abstract: "",
  });

  const [contactFields, setContactFields] = useState({
    phone: "",
    email: "",
    linkedin: "",
    github: "",
    portfolio: "",
    location: "",
    resume_url: "",
  });

  // Upload File States
  const [projectImages, setProjectImages] = useState([]);
  const [certificateImages, setCertificateImages] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  // Preview URL for selected CV image
  const [cvPreviewUrl, setCvPreviewUrl] = useState(null);

  // Profile Photo & Toast States
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  // Fetch all data from Backend API
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [proj, exp, cert, sk, pub, cont, msg, profile] = await Promise.all([
        apiRequest("/projects"),
        apiRequest("/experiences"),
        apiRequest("/certificates"),
        apiRequest("/skills"),
        apiRequest("/publications"),
        apiRequest("/contact"),
        apiRequest("/messages"),
        apiRequest("/profile-photo").catch(() => null),
      ]);

      setProjects(proj || []);
      setExperiences(exp || []);
      setCertifications(cert || []);
      setSkills(sk || []);
      setPublications(pub || []);
      setContact(cont || {});
      setMessages(msg || []);
      setProfilePhotoUrl(profile?.profile_photo || null);

      // Populate contact fields
      if (cont && Object.keys(cont).length > 0) {
        setContactFields({
          phone: cont.phone || "",
          email: cont.email || "",
          linkedin: cont.linkedin || "",
          github: cont.github || "",
          portfolio: cont.portfolio || "",
          location: cont.location || "",
          resume_url: cont.resume_url || "",
        });
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleLogoutAction = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    onLogout();
  };

  // Format date helper
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.substring(0, 10);
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "Present";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  // MODAL HANDLERS
  const openAddModal = (type) => {
    setModalType(type);
    setEditItem(null);
    setProjectImages([]);
    setCertificateImages([]);

    // Reset forms
    if (type === "project") {
      setProjectFields({
        title: "",
        description: "",
        technologies: "",
        github_url: "",
        live_url: "",
        featured: false,
        image_url: "",
        image_urls: [],
        features: "",
      });
    } else if (type === "experience") {
      setExperienceFields({
        role: "",
        company: "",
        location: "",
        start_date: "",
        end_date: "",
        currently_working: false,
        description: "",
      });
    } else if (type === "certificate") {
      setCertificateFields({
        title: "",
        issuer: "",
        issue_date: "",
        credential_url: "",
        image_url: "",
        image_urls: [],
      });
    } else if (type === "skill") {
      setSkillFields({
        category: "frontend",
        skill_name: "",
        proficiency: 80,
      });
    } else if (type === "publication") {
      setPublicationFields({
        title: "",
        authors: "",
        journal: "",
        publication_date: "",
        doi: "",
        citation: "",
        abstract: "",
      });
    }
    setModalOpen(true);
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setEditItem(item);
    setProjectImages([]);
    setCertificateImages([]);

    if (type === "project") {
      setProjectFields({
        title: item.title || "",
        description: item.description || "",
        technologies: item.technologies || "",
        github_url: item.github_url || "",
        live_url: item.live_url || "",
        featured: item.featured || false,
        image_url: item.image_url || "",
        image_urls: item.image_urls || (item.image_url ? [item.image_url] : []),
        features: Array.isArray(item.features) ? item.features.join("\n") : (item.features || ""),
      });
    } else if (type === "experience") {
      setExperienceFields({
        role: item.role || "",
        company: item.company || "",
        location: item.location || "",
        start_date: formatDateForInput(item.start_date),
        end_date: formatDateForInput(item.end_date),
        currently_working: item.currently_working || false,
        description: item.description || "",
      });
    } else if (type === "certificate") {
      setCertificateFields({
        title: item.title || "",
        issuer: item.issuer || "",
        issue_date: formatDateForInput(item.issue_date),
        credential_url: item.credential_url || "",
        image_url: item.image_url || "",
        image_urls: item.image_urls || (item.image_url ? [item.image_url] : []),
      });
    } else if (type === "skill") {
      setSkillFields({
        category: item.category || "frontend",
        skill_name: item.skill_name || "",
        proficiency: item.proficiency || 80,
      });
    } else if (type === "publication") {
      setPublicationFields({
        title: item.title || "",
        authors: item.authors || "",
        journal: item.journal || "",
        publication_date: formatDateForInput(item.publication_date),
        doi: item.doi || "",
        citation: item.citation || "",
        abstract: item.abstract || "",
      });
    }
    setModalOpen(true);
  };

  // CRUD SUBMIT ACTIONS
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      if (modalType === "project") {
        const formData = new FormData();
        formData.append("title", projectFields.title);
        formData.append("description", projectFields.description);
        formData.append("technologies", projectFields.technologies);
        formData.append("github_url", projectFields.github_url);
        formData.append("live_url", projectFields.live_url);
        formData.append("featured", projectFields.featured);
        formData.append("image_urls", JSON.stringify(projectFields.image_urls || []));

        const featuresArray = typeof projectFields.features === "string"
          ? projectFields.features.split("\n").map((f) => f.trim()).filter(Boolean)
          : (projectFields.features || []);
        formData.append("features", JSON.stringify(featuresArray));

        if (projectImages && projectImages.length > 0) {
          projectImages.forEach((img) => {
            formData.append("images", img);
          });
        }

        if (editItem) {
          await apiRequest(`/projects/${editItem.id}`, "PUT", formData, true);
        } else {
          await apiRequest("/projects", "POST", formData, true);
        }
      } else if (modalType === "certificate") {
        const formData = new FormData();
        formData.append("title", certificateFields.title);
        formData.append("issuer", certificateFields.issuer);
        formData.append("issue_date", certificateFields.issue_date);
        formData.append("credential_url", certificateFields.credential_url);
        formData.append("image_urls", JSON.stringify(certificateFields.image_urls || []));

        if (certificateImages && certificateImages.length > 0) {
          certificateImages.forEach((img) => {
            formData.append("images", img);
          });
        }

        if (editItem) {
          await apiRequest(`/certificates/${editItem.id}`, "PUT", formData, true);
        } else {
          await apiRequest("/certificates", "POST", formData, true);
        }
      } else if (modalType === "experience") {
        const payload = { ...experienceFields };
        if (payload.currently_working) payload.end_date = null;
        if (editItem) {
          await apiRequest(`/experiences/${editItem.id}`, "PUT", payload);
        } else {
          await apiRequest("/experiences", "POST", payload);
        }
      } else if (modalType === "skill") {
        if (editItem) {
          await apiRequest(`/skills/${editItem.id}`, "PUT", skillFields);
        } else {
          await apiRequest("/skills", "POST", skillFields);
        }
      } else if (modalType === "publication") {
        if (editItem) {
          await apiRequest(`/publications/${editItem.id}`, "PUT", publicationFields);
        } else {
          await apiRequest("/publications", "POST", publicationFields);
        }
      }

      setModalOpen(false);
      await fetchAllData();
      showToast("Changes saved successfully!", "success");
    } catch (err) {
      showToast("Action failed: " + err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteItem = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      if (type === "project") await apiRequest(`/projects/${id}`, "DELETE");
      else if (type === "experience") await apiRequest(`/experiences/${id}`, "DELETE");
      else if (type === "certificate") await apiRequest(`/certificates/${id}`, "DELETE");
      else if (type === "skill") await apiRequest(`/skills/${id}`, "DELETE");
      else if (type === "publication") await apiRequest(`/publications/${id}`, "DELETE");
      
      await fetchAllData();
      showToast("Item deleted successfully!", "success");
    } catch (err) {
      showToast("Delete failed: " + err.message, "error");
    }
  };

  // UPDATE CONTACT DETAILS (WITH RESUME)
  const handleUpdateContact = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("phone", contactFields.phone);
      formData.append("email", contactFields.email);
      formData.append("linkedin", contactFields.linkedin);
      formData.append("github", contactFields.github);
      formData.append("portfolio", contactFields.portfolio);
      formData.append("location", contactFields.location);
      formData.append("resume_url", contactFields.resume_url);

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const updated = await apiRequest("/contact", "PUT", formData, true);
      setContact(updated);
      setResumeFile(null);
      showToast("Contact settings updated successfully!", "success");
      await fetchAllData();
    } catch (err) {
      showToast("Failed to update contact: " + err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // MESSAGE MANAGEMENT INBOX
  const handleToggleMessageRead = async (id, currentStatus) => {
    try {
      await apiRequest(`/messages/${id}`, "PUT", { is_read: !currentStatus });
      await fetchAllData();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await apiRequest(`/messages/${id}`, "DELETE");
      await fetchAllData();
      showToast("Message deleted successfully!", "success");
    } catch (err) {
      showToast("Failed to delete message: " + err.message, "error");
    }
  };

  // RENDER SECTIONS
  const renderOverview = () => {
    const unreadCount = messages.filter((m) => !m.is_read).length;
    return (
      <div className="space-y-8 animate-fade-in text-slate-800">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Projects</span>
            <h4 className="text-2xl font-black mt-1 text-blue-600">{projects.length}</h4>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Unread Messages</span>
            <h4 className="text-2xl font-black mt-1 text-purple-600">{unreadCount}</h4>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Certificates</span>
            <h4 className="text-2xl font-black mt-1 text-emerald-600">{certificates.length}</h4>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Technical Skills</span>
            <h4 className="text-2xl font-black mt-1 text-amber-600">{skills.length}</h4>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-400">
            Unread Notifications / Messages
          </h3>
          {messages.filter((m) => !m.is_read).length === 0 ? (
            <p className="text-xs text-slate-500">No new messages in your inbox.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {messages
                .filter((m) => !m.is_read)
                .slice(0, 3)
                .map((msg) => (
                  <div key={msg.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold block text-slate-700">{msg.name}</span>
                      <span className="text-slate-400 block">{msg.subject || "No Subject"}</span>
                    </div>
                    <button
                      onClick={() => setActiveTab("messages")}
                      className="text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      Open Inbox <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Manage Projects</h3>
        <button
          onClick={() => openAddModal("project")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
        >
          <Plus size={14} /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex justify-between items-start gap-4"
          >
            <div className="space-y-2">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/50">
                {proj.featured ? "★ Featured" : "Standard"}
              </span>
              <h4 className="text-sm font-bold text-slate-850">{proj.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{proj.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal("project", proj)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={() => handleDeleteItem("project", proj.id)}
                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-650 transition-colors cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExperiences = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Manage Experiences</h3>
        <button
          onClick={() => openAddModal("experience")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
        >
          <Plus size={14} /> Add Experience
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex justify-between items-center"
          >
            <div>
              <h4 className="text-sm font-bold text-slate-850">{exp.role}</h4>
              <span className="text-xs text-slate-500 block">
                {exp.company} — {exp.location}
              </span>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block mt-1">
                {formatDateDisplay(exp.start_date)} - {exp.currently_working ? "Present" : formatDateDisplay(exp.end_date)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal("experience", exp)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={() => handleDeleteItem("experience", exp.id)}
                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-650 transition-colors cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCertificates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Manage Certificates</h3>
        <button
          onClick={() => openAddModal("certificate")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
        >
          <Plus size={14} /> Add Certificate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex justify-between items-center gap-4"
          >
            <div>
              <h4 className="text-sm font-bold text-slate-850">{cert.title}</h4>
              <span className="text-xs text-slate-500 block">{cert.issuer}</span>
              <span className="text-[10px] text-slate-400 block">{formatDateDisplay(cert.issue_date)}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal("certificate", cert)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={() => handleDeleteItem("certificate", cert.id)}
                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-650 transition-colors cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Manage Skills</h3>
        <button
          onClick={() => openAddModal("skill")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
        >
          <Plus size={14} /> Add Skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((sk) => (
          <div
            key={sk.id}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex justify-between items-center"
          >
            <div>
              <h4 className="text-xs font-bold text-slate-850">{sk.skill_name}</h4>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 block w-max uppercase tracking-wider font-bold mt-1 text-center font-mono">
                {sk.category}
              </span>
              <span className="text-[10px] text-slate-450 block mt-1">Proficiency: {sk.proficiency}%</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal("skill", sk)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-650 transition-colors cursor-pointer"
              >
                <Edit2 size={10} />
              </button>
              <button
                onClick={() => handleDeleteItem("skill", sk.id)}
                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
              >
                <Trash2 size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPublications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Manage Publications</h3>
        <button
          onClick={() => openAddModal("publication")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
        >
          <Plus size={14} /> Add Publication
        </button>
      </div>

      <div className="space-y-4">
        {publications.map((pub) => (
          <div
            key={pub.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex justify-between items-start gap-4"
          >
            <div>
              <h4 className="text-sm font-bold text-slate-850 leading-snug">{pub.title}</h4>
              <span className="text-xs text-slate-500 block mt-1">Journal: {pub.journal}</span>
              <span className="text-[10px] text-slate-400 block">DOI: {pub.doi}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal("publication", pub)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-650 transition-colors cursor-pointer"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={() => handleDeleteItem("publication", pub.id)}
                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm max-w-2xl text-slate-800">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">Update Contact &amp; Resume Info</h3>
      
      <form onSubmit={handleUpdateContact} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Phone</label>
            <input
              type="text"
              value={contactFields.phone}
              onChange={(e) => setContactFields({ ...contactFields, phone: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email</label>
            <input
              type="email"
              value={contactFields.email}
              onChange={(e) => setContactFields({ ...contactFields, email: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">LinkedIn URL</label>
            <input
              type="text"
              value={contactFields.linkedin}
              onChange={(e) => setContactFields({ ...contactFields, linkedin: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">GitHub URL</label>
            <input
              type="text"
              value={contactFields.github}
              onChange={(e) => setContactFields({ ...contactFields, github: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Portfolio URL</label>
            <input
              type="text"
              value={contactFields.portfolio}
              onChange={(e) => setContactFields({ ...contactFields, portfolio: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Location</label>
            <input
              type="text"
              value={contactFields.location}
              onChange={(e) => setContactFields({ ...contactFields, location: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-800"
            />
          </div>
        </div>

        {/* Upload CV Image */}
        <div className="space-y-1.5 pt-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Upload CV Image</label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer font-semibold transition-all">
              <Upload size={14} /> {resumeFile ? resumeFile.name : "Select Image"}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      alert("File size exceeds 5 MB limit.");
                      return;
                    }
                    setResumeFile(file);
                    setCvPreviewUrl(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
            {cvPreviewUrl && (
              <div className="mt-2">
                <img src={cvPreviewUrl} alt="CV preview" className="h-24 object-contain rounded" />
              </div>
            )}
            {contact.resume_url && (
              <span className="text-[10px] text-slate-500">
                Current: <img src={contact.resume_url} alt="Current CV" className="h-24 object-contain rounded" />
              </span>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={actionLoading}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide uppercase transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Update Contact
          </button>
        </div>
      </form>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Visitor Feedback Inbox</h3>
      
      {messages.length === 0 ? (
        <p className="text-xs text-slate-500">No messages in your inbox.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${
                msg.is_read
                  ? "bg-slate-100/40 border-slate-200 text-slate-650 opacity-80"
                  : "bg-white border-blue-200 shadow-md shadow-blue-500/5 text-slate-850"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    {msg.name}
                    {!msg.is_read && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-blue-500 text-white animate-pulse">
                        New
                      </span>
                    )}
                  </h4>
                  <a href={`mailto:${msg.email}`} className="text-xs text-blue-500 hover:underline">
                    {msg.email}
                  </a>
                  <span className="text-[10px] text-slate-450 block mt-1">
                    Subject: <strong className="text-slate-700">{msg.subject || "No Subject"}</strong>
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">{formatDateDisplay(msg.created_at)}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-sans bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {msg.message}
              </p>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleToggleMessageRead(msg.id, msg.is_read)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {msg.is_read ? "Mark as Unread" : "Mark as Read"}
                </button>
                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfilePhoto = () => {
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
          showToast("Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.", "error");
          return;
        }
        // Validate size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          showToast("File size exceeds 5MB limit.", "error");
          return;
        }
        setProfilePhotoFile(file);
        setProfilePhotoPreview(URL.createObjectURL(file));
      }
    };

    const handleSavePhoto = async () => {
      if (!profilePhotoFile) {
        showToast("Please select a file to upload first.", "error");
        return;
      }
      setActionLoading(true);
      setUploadProgress(10); // Start progress
      try {
        const result = await uploadWithProgress("/profile-photo", profilePhotoFile, (percent) => {
          setUploadProgress(percent);
        });
        setProfilePhotoUrl(result.profile_photo);
        setProfilePhotoFile(null);
        setProfilePhotoPreview(null);
        showToast("Profile photo uploaded successfully!", "success");
        await fetchAllData();
      } catch (err) {
        showToast("Failed to upload profile photo: " + err.message, "error");
      } finally {
        setActionLoading(false);
        setUploadProgress(0);
      }
    };

    const handleDeletePhoto = async () => {
      if (!window.confirm("Are you sure you want to delete your profile photo?")) return;
      setActionLoading(true);
      try {
        await apiRequest("/profile-photo", "DELETE");
        setProfilePhotoUrl(null);
        setProfilePhotoFile(null);
        setProfilePhotoPreview(null);
        showToast("Profile photo removed successfully!", "success");
        await fetchAllData();
      } catch (err) {
        showToast("Failed to delete profile photo: " + err.message, "error");
      } finally {
        setActionLoading(false);
      }
    };

    const handleCancelSelection = () => {
      setProfilePhotoFile(null);
      setProfilePhotoPreview(null);
    };

    return (
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm max-w-2xl text-slate-800 animate-fade-in">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">Profile Photo Management</h3>
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Current Profile Photo */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Current Photo</span>
              <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner flex items-center justify-center bg-slate-50 relative group">
                {profilePhotoUrl ? (
                  <img src={profilePhotoUrl} alt="Current profile" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                ) : (
                  <div className="flex flex-col items-center text-slate-350">
                    <span className="text-4xl">👤</span>
                    <span className="text-[9px] mt-1 font-semibold uppercase">No photo</span>
                  </div>
                )}
              </div>
            </div>

            {/* Selected File Preview (If any) */}
            {profilePhotoPreview && (
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-2">New Photo Preview</span>
                <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-blue-200 shadow-md flex items-center justify-center bg-blue-50/20 relative">
                  <img src={profilePhotoPreview} alt="Selected preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={handleCancelSelection}
                    className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-red-500 shadow-sm transition-all"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Inputs & Progress */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer font-semibold transition-all text-xs">
                <Upload size={14} className="text-slate-450" /> 
                {profilePhotoFile ? "Change Selection" : "Select Profile Photo"}
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                />
              </label>

              {profilePhotoFile && (
                <button
                  onClick={handleSavePhoto}
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                  Save Changes
                </button>
              )}

              {profilePhotoUrl && !profilePhotoFile && (
                <button
                  onClick={handleDeletePhoto}
                  disabled={actionLoading}
                  className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-655 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 size={12} />
                  Remove Photo
                </button>
              )}
            </div>

            {/* Upload Progress Bar */}
            {actionLoading && uploadProgress > 0 && (
              <div className="space-y-1 max-w-sm">
                <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Uploading to Cloudinary...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-150 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex justify-center items-center flex-col gap-4 font-sans select-none">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <span className="text-xs text-slate-500 tracking-wider font-semibold">Initializing Dashboard...</span>
      </div>
    );
  }

  const adminName = localStorage.getItem("admin_name") || "Administrator";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans select-none animate-fade-in">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 select-none shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              AD
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-850">Dashboard</span>
          </div>

          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-blue-50/70 text-blue-650 font-bold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <LayoutDashboard size={16} /> Overview
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-all cursor-pointer ${
                activeTab === "projects"
                  ? "bg-blue-50/70 text-blue-655 font-bold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <FolderGit2 size={16} /> Projects
            </button>
            <button
              onClick={() => setActiveTab("experiences")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-all cursor-pointer ${
                activeTab === "experiences"
                  ? "bg-blue-50/70 text-blue-655 font-bold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Briefcase size={16} /> Experiences
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-all cursor-pointer ${
                activeTab === "certificates"
                  ? "bg-blue-50/70 text-blue-655 font-bold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Award size={16} /> Certificates
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-all cursor-pointer ${
                activeTab === "skills"
                  ? "bg-blue-50/70 text-blue-655 font-bold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Settings size={16} /> Skills
            </button>
            <button
              onClick={() => setActiveTab("publications")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-all cursor-pointer ${
                activeTab === "publications"
                  ? "bg-blue-50/70 text-blue-655 font-bold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <BookOpen size={16} /> Publications
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-all cursor-pointer ${
                activeTab === "contact"
                  ? "bg-blue-50/70 text-blue-655 font-bold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <UserCheck size={16} /> Contact &amp; Resume
            </button>
            <button
              onClick={() => setActiveTab("profile-photo")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-all cursor-pointer ${
                activeTab === "profile-photo"
                  ? "bg-blue-50/70 text-blue-655 font-bold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <span className="text-sm">👤</span> Profile Photo
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-all cursor-pointer ${
                activeTab === "messages"
                  ? "bg-blue-50/70 text-blue-655 font-bold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Mail size={16} /> Inbox Messages
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold font-mono">
              {adminName.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-[10px] truncate max-w-[130px]">
              <span className="font-semibold block text-slate-700">{adminName}</span>
              <span className="text-slate-450 block">Logged In</span>
            </div>
          </div>
          <button
            onClick={handleLogoutAction}
            className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 transition-all text-red-600 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut size={12} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 bg-slate-50 p-8 overflow-y-auto max-h-screen">
        <header className="mb-8 flex justify-between items-center">
          <h2 className="text-xl font-black capitalize text-slate-850">
            {activeTab} Panel
          </h2>
          <span className="text-[10px] text-slate-400 font-mono">v1.0.0 Stable</span>
        </header>

        {activeTab === "overview" && renderOverview()}
        {activeTab === "projects" && renderProjects()}
        {activeTab === "experiences" && renderExperiences()}
        {activeTab === "certificates" && renderCertificates()}
        {activeTab === "skills" && renderSkills()}
        {activeTab === "publications" && renderPublications()}
        {activeTab === "contact" && renderContact()}
        {activeTab === "profile-photo" && renderProfilePhoto()}
        {activeTab === "messages" && renderMessages()}
      </main>

      {/* ADD / EDIT MODAL SYSTEM */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/70 backdrop-blur-sm select-none font-sans text-slate-800">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200/80 p-6 md:p-8 rounded-3xl w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {editItem ? `Edit ${modalType}` : `Add New ${modalType}`}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                {modalType === "project" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Project Title</label>
                      <input
                        type="text"
                        required
                        value={projectFields.title}
                        onChange={(e) => setProjectFields({ ...projectFields, title: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={projectFields.description}
                        onChange={(e) => setProjectFields({ ...projectFields, description: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Key Features (one per line)</label>
                      <textarea
                        rows={3}
                        value={projectFields.features}
                        onChange={(e) => setProjectFields({ ...projectFields, features: e.target.value })}
                        placeholder="Enter key features, each on a new line"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Technologies (comma separated)</label>
                      <input
                        type="text"
                        placeholder="React.js, Node.js, PostgreSQL"
                        required
                        value={projectFields.technologies}
                        onChange={(e) => setProjectFields({ ...projectFields, technologies: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">GitHub Link</label>
                        <input
                          type="text"
                          value={projectFields.github_url}
                          onChange={(e) => setProjectFields({ ...projectFields, github_url: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Live Demo Link</label>
                        <input
                          type="text"
                          value={projectFields.live_url}
                          onChange={(e) => setProjectFields({ ...projectFields, live_url: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={projectFields.featured}
                        onChange={(e) => setProjectFields({ ...projectFields, featured: e.target.checked })}
                      />
                      <label htmlFor="featured" className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Featured Project</label>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Project Photos (Upload 10+ photos)</label>
                      
                      {/* Existing Images Grid */}
                      {projectFields.image_urls && projectFields.image_urls.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-semibold text-slate-455 uppercase">Existing Photos:</span>
                          <div className="grid grid-cols-4 gap-2 border border-slate-150 p-2 rounded-xl bg-slate-50/50">
                            {projectFields.image_urls.map((url, index) => (
                              <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group">
                                <img src={url} alt={`Project ${index}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = projectFields.image_urls.filter((_, i) => i !== index);
                                    setProjectFields({ ...projectFields, image_urls: updated });
                                  }}
                                  className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Selected Files Preview Grid */}
                      {projectImages && projectImages.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-semibold text-blue-500 uppercase">New Selected Photos:</span>
                          <div className="grid grid-cols-4 gap-2 border border-blue-100 p-2 rounded-xl bg-blue-50/10">
                            {projectImages.map((file, index) => {
                              const previewUrl = URL.createObjectURL(file);
                              return (
                                <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-blue-200 group">
                                  <img src={previewUrl} alt={`New upload ${index}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = projectImages.filter((_, i) => i !== index);
                                      setProjectImages(updated);
                                    }}
                                    className="absolute top-1 right-1 p-1 bg-slate-800/80 hover:bg-slate-900 text-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* File Select Label */}
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-400 p-4 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <Upload size={20} className="text-slate-400 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-650">Select New Photos</span>
                        <span className="text-[9px] text-slate-450 mt-0.5">JPEG, PNG, WEBP (Multiple allowed)</span>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const selectedFiles = Array.from(e.target.files || []);
                            if (projectImages.length + selectedFiles.length > 15) {
                              alert("You can upload a maximum of 15 photos.");
                              return;
                            }
                            setProjectImages([...projectImages, ...selectedFiles]);
                          }}
                        />
                      </label>
                    </div>
                  </>
                )}

                {modalType === "experience" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Job Role / Title</label>
                        <input
                          type="text"
                          required
                          value={experienceFields.role}
                          onChange={(e) => setExperienceFields({ ...experienceFields, role: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Company Name</label>
                        <input
                          type="text"
                          required
                          value={experienceFields.company}
                          onChange={(e) => setExperienceFields({ ...experienceFields, company: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Location</label>
                      <input
                        type="text"
                        placeholder="Trichy, India or Remote"
                        value={experienceFields.location}
                        onChange={(e) => setExperienceFields({ ...experienceFields, location: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Start Date</label>
                        <input
                          type="date"
                          required
                          value={experienceFields.start_date}
                          onChange={(e) => setExperienceFields({ ...experienceFields, start_date: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">End Date</label>
                        <input
                          type="date"
                          disabled={experienceFields.currently_working}
                          required={!experienceFields.currently_working}
                          value={experienceFields.currently_working ? "" : experienceFields.end_date}
                          onChange={(e) => setExperienceFields({ ...experienceFields, end_date: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805 disabled:opacity-50"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="currently_working"
                        checked={experienceFields.currently_working}
                        onChange={(e) => setExperienceFields({ ...experienceFields, currently_working: e.target.checked })}
                      />
                      <label htmlFor="currently_working" className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Currently Working Here</label>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Description</label>
                      <textarea
                        rows={4}
                        required
                        value={experienceFields.description}
                        onChange={(e) => setExperienceFields({ ...experienceFields, description: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                      />
                    </div>
                  </>
                )}

                {modalType === "certificate" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Certificate Title</label>
                        <input
                          type="text"
                          required
                          value={certificateFields.title}
                          onChange={(e) => setCertificateFields({ ...certificateFields, title: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Issuing Organization</label>
                        <input
                          type="text"
                          required
                          value={certificateFields.issuer}
                          onChange={(e) => setCertificateFields({ ...certificateFields, issuer: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Issue Date</label>
                        <input
                          type="date"
                          value={certificateFields.issue_date}
                          onChange={(e) => setCertificateFields({ ...certificateFields, issue_date: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Credential Verification Link</label>
                        <input
                          type="text"
                          value={certificateFields.credential_url}
                          onChange={(e) => setCertificateFields({ ...certificateFields, credential_url: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                        />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505 block">Certificate Images (Upload 10+ photos)</label>
                      
                      {/* Existing Images Grid */}
                      {certificateFields.image_urls && certificateFields.image_urls.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-semibold text-slate-455 uppercase">Existing Photos:</span>
                          <div className="grid grid-cols-4 gap-2 border border-slate-150 p-2 rounded-xl bg-slate-50/50">
                            {certificateFields.image_urls.map((url, index) => (
                              <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group">
                                <img src={url} alt={`Certificate ${index}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = certificateFields.image_urls.filter((_, i) => i !== index);
                                    setCertificateFields({ ...certificateFields, image_urls: updated });
                                  }}
                                  className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-655 text-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Selected Files Preview Grid */}
                      {certificateImages && certificateImages.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-semibold text-blue-500 uppercase">New Selected Photos:</span>
                          <div className="grid grid-cols-4 gap-2 border border-blue-100 p-2 rounded-xl bg-blue-50/10">
                            {certificateImages.map((file, index) => {
                              const previewUrl = URL.createObjectURL(file);
                              return (
                                <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-blue-200 group">
                                  <img src={previewUrl} alt={`New upload ${index}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = certificateImages.filter((_, i) => i !== index);
                                      setCertificateImages(updated);
                                    }}
                                    className="absolute top-1 right-1 p-1 bg-slate-800/80 hover:bg-slate-900 text-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* File Select Label */}
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-400 p-4 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <Upload size={20} className="text-slate-400 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-650">Select New Photos</span>
                        <span className="text-[9px] text-slate-450 mt-0.5">JPEG, PNG, WEBP (Multiple allowed)</span>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const selectedFiles = Array.from(e.target.files || []);
                            if (certificateImages.length + selectedFiles.length > 15) {
                              alert("You can upload a maximum of 15 photos.");
                              return;
                            }
                            setCertificateImages([...certificateImages, ...selectedFiles]);
                          }}
                        />
                      </label>
                    </div>
                  </>
                )}

                {modalType === "skill" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Skill Name</label>
                        <input
                          type="text"
                          required
                          value={skillFields.skill_name}
                          onChange={(e) => setSkillFields({ ...skillFields, skill_name: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Category</label>
                        <select
                          value={skillFields.category}
                          onChange={(e) => setSkillFields({ ...skillFields, category: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                        >
                          <option value="frontend">Frontend Development</option>
                          <option value="backend-db">Backend &amp; Databases</option>
                          <option value="programming">Programming Languages</option>
                          <option value="tools">Development Tools</option>
                          <option value="deployment">Deployment &amp; Cloud</option>
                          <option value="soft">Soft Skills</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Proficiency level</label>
                        <span className="text-[10px] font-mono text-blue-500 font-bold">{skillFields.proficiency}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={skillFields.proficiency}
                        onChange={(e) => setSkillFields({ ...skillFields, proficiency: e.target.value })}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>
                  </>
                )}

                {modalType === "publication" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Publication Title</label>
                      <input
                        type="text"
                        required
                        value={publicationFields.title}
                        onChange={(e) => setPublicationFields({ ...publicationFields, title: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Author(s)</label>
                        <input
                          type="text"
                          required
                          value={publicationFields.authors}
                          onChange={(e) => setPublicationFields({ ...publicationFields, authors: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Journal Name</label>
                        <input
                          type="text"
                          required
                          value={publicationFields.journal}
                          onChange={(e) => setPublicationFields({ ...publicationFields, journal: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Publication Date</label>
                        <input
                          type="date"
                          value={publicationFields.publication_date}
                          onChange={(e) => setPublicationFields({ ...publicationFields, publication_date: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">DOI</label>
                        <input
                          type="text"
                          value={publicationFields.doi}
                          onChange={(e) => setPublicationFields({ ...publicationFields, doi: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Citation Text</label>
                      <textarea
                        rows={2}
                        value={publicationFields.citation}
                        onChange={(e) => setPublicationFields({ ...publicationFields, citation: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-505">Abstract</label>
                      <textarea
                        rows={3}
                        value={publicationFields.abstract}
                        onChange={(e) => setPublicationFields({ ...publicationFields, abstract: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-slate-50/50 text-slate-805"
                      />
                    </div>
                  </>
                )}

                <div className="pt-4 border-t border-slate-200 flex justify-end gap-2 font-semibold">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                    {editItem ? "Save Changes" : "Create Item"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-5 right-5 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl font-sans font-semibold text-xs transition-all ${
              toast.type === "success"
                ? "bg-emerald-55 border-emerald-200 text-emerald-800"
                : toast.type === "error"
                ? "bg-rose-55 border-rose-200 text-rose-800"
                : "bg-blue-55 border-blue-200 text-blue-800"
            }`}
          >
            {toast.type === "success" ? (
              <div className="p-1 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Check size={12} />
              </div>
            ) : (
              <div className="p-1 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                <X size={12} />
              </div>
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
