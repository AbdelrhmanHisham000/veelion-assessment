"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ActivityLog } from "@/types/api";

function formatDateTime(value: string): string {
  try {
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toLocaleString();
  } catch {
    return value;
  }
}

function filterActivity(items: ActivityLog[], query: string): ActivityLog[] {
  if (!query.trim()) {
    return items;
  }

  const lower = query.trim().toLowerCase();
  return items.filter(
    (item) =>
      (item.action || "").toLowerCase().includes(lower) ||
      (item.info || "").toLowerCase().includes(lower)
  );
}

function getActionColor(action?: string): { bg: string; color: string; border: string } {
  const act = (action || "").toLowerCase();
  if (act.includes("add") || act.includes("create") || act.includes("done")) {
    return { bg: "var(--success-soft)", color: "var(--success-text)", border: "var(--success-border)" };
  }
  if (act.includes("refactor") || act.includes("update") || act.includes("edit")) {
    return { bg: "var(--primary-soft)", color: "var(--primary)", border: "var(--primary-border)" };
  }
  if (act.includes("delete") || act.includes("remove") || act.includes("error")) {
    return { bg: "var(--danger-soft)", color: "var(--danger-text)", border: "var(--danger-border)" };
  }
  return { bg: "var(--surface-muted)", color: "var(--text-muted)", border: "var(--border)" };
}

export default function ActivityPage() {
  const [allActivity, setAllActivity] = useState<ActivityLog[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/activity");
      if (!response.ok) {
        let msg = `Failed to load activity logs (${response.status})`;
        try {
          const body = await response.json();
          if (body?.error?.message) {
            msg = body.error.message;
          }
        } catch {
          // ignore json parse error
        }
        throw new Error(msg);
      }

      const data = await response.json();
      const logs = Array.isArray(data) ? data : data?.data || [];
      setAllActivity(logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load activity logs.");
      setAllActivity([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  const filteredActivity = useMemo(() => {
    return filterActivity(allActivity, query);
  }, [allActivity, query]);

  return (
    <div className="stack" style={{ gap: "1.5rem" }}>
      {/* Search & Control Header */}
      <section className="card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
            <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>Activity Stream</h2>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <span className="badge">
                Total: {allActivity.length}
              </span>
              <span className="badge" style={{ background: "var(--primary-soft)", color: "var(--primary)", borderColor: "var(--primary-border)" }}>
                Visible: {filteredActivity.length}
              </span>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-subtle)",
                display: "flex",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              className="input"
              style={{ paddingLeft: "2.6rem" }}
              placeholder="Search by action or details..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  padding: "4px",
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Loading Skeletons */}
      {loading ? (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                opacity: 0.6,
                animation: "pulse 1.5s infinite ease-in-out",
              }}
            >
              <div style={{ width: "30%", height: 16, background: "var(--border)", borderRadius: 4 }} />
              <div style={{ width: "60%", height: 14, background: "var(--surface-muted)", borderRadius: 4 }} />
            </div>
          ))}
        </div>
      ) : null}

      {/* Error Alert */}
      {error ? (
        <section
          className="card"
          style={{
            padding: "2rem",
            textAlign: "center",
            borderColor: "var(--danger-border)",
            background: "var(--danger-soft)",
          }}
          role="alert"
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚠️</div>
          <h3 style={{ margin: "0 0 0.5rem", color: "var(--danger-text)" }}>Failed to load activities</h3>
          <p style={{ margin: "0 0 1rem", color: "var(--text-muted)", fontSize: "0.92rem" }}>{error}</p>
          <button type="button" className="button primary" onClick={loadActivity}>
            Retry Loading
          </button>
        </section>
      ) : null}

      {/* Activity List */}
      {!loading && !error ? (
        <section>
          {filteredActivity.length === 0 ? (
            <div
              className="card"
              style={{
                padding: "3rem 1.5rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "var(--surface-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>No activities found</h3>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>
                {query ? "Try adjusting your search query." : "No activity logs have been recorded yet."}
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              {filteredActivity.map((item) => {
                const tag = getActionColor(item.action);
                return (
                  <div
                    key={item.id}
                    className="card"
                    style={{
                      padding: "1.1rem 1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span
                          className="badge"
                          style={{
                            background: tag.bg,
                            color: tag.color,
                            borderColor: tag.border,
                            fontSize: "0.78rem",
                            textTransform: "capitalize",
                          }}
                        >
                          {item.action || "Action"}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: "0.98rem", color: "var(--text-main)" }}>
                          {item.info || "(No details provided)"}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-subtle)" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <time dateTime={item.when}>{formatDateTime(item.when)}</time>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
