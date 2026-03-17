"use client";

import { useState, useEffect, FormEvent } from "react";
import toast from "react-hot-toast";
import { Project, Service } from "@/lib/api";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

interface ProjectFormState {
  title: string;
  slug: string;
  description: string;
  image: string;
  techStack: string;
  liveUrl: string;
  serviceIds: string[];
  featured: boolean;
}

const defaultForm: ProjectFormState = {
  title: "",
  slug: "",
  description: "",
  image: "",
  techStack: "",
  liveUrl: "",
  serviceIds: [],
  featured: false,
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectFormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([
        fetch(`${BASE_URL}/api/projects`, { credentials: "include", cache: "no-store" }),
        fetch(`${BASE_URL}/api/services`, { credentials: "include", cache: "no-store" }),
      ]);
      if (pRes.ok) setProjects(await pRes.json());
      if (sRes.ok) setServices(await sRes.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingId(project._id);
    setForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      image: project.image,
      techStack: project.techStack.join(", "),
      liveUrl: project.liveUrl,
      serviceIds: project.services.map((s) => s._id),
      featured: project.featured,
    });
    setModalOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug && editingId ? prev.slug : slugify(title),
    }));
  };

  const toggleService = (id: string) => {
    setForm((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(id)
        ? prev.serviceIds.filter((s) => s !== id)
        : [...prev.serviceIds, id],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      description: form.description,
      image: form.image,
      techStack: form.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      liveUrl: form.liveUrl,
      services: form.serviceIds,
      featured: form.featured,
    };

    try {
      const url = editingId
        ? `${BASE_URL}/api/projects/${editingId}`
        : `${BASE_URL}/api/projects`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save project");
      }

      toast.success(editingId ? "Project updated" : "Project created");
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${BASE_URL}/api/projects/${deleteTarget._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      toast.success("Project deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setDeleteTarget(null);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-background border border-[#333] rounded-lg text-text-primary placeholder:text-text-secondary/50 focus:border-accent focus:outline-none transition-colors text-sm";
  const labelClass = "block text-xs text-text-secondary mb-1.5 font-medium";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne text-3xl font-bold text-text-primary">Projects</h1>
          <p className="text-text-secondary mt-1 text-sm">Manage your portfolio projects</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-background font-semibold rounded-lg hover:bg-accent-hover transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Project
        </button>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
        {loading ? (
          <div className="px-6 py-10 text-center text-text-secondary text-sm">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="px-6 py-10 text-center text-text-secondary text-sm">No projects yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E1E1E]">
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Services</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Live URL</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Featured</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-[#161616] transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-primary font-medium">{project.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.services.map((s) => (
                          <span
                            key={s._id}
                            className="px-2 py-0.5 rounded-full text-xs bg-surface border border-[#333] text-text-secondary"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-1 text-sm"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                          Link
                        </a>
                      ) : (
                        <span className="text-text-secondary text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {project.featured ? (
                        <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-text-secondary text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(project)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#333] text-text-secondary hover:text-text-primary hover:border-[#444] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(project)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Project" : "Add Project"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className={inputClass}
              placeholder="My Awesome Project"
            />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              className={inputClass}
              placeholder="my-awesome-project"
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Brief description..."
            />
          </div>
          <div>
            <label className={labelClass}>Image URL</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
              className={inputClass}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className={labelClass}>Tech Stack <span className="text-text-secondary/60 font-normal">(comma-separated)</span></label>
            <input
              type="text"
              value={form.techStack}
              onChange={(e) => setForm((p) => ({ ...p, techStack: e.target.value }))}
              className={inputClass}
              placeholder="React, Node.js, MongoDB"
            />
          </div>
          <div>
            <label className={labelClass}>Live URL</label>
            <input
              type="text"
              value={form.liveUrl}
              onChange={(e) => setForm((p) => ({ ...p, liveUrl: e.target.value }))}
              className={inputClass}
              placeholder="https://myproject.com"
            />
          </div>
          {services.length > 0 && (
            <div>
              <label className={labelClass}>Services</label>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {services.map((service) => (
                  <label key={service._id} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={form.serviceIds.includes(service._id)}
                      onChange={() => toggleService(service._id)}
                      className="w-4 h-4 rounded accent-amber-500"
                    />
                    <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                      {service.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                className="w-4 h-4 rounded accent-amber-500"
              />
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                Featured project
              </span>
            </label>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#333] text-text-secondary hover:text-text-primary hover:border-[#444] transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-accent text-background font-semibold rounded-lg hover:bg-accent-hover transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                editingId ? "Update" : "Create"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
      />
    </div>
  );
}
