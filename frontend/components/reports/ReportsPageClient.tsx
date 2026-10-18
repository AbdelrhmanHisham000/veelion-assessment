"use client";

import { useReports } from "@/hooks/useReports";

export default function ReportsPageClient() {
    const { summary, loading, error, fetchSummary } = useReports();

    const total = summary?.total ?? 0;
    const todo = summary?.byStatus?.todo ?? 0;
    const inProgress = summary?.byStatus?.["in-progress"] ?? 0;
    const done = summary?.byStatus?.done ?? 0;
    const recentActivityCount = summary?.recentActivityCount ?? 0;

    const todoPercent = total > 0 ? Math.round((todo / total) * 100) : 0;
    const inProgressPercent = total > 0 ? Math.round((inProgress / total) * 100) : 0;
    const donePercent = total > 0 ? Math.round((done / total) * 100) : 0;

    return (
        <div className="stack" style={{ gap: "1.5rem" }}>
            {/* Loading Skeletons */}
            {loading ? (
                <div style={{ display: "grid", gap: "1rem" }}>
                    <div
                        className="card"
                        style={{
                            padding: "2rem",
                            textAlign: "center",
                            opacity: 0.6,
                            animation: "pulse 1.5s infinite ease-in-out",
                        }}
                    >
                        <p style={{ margin: 0, color: "var(--text-muted)" }}>Calculating aggregated reports...</p>
                    </div>
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
                    <h3 style={{ margin: "0 0 0.5rem", color: "var(--danger-text)" }}>Unable to generate reports</h3>
                    <p style={{ margin: "0 0 1rem", color: "var(--text-muted)", fontSize: "0.92rem" }}>{error}</p>
                    <button type="button" className="button primary" onClick={fetchSummary}>
                        Retry Analysis
                    </button>
                </section>
            ) : null}

            {/* Main Reports Content */}
            {!loading && !error && summary ? (
                <>
                    {/* Executive Overview Cards */}
                    <section
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "1.25rem",
                        }}
                    >
                        <div className="card" style={{ padding: "1.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
                                    Total Tasks Managed
                                </span>
                                <div
                                    style={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: 10,
                                        background: "var(--primary-soft)",
                                        color: "var(--primary)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect width="8" height="4" x="8" y="2" rx="1" />
                                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                    </svg>
                                </div>
                            </div>
                            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-main)", marginTop: "0.5rem" }}>
                                {total}
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "0.25rem" }}>
                                Active in JSON datastore
                            </div>
                        </div>

                        <div className="card" style={{ padding: "1.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
                                    Completion Rate
                                </span>
                                <div
                                    style={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: 10,
                                        background: "var(--success-soft)",
                                        color: "var(--success)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                </div>
                            </div>
                            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--success-text)", marginTop: "0.5rem" }}>
                                {donePercent}%
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "0.25rem" }}>
                                {done} of {total} tasks marked done
                            </div>
                        </div>

                        <div className="card" style={{ padding: "1.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
                                    Recent Activity Count
                                </span>
                                <div
                                    style={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: 10,
                                        background: "var(--primary-soft)",
                                        color: "var(--primary)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                    </svg>
                                </div>
                            </div>
                            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--primary)", marginTop: "0.5rem" }}>
                                {recentActivityCount}
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "0.25rem" }}>
                                Logged system audit events
                            </div>
                        </div>
                    </section>

                    {/* Breakdown Section */}
                    <section className="card" style={{ padding: "1.75rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
                            <div>
                                <h2 style={{ margin: "0 0 0.25rem", fontSize: "1.25rem", fontWeight: 800 }}>Tasks by Status</h2>
                                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.85rem" }}>
                                    Detailed breakdown of task lifecycle states
                                </p>
                            </div>
                            <span className="badge" style={{ fontSize: "0.82rem" }}>
                                {total} Total Tasks
                            </span>
                        </div>

                        {/* Visual Multi-Segment Bar */}
                        {total > 0 ? (
                            <div style={{ marginBottom: "1.75rem" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        height: "12px",
                                        borderRadius: "999px",
                                        overflow: "hidden",
                                        backgroundColor: "var(--surface-muted)",
                                        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)",
                                    }}
                                    role="progressbar"
                                    aria-label="Task completion progress"
                                >
                                    {donePercent > 0 ? (
                                        <div
                                            style={{
                                                width: `${donePercent}%`,
                                                backgroundColor: "var(--success)",
                                                transition: "width 0.4s ease",
                                            }}
                                            title={`Done: ${donePercent}% (${done} tasks)`}
                                        />
                                    ) : null}
                                    {inProgressPercent > 0 ? (
                                        <div
                                            style={{
                                                width: `${inProgressPercent}%`,
                                                backgroundColor: "var(--primary)",
                                                transition: "width 0.4s ease",
                                            }}
                                            title={`In Progress: ${inProgressPercent}% (${inProgress} tasks)`}
                                        />
                                    ) : null}
                                    {todoPercent > 0 ? (
                                        <div
                                            style={{
                                                width: `${todoPercent}%`,
                                                backgroundColor: "var(--warning)",
                                                transition: "width 0.4s ease",
                                            }}
                                            title={`To Do: ${todoPercent}% (${todo} tasks)`}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        ) : null}

                        {/* Individual Status Metrics */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                gap: "1rem",
                            }}
                        >
                            <div
                                style={{
                                    padding: "1.25rem",
                                    borderRadius: "12px",
                                    background: "var(--surface-muted)",
                                    border: "1px solid var(--border)",
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)" }}>To Do</span>
                                    <span className="badge todo">{todoPercent}%</span>
                                </div>
                                <div style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0", color: "var(--warning-text)" }}>
                                    {todo}
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: "1.25rem",
                                    borderRadius: "12px",
                                    background: "var(--surface-muted)",
                                    border: "1px solid var(--border)",
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)" }}>In Progress</span>
                                    <span className="badge in-progress">{inProgressPercent}%</span>
                                </div>
                                <div style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0", color: "var(--primary)" }}>
                                    {inProgress}
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: "1.25rem",
                                    borderRadius: "12px",
                                    background: "var(--surface-muted)",
                                    border: "1px solid var(--border)",
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)" }}>Done</span>
                                    <span className="badge done">{donePercent}%</span>
                                </div>
                                <div style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0", color: "var(--success-text)" }}>
                                    {done}
                                </div>
                            </div>
                        </div>
                    </section>


                </>
            ) : null}
        </div>
    );
}


