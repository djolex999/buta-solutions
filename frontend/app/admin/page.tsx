import { Service, Project, LeadItem } from "@/lib/api";
import StatusBadge from "@/components/admin/StatusBadge";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function fetchSafe<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminDashboardPage() {
  const [services, projects, leads] = await Promise.all([
    fetchSafe<Service[]>(`${BASE_URL}/api/services`),
    fetchSafe<Project[]>(`${BASE_URL}/api/projects`),
    fetchSafe<LeadItem[]>(`${BASE_URL}/api/leads`),
  ]);

  const totalServices = services?.length ?? 0;
  const totalProjects = projects?.length ?? 0;
  const totalLeads = leads?.length ?? 0;
  const newLeads = leads?.filter((l) => l.status === "new").length ?? 0;
  const recentLeads = leads?.slice(0, 5) ?? [];

  const statCards = [
    {
      label: "Total Projects",
      value: totalProjects,
      accent: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
        </svg>
      ),
    },
    {
      label: "Total Services",
      value: totalServices,
      accent: false,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Total Leads",
      value: totalLeads,
      accent: false,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
    },
    {
      label: "New Leads",
      value: newLeads,
      accent: false,
      badge: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-syne text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">Welcome back</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-[#111] border border-[#222] rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-secondary text-sm">{card.label}</span>
              <span className={card.accent ? "text-accent" : "text-text-secondary"}>
                {card.icon}
              </span>
            </div>
            <div className="flex items-end gap-2">
              <span
                className={`font-syne text-4xl font-bold ${
                  card.accent ? "text-accent" : "text-text-primary"
                }`}
              >
                {card.value}
              </span>
              {card.badge && card.value > 0 && (
                <span className="mb-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  unread
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent leads */}
      <div className="bg-[#111] border border-[#222] rounded-xl">
        <div className="px-6 py-4 border-b border-[#222]">
          <h2 className="font-syne text-lg font-semibold text-text-primary">Recent Leads</h2>
        </div>
        {recentLeads.length === 0 ? (
          <div className="px-6 py-10 text-center text-text-secondary text-sm">
            No leads yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E1E1E]">
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {recentLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-[#161616] transition-colors">
                    <td className="px-6 py-4 text-sm text-text-primary font-medium">{lead.name}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{lead.email}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{formatDate(lead.createdAt)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
