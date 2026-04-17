"use client";

import { useCallback, useEffect, useState } from "react";

type Stat = {
  id: string;
  label: string;
  value: number;
  suffix: string;
  duration_ms: number;
  display_order: number;
  hidden_on_mobile: boolean;
};

type StatRow = Stat & { isNew?: boolean };

const emptyStat = (): Omit<StatRow, "id"> => ({
  label: "",
  value: 0,
  suffix: "",
  duration_ms: 1600,
  display_order: 0,
  hidden_on_mobile: false,
  isNew: true,
});

function CellInput({
  value,
  onSave,
  type = "text",
  className = "",
}: {
  value: string;
  onSave: (next: string) => void;
  type?: string;
  className?: string;
}) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <input
      type={type}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => {
        if (local !== value) onSave(local);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
      autoFocus
      className={`w-full rounded-lg border border-brand-green/25 bg-surface-base px-2 py-1.5 font-body text-sm text-text-primary outline-none ring-brand-green/40 focus:ring-2 ${className}`}
    />
  );
}

export default function AdminStatsPage() {
  const [rows, setRows] = useState<StatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeCell, setActiveCell] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to load stats");
        setRows([]);
        return;
      }
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load stats");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const persistRow = async (row: StatRow, patch: Partial<Stat>) => {
    setSaveError(null);
    const next = { ...row, ...patch };
    if (row.isNew) {
      const body = {
        label: next.label,
        value: next.value,
        suffix: next.suffix,
        duration_ms: next.duration_ms,
        display_order: next.display_order,
        hidden_on_mobile: next.hidden_on_mobile,
      };
      if (!body.label.trim()) {
        setSaveError("Enter a label before saving.");
        return;
      }
      const res = await fetch("/api/admin/stats", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(typeof data.error === "string" ? data.error : "Could not create stat");
        return;
      }
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...data, isNew: false } : r)),
      );
      return;
    }
    const res = await fetch("/api/admin/stats", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: row.id, ...patch }),
    });
    const data = await res.json();
    if (!res.ok) {
      setSaveError(typeof data.error === "string" ? data.error : "Could not update stat");
      await load();
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...data, isNew: false } : r)));
  };

  const deleteRow = async (row: StatRow) => {
    setSaveError(null);
    if (row.isNew) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      return;
    }
    const res = await fetch("/api/admin/stats", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: row.id }),
    });
    const data = await res.json();
    if (!res.ok) {
      setSaveError(typeof data.error === "string" ? data.error : "Could not delete stat");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
  };

  const addRow = () => {
    setSaveError(null);
    const id = `new-${crypto.randomUUID()}`;
    setRows((prev) => [
      ...prev,
      {
        id,
        ...emptyStat(),
      },
    ]);
  };

  const cellKey = (id: string, field: string) => `${id}:${field}`;

  const renderTextCell = (
    row: StatRow,
    field: "label" | "suffix",
    display: string,
  ) => {
    const key = cellKey(row.id, field);
    if (activeCell === key) {
      return (
        <CellInput
          value={display}
          onSave={(next) => {
            setActiveCell(null);
            if (next !== row[field]) void persistRow(row, { [field]: next } as Partial<Stat>);
          }}
        />
      );
    }
    return (
      <button
        type="button"
        onClick={() => setActiveCell(key)}
        className="w-full rounded-lg border border-transparent px-2 py-1.5 text-left font-body text-sm text-text-primary hover:border-brand-green/25 hover:bg-surface-base"
      >
        {display || "—"}
      </button>
    );
  };

  const renderNumberCell = (
    row: StatRow,
    field: "value" | "duration_ms" | "display_order",
    display: number,
  ) => {
    const key = cellKey(row.id, field);
    if (activeCell === key) {
      return (
        <CellInput
          type="number"
          value={String(display)}
          onSave={(next) => {
            setActiveCell(null);
            const n = Number(next);
            if (Number.isNaN(n)) return;
            if (n !== row[field]) void persistRow(row, { [field]: n } as Partial<Stat>);
          }}
        />
      );
    }
    return (
      <button
        type="button"
        onClick={() => setActiveCell(key)}
        className="w-full rounded-lg border border-transparent px-2 py-1.5 text-left font-body text-sm tabular-nums text-text-primary hover:border-brand-green/25 hover:bg-surface-base"
      >
        {display}
      </button>
    );
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-black text-text-primary">Manage Stats</h1>
      <p className="mt-1 font-body text-sm text-text-muted">
        Edit homepage stat counters: labels, values, animation timing, and visibility on small screens.
      </p>

      {saveError && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-red-400"
        >
          {saveError}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={addRow}
          className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base transition-opacity hover:opacity-90"
        >
          Add stat
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-brand-green/25 bg-surface-card">
        {loading ? (
          <div className="p-8 text-center font-body text-sm text-text-muted">Loading stats…</div>
        ) : error ? (
          <div
            role="alert"
            className="p-8 text-center font-body text-sm text-red-400"
          >
            {error}
          </div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center font-body text-sm text-text-secondary">
            No stats yet. Add one to get started.
          </div>
        ) : (
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-brand-green/25">
                <th className="px-3 py-3 font-display text-xs font-black uppercase tracking-wide text-text-muted">
                  Label
                </th>
                <th className="px-3 py-3 font-display text-xs font-black uppercase tracking-wide text-text-muted">
                  Value
                </th>
                <th className="px-3 py-3 font-display text-xs font-black uppercase tracking-wide text-text-muted">
                  Suffix
                </th>
                <th className="px-3 py-3 font-display text-xs font-black uppercase tracking-wide text-text-muted">
                  Duration (ms)
                </th>
                <th className="px-3 py-3 font-display text-xs font-black uppercase tracking-wide text-text-muted">
                  Order
                </th>
                <th className="px-3 py-3 font-display text-xs font-black uppercase tracking-wide text-text-muted">
                  Hide on mobile
                </th>
                <th className="px-3 py-3 font-display text-xs font-black uppercase tracking-wide text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-brand-green/15 last:border-0">
                  <td className="align-top px-3 py-2">{renderTextCell(row, "label", row.label)}</td>
                  <td className="align-top px-3 py-2">{renderNumberCell(row, "value", row.value)}</td>
                  <td className="align-top px-3 py-2">{renderTextCell(row, "suffix", row.suffix)}</td>
                  <td className="align-top px-3 py-2">
                    {renderNumberCell(row, "duration_ms", row.duration_ms)}
                  </td>
                  <td className="align-top px-3 py-2">
                    {renderNumberCell(row, "display_order", row.display_order)}
                  </td>
                  <td className="align-top px-3 py-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 px-2 py-1.5 font-body text-sm text-text-secondary">
                      <input
                        type="checkbox"
                        checked={row.hidden_on_mobile}
                        onChange={(e) => {
                          void persistRow(row, { hidden_on_mobile: e.target.checked });
                        }}
                        className="h-4 w-4 rounded border-brand-green/25 bg-surface-base text-brand-green focus:ring-brand-green/40"
                      />
                      <span className="text-text-muted">Hidden</span>
                    </label>
                  </td>
                  <td className="align-top px-3 py-2">
                    <button
                      type="button"
                      onClick={() => void deleteRow(row)}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-body text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
