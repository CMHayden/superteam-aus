"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Submission = {
  location: string;
  role: string;
  experience: string;
  looking_for: string[];
  skills: string[];
  created_at: string;
};

type Member = {
  location: string;
  role: string;
  skills: string[];
};

type DataSource = "applicants" | "community" | "combined";

function countBy(items: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (!item) continue;
    counts[item] = (counts[item] ?? 0) + 1;
  }
  return counts;
}

function sortedEntries(counts: Record<string, number>): [string, number][] {
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-40 shrink-0 truncate text-right font-body text-xs font-bold text-text-secondary">
        {label}
      </span>
      <div className="relative h-6 min-w-0 flex-1 overflow-hidden rounded bg-surface-base">
        <div
          className="absolute inset-y-0 left-0 rounded transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-8 shrink-0 font-mono text-xs font-bold text-text-primary">{value}</span>
    </div>
  );
}

function BarChart({
  title,
  data,
  color,
}: {
  title: string;
  data: [string, number][];
  color: string;
}) {
  const max = data.length > 0 ? data[0][1] : 0;
  return (
    <div className="rounded-xl border border-brand-green/25 bg-surface-card p-5">
      <h3 className="mb-4 font-display text-lg font-black text-brand-green">{title}</h3>
      {data.length === 0 ? (
        <p className="font-body text-sm text-text-muted">No data yet.</p>
      ) : (
        <div className="space-y-2">
          {data.map(([label, value]) => (
            <Bar key={label} label={label} value={value} max={max} color={color} />
          ))}
        </div>
      )}
    </div>
  );
}

function DonutChart({
  title,
  data,
  colors,
}: {
  title: string;
  data: [string, number][];
  colors: string[];
}) {
  const total = data.reduce((sum, [, v]) => sum + v, 0);
  if (total === 0) {
    return (
      <div className="rounded-xl border border-brand-green/25 bg-surface-card p-5">
        <h3 className="mb-4 font-display text-lg font-black text-brand-green">{title}</h3>
        <p className="font-body text-sm text-text-muted">No data yet.</p>
      </div>
    );
  }

  let cumulative = 0;
  const segments = data.map(([label, value], i) => {
    const start = (cumulative / total) * 360;
    cumulative += value;
    const end = (cumulative / total) * 360;
    const color = colors[i % colors.length];
    return { label, value, start, end, color, pct: ((value / total) * 100).toFixed(1) };
  });

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const r = 70;
  const cx = 90;
  const cy = 90;

  return (
    <div className="rounded-xl border border-brand-green/25 bg-surface-card p-5">
      <h3 className="mb-4 font-display text-lg font-black text-brand-green">{title}</h3>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <svg viewBox="0 0 180 180" className="h-40 w-40 shrink-0">
          {segments.map((seg) => {
            const largeArc = seg.end - seg.start > 180 ? 1 : 0;
            const x1 = cx + r * Math.cos(toRad(seg.start - 90));
            const y1 = cy + r * Math.sin(toRad(seg.start - 90));
            const x2 = cx + r * Math.cos(toRad(seg.end - 90));
            const y2 = cy + r * Math.sin(toRad(seg.end - 90));
            return (
              <path
                key={seg.label}
                d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`}
                fill={seg.color}
                stroke="var(--color-surface-card)"
                strokeWidth="2"
              />
            );
          })}
          <circle cx={cx} cy={cy} r={35} fill="var(--color-surface-card)" />
          <text x={cx} y={cy + 5} textAnchor="middle" className="fill-text-primary font-mono text-lg font-black">
            {total}
          </text>
        </svg>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="font-body text-xs text-text-secondary">
                {seg.label} <span className="font-bold text-text-primary">{seg.value}</span>{" "}
                <span className="text-text-muted">({seg.pct}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const GREENS = ["#1b8a3d", "#22c55e", "#4ade80", "#86efac", "#bbf7d0", "#16a34a"];
const YELLOWS = ["#f9d71c", "#eab308", "#facc15", "#fde047", "#fef08a", "#ca8a04"];
const MIXED = ["#1b8a3d", "#f9d71c", "#22c55e", "#eab308", "#4ade80", "#facc15", "#86efac", "#fde047"];

export default function InsightsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<DataSource>("combined");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/insights");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setSubmissions(data.submissions ?? []);
      setMembers(data.members ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const locationData = useMemo(() => {
    const items: string[] = [];
    if (source === "applicants" || source === "combined") {
      items.push(...submissions.map((s) => s.location));
    }
    if (source === "community" || source === "combined") {
      items.push(...members.map((m) => m.location));
    }
    return sortedEntries(countBy(items));
  }, [submissions, members, source]);

  const roleData = useMemo(() => {
    const items: string[] = [];
    if (source === "applicants" || source === "combined") {
      items.push(...submissions.map((s) => s.role));
    }
    if (source === "community" || source === "combined") {
      items.push(...members.map((m) => m.role));
    }
    return sortedEntries(countBy(items));
  }, [submissions, members, source]);

  const experienceData = useMemo(() => {
    if (source === "community") return [];
    return sortedEntries(countBy(submissions.map((s) => s.experience)));
  }, [submissions, source]);

  const lookingForData = useMemo(() => {
    if (source === "community") return [];
    return sortedEntries(countBy(submissions.flatMap((s) => s.looking_for ?? [])));
  }, [submissions, source]);

  const skillsData = useMemo(() => {
    const items: string[] = [];
    if (source === "applicants" || source === "combined") {
      items.push(...submissions.flatMap((s) => s.skills ?? []));
    }
    if (source === "community" || source === "combined") {
      items.push(...members.flatMap((m) => m.skills ?? []));
    }
    return sortedEntries(countBy(items));
  }, [submissions, members, source]);

  const submissionsOverTime = useMemo(() => {
    if (source === "community") return [];
    const byMonth: Record<string, number> = {};
    for (const s of submissions) {
      const d = new Date(s.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      byMonth[key] = (byMonth[key] ?? 0) + 1;
    }
    return Object.entries(byMonth).sort((a, b) => a[0].localeCompare(b[0]));
  }, [submissions, source]);

  const barColor = source === "community" ? "#22c55e" : source === "applicants" ? "#f9d71c" : "#1b8a3d";
  const donutColors = source === "community" ? GREENS : source === "applicants" ? YELLOWS : MIXED;

  const tabs: { key: DataSource; label: string }[] = [
    { key: "combined", label: "Combined" },
    { key: "applicants", label: "Applicants" },
    { key: "community", label: "Community" },
  ];

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-black text-text-primary">Insights</h1>
          <p className="mt-1 font-body text-sm text-text-muted">
            Visualise your community and applicant data.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-brand-green/25 bg-surface-base p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSource(tab.key)}
              className={`rounded-md px-3 py-1.5 font-body text-xs font-bold transition-colors ${
                source === tab.key
                  ? "bg-brand-green text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="mt-8 font-body text-sm text-text-muted">Loading data...</p>}

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-brand-green/25 bg-surface-card p-5">
              <p className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">Community Members</p>
              <p className="mt-1 font-mono text-3xl font-black text-brand-green">{members.length}</p>
            </div>
            <div className="rounded-xl border border-brand-green/25 bg-surface-card p-5">
              <p className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">Applications</p>
              <p className="mt-1 font-mono text-3xl font-black text-brand-yellow">{submissions.length}</p>
            </div>
            <div className="rounded-xl border border-brand-green/25 bg-surface-card p-5">
              <p className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">Total People</p>
              <p className="mt-1 font-mono text-3xl font-black text-text-primary">{members.length + submissions.length}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <DonutChart title="Roles" data={roleData} colors={donutColors} />
            <DonutChart title="Locations" data={locationData} colors={donutColors} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <BarChart title="Skills" data={skillsData} color={barColor} />
            {source !== "community" ? (
              <BarChart title="Looking For" data={lookingForData} color={barColor} />
            ) : (
              <BarChart title="Locations (bar)" data={locationData} color={barColor} />
            )}
          </div>

          {source !== "community" && experienceData.length > 0 && (
            <div className="mt-6">
              <DonutChart title="Experience Level" data={experienceData} colors={donutColors} />
            </div>
          )}

          {submissionsOverTime.length > 1 && (
            <div className="mt-6 rounded-xl border border-brand-green/25 bg-surface-card p-5">
              <h3 className="mb-4 font-display text-lg font-black text-brand-green">Applications Over Time</h3>
              <div className="flex items-end gap-1" style={{ height: 120 }}>
                {(() => {
                  const max = Math.max(...submissionsOverTime.map(([, v]) => v));
                  return submissionsOverTime.map(([month, count]) => (
                    <div key={month} className="flex flex-1 flex-col items-center gap-1">
                      <span className="font-mono text-[10px] font-bold text-text-primary">{count}</span>
                      <div
                        className="w-full min-w-[12px] rounded-t transition-all duration-500"
                        style={{
                          height: `${(count / max) * 80}px`,
                          backgroundColor: barColor,
                        }}
                      />
                      <span className="font-mono text-[9px] text-text-muted">{month.slice(5)}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
