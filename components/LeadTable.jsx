import { useState } from "react";
import clientConfig from "@/data/clientConfig";

const { dashboard } = clientConfig;
const cols = dashboard.tableColumns;

/**
 * Relative-time formatter — returns strings like "2 hours ago".
 * Falls back to the absolute date for older entries.
 */
function formatRelative(dateValue) {
  if (!dateValue) return "—";
  const then = new Date(dateValue).getTime();
  if (Number.isNaN(then)) return "—";

  const diffMs = Date.now() - then;
  const s = Math.floor(diffMs / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);

  if (s < 60) return s <= 1 ? "just now" : `${s} seconds ago`;
  if (m < 60) return m === 1 ? "1 minute ago" : `${m} minutes ago`;
  if (h < 24) return h === 1 ? "1 hour ago" : `${h} hours ago`;
  if (d < 7) return d === 1 ? "1 day ago" : `${d} days ago`;
  return new Date(dateValue).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function LeadTable({ leads }) {
  const [expanded, setExpanded] = useState(new Set());

  if (!leads || leads.length === 0) {
    return (
      <div className="rounded-card border border-border bg-surface p-12 text-center shadow-soft">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft">
          <span className="text-accent text-lg" aria-hidden>📭</span>
        </div>
        <p className="text-sm leading-relaxed text-secondary max-w-md mx-auto">
          {dashboard.emptyState}
        </p>
      </div>
    );
  }

  function toggleExpand(id) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface shadow-soft">
      {/* Desktop / tablet: table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-elevated/60">
            <tr>
              <th className="px-5 py-3.5 text-left font-semibold text-primary font-display">
                {cols.name}
              </th>
              <th className="px-5 py-3.5 text-left font-semibold text-primary font-display">
                {cols.contact}
              </th>
              <th className="px-5 py-3.5 text-left font-semibold text-primary font-display">
                {cols.captured}
              </th>
              <th className="px-5 py-3.5 text-left font-semibold text-primary font-display">
                {cols.summary}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {leads.map((lead) => {
              const isOpen = expanded.has(lead._id);
              const summary = lead.conversationSummary;
              return (
                <tr key={lead._id} className="hover:bg-elevated/40 transition-colors">
                  <td className="whitespace-nowrap px-5 py-4 font-medium text-primary">
                    {lead.name}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-secondary">
                    <span className="break-all">{lead.contact}</span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-secondary font-mono-utility text-[12.5px] tabular-nums">
                    {formatRelative(lead.createdAt)}
                  </td>
                  <td className="max-w-md px-5 py-4 text-primary/90">
                    {summary ? (
                      <>
                        <p
                          className={`whitespace-pre-wrap text-[13.5px] leading-relaxed ${
                            isOpen ? "" : "line-clamp-3"
                          }`}
                        >
                          {summary}
                        </p>
                        {summary.length > 140 && (
                          <button
                            type="button"
                            onClick={() => toggleExpand(lead._id)}
                            className="mt-1.5 text-[12px] font-medium text-accent hover:text-accent-hover transition-colors"
                          >
                            {isOpen ? "Show less" : "Show full"}
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-secondary/70">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="divide-y divide-border md:hidden">
        {leads.map((lead) => {
          const isOpen = expanded.has(lead._id);
          const summary = lead.conversationSummary;
          return (
            <div key={lead._id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-primary truncate">
                    {lead.name}
                  </p>
                  <p className="mt-0.5 text-[13px] text-secondary break-all">
                    {lead.contact}
                  </p>
                </div>
                <p className="shrink-0 text-[11.5px] text-secondary font-mono-utility tabular-nums">
                  {formatRelative(lead.createdAt)}
                </p>
              </div>
              {summary && (
                <div className="mt-3 rounded-input bg-elevated/60 p-3">
                  <p
                    className={`whitespace-pre-wrap text-[13px] leading-relaxed text-primary/90 ${
                      isOpen ? "" : "line-clamp-4"
                    }`}
                  >
                    {summary}
                  </p>
                  {summary.length > 180 && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(lead._id)}
                      className="mt-2 text-[12px] font-medium text-accent hover:text-accent-hover transition-colors"
                    >
                      {isOpen ? "Show less" : "Show full"}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
