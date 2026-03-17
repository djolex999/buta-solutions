"use client";

import { useState, useEffect, FormEvent } from "react";
import toast from "react-hot-toast";
import { Service } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth";
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

interface ServiceFormState {
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}

const defaultForm: ServiceFormState = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  order: 0,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceFormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/services`, {
        headers: { ...getAuthHeaders() },
        cache: "no-store",
      });
      if (res.ok) setServices(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingId(service._id);
    setForm({
      name: service.name,
      slug: service.slug,
      description: service.description,
      icon: service.icon,
      order: service.order,
    });
    setModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: prev.slug && editingId ? prev.slug : slugify(name),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingId
        ? `${BASE_URL}/api/services/${editingId}`
        : `${BASE_URL}/api/services`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save service");
      }

      toast.success(editingId ? "Service updated" : "Service created");
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${BASE_URL}/api/services/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { ...getAuthHeaders() },
      });
      if (!res.ok) throw new Error("Failed to delete service");
      toast.success("Service deleted");
      fetchServices();
    } catch {
      toast.error("Failed to delete service");
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
          <h1 className="font-syne text-3xl font-bold text-text-primary">Services</h1>
          <p className="text-text-secondary mt-1 text-sm">Manage your service offerings</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-background font-semibold rounded-lg hover:bg-accent-hover transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Service
        </button>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
        {loading ? (
          <div className="px-6 py-10 text-center text-text-secondary text-sm">Loading...</div>
        ) : services.length === 0 ? (
          <div className="px-6 py-10 text-center text-text-secondary text-sm">No services yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E1E1E]">
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Order</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Slug</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Icon</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {services.map((service) => (
                  <tr key={service._id} className="hover:bg-[#161616] transition-colors">
                    <td className="px-6 py-4 text-sm text-text-secondary">{service.order}</td>
                    <td className="px-6 py-4 text-sm text-text-primary font-medium">{service.name}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary font-mono">{service.slug}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{service.icon || "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(service)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#333] text-text-secondary hover:text-text-primary hover:border-[#444] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(service)}
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
        title={editingId ? "Edit Service" : "Add Service"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className={inputClass}
              placeholder="Mobile Development"
            />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              className={inputClass}
              placeholder="mobile-development"
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Brief description of this service..."
            />
          </div>
          <div>
            <label className={labelClass}>Icon</label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
              className={inputClass}
              placeholder="smartphone"
            />
          </div>
          <div>
            <label className={labelClass}>Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
              className={inputClass}
              placeholder="1"
              min={0}
            />
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
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
      />
    </div>
  );
}
