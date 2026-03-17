interface StatusBadgeProps {
  status: "new" | "contacted" | "closed";
}

const statusConfig = {
  new: {
    label: "New",
    className: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  },
  contacted: {
    label: "Contacted",
    className: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  },
  closed: {
    label: "Closed",
    className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
