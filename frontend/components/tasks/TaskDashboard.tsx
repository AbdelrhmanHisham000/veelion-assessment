"use client";

import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/types/api";
import { StatusFilter } from "@/components/tasks/StatusFilter";
import { TaskList } from "@/components/tasks/TaskList";

export function TaskDashboard() {
  const {
    tasks,
    filteredTasks,
    filter,
    loading,
    error,
    updateError,
    updatingTaskId,
    updatingTaskIds,
    isTaskUpdating,
    setFilter,
    fetchTasks,
    updateTaskStatus,
    clearUpdateError,
  } = useTasks();

  const handleToggle = (task: Task) => {
    updateTaskStatus(task.id, !task.completed);
  };

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="stack" style={{ gap: "1.5rem" }}>
      {/* Top KPI Cards */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "1rem",
        }}
      >
        <div className="card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: "var(--primary-soft)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="8" height="4" x="8" y="2" rx="1" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Total Tasks</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-main)" }}>{totalCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: "var(--warning-soft)",
              color: "var(--warning-text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Pending</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--warning-text)" }}>{pendingCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: "var(--success-soft)",
              color: "var(--success-text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Completed</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--success-text)" }}>{completedCount}</div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <StatusFilter
        value={filter}
        onChange={setFilter}
        counts={{ all: totalCount, completed: completedCount, pending: pendingCount }}
      />

      {/* Update Error Banner */}
      {updateError ? (
        <section
          className="card"
          style={{
            padding: "0.85rem 1.25rem",
            borderColor: "var(--danger-border)",
            background: "var(--danger-soft)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "var(--radius)",
          }}
          role="alert"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ color: "var(--danger)", fontWeight: 700 }}>⚠️</span>
            <p style={{ margin: 0, color: "var(--danger-text)", fontSize: "0.9rem", fontWeight: 500 }}>
              {updateError}
            </p>
          </div>
          <button
            type="button"
            className="button"
            style={{ fontSize: "0.78rem", padding: "0.25rem 0.6rem", borderRadius: "6px" }}
            onClick={clearUpdateError}
          >
            Dismiss
          </button>
        </section>
      ) : null}

      {/* Loading State Skeletons */}
      {loading ? (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                opacity: 0.6,
                animation: "pulse 1.5s infinite ease-in-out",
              }}
            >
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--border)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: "40%", height: 16, background: "var(--border)", borderRadius: 4, marginBottom: 8 }} />
                <div style={{ width: "25%", height: 12, background: "var(--surface-muted)", borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Error State */}
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
          <h3 style={{ margin: "0 0 0.5rem", color: "var(--danger-text)" }}>Failed to load tasks</h3>
          <p style={{ margin: "0 0 1rem", color: "var(--text-muted)", fontSize: "0.92rem" }}>{error}</p>
          <button type="button" className="button primary" onClick={fetchTasks}>
            Retry Loading
          </button>
        </section>
      ) : null}

      {/* Task List */}
      {!loading && !error ? (
        <TaskList
          tasks={filteredTasks}
          updatingTaskId={updatingTaskId}
          updatingTaskIds={updatingTaskIds}
          isTaskUpdating={isTaskUpdating}
          onToggle={handleToggle}
        />
      ) : null}
    </div>
  );
}


