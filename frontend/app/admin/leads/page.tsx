"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { LeadItem } from "@/lib/api";
import Modal from "@/components/admin/Modal";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type StatusFilter = "all" | "new" | "contacted" | "closed";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "…";
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LeadItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/leads`, {
        credentials: "include",
        cache: "no-store",
      });
      if (res.ok) setLeads(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads =
    filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const handleStatusChange = async (leadId: string, status: LeadItem["status"]) => {
    setUpdatingId(leadId);
    try {
      const res = await fetch(`${BASE_URL}/api/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status } : l))
      );
      // Update selected lead if open
      if (selectedLead && selectedLead._id === leadId) {
        setSelectedLead((prev) => (prev ? { ...prev, status } : prev));
      }
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${BASE_URL}/api/leads/${deleteTarget._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete lead");
      toast.success("Lead deleted");
      if (selectedLead && selectedLead._id === deleteTarget._id) {
        setSelectedLead(null);
      }
      fetchLeads();
    } catch {
      toast.error("Failed to delete lead");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filterTabs: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "new", label: "New" },
    { key: "contacted", label: "Contacted" },
    { key: "closed", label: "Closed" },
  ];

  const tabCounts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    closed: leads.filter((l) => l.status === "closed").length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-3xl font-bold text-text-primary">Leads</h1>
        <p className="text-text-secondary mt-1 text-sm">Manage incoming contact requests</p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-6 bg-[#111] border border-[#222] rounded-lg p-1 w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              filter === tab.key
                ? "bg-accent text-background"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                filter === tab.key
                  ? "bg-background/20 text-background"
                  : "bg-[#1E1E1E] text-text-secondary"
              }`}
            >
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
        {loading ? (
          <div className="px-6 py-10 text-center text-text-secondary text-sm">Loading...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="px-6 py-10 text-center text-text-secondary text-sm">No leads found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E1E1E]">
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Message</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-[#161616] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm text-text-primary font-medium">{lead.name}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{lead.email}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary max-w-xs">
                      {truncate(lead.message, 60)}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="flex items-center justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={lead.status}
                          disabled={updatingId === lead._id}
                          onChange={(e) =>
                            handleStatusChange(lead._id, e.target.value as LeadItem["status"])
                          }
                          className="px-2 py-1.5 rounded-lg text-xs bg-background border border-[#333] text-text-secondary focus:border-accent focus:outline-none transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button
                          onClick={() => setDeleteTarget(lead)}
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

      {/* Lead detail modal */}
      <Modal
        isOpen={selectedLead !== null}
        onClose={() => setSelectedLead(null)}
        title="Lead Details"
      >
        {selectedLead && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-secondary mb-1">Name</p>
                <p className="text-sm text-text-primary font-medium">{selectedLead.name}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary mb-1">Status</p>
                <StatusBadge status={selectedLead.status} />
              </div>
              <div>
                <p className="text-xs text-text-secondary mb-1">Email</p>
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="text-sm text-accent hover:text-accent-hover transition-colors"
                >
                  {selectedLead.email}
                </a>
              </div>
              <div>
                <p className="text-xs text-text-secondary mb-1">Date</p>
                <p className="text-sm text-text-primary">{formatDate(selectedLead.createdAt)}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-text-secondary mb-2">Message</p>
              <div className="bg-background border border-[#222] rounded-lg p-4 text-sm text-text-primary leading-relaxed">
                {selectedLead.message}
              </div>
            </div>

            <div>
              <p className="text-xs text-text-secondary mb-2">Update Status</p>
              <div className="flex gap-2">
                {(["new", "contacted", "closed"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(selectedLead._id, s)}
                    disabled={selectedLead.status === s || updatingId === selectedLead._id}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize disabled:opacity-40 disabled:cursor-not-allowed ${
                      selectedLead.status === s
                        ? "bg-accent text-background"
                        : "border border-[#333] text-text-secondary hover:text-text-primary hover:border-[#444]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setSelectedLead(null);
                  setDeleteTarget(selectedLead);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Delete Lead
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete the lead from "${deleteTarget?.name}"?`}
      />
    </div>
  );
}
