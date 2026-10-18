import type { Task } from "@/types/api";

type TaskItemProps = {
  task: Task;
  busy: boolean;
  onToggle: (task: Task) => void;
};

export function TaskItem({ task, busy, onToggle }: TaskItemProps) {
  const isDone = task.completed;

  return (
    <li
      className="card"
      style={{
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        transition: "all 0.2s ease",
        borderColor: isDone ? "var(--border-subtle)" : "var(--border)",
        background: isDone ? "#fafbfd" : "var(--surface)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 0 }}>
        {/* Checkmark Toggle Button */}
        <button
          type="button"
          onClick={() => onToggle(task)}
          disabled={busy}
          aria-label={`Mark ${task.title} as ${isDone ? "pending" : "completed"}`}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: isDone ? "2px solid var(--success)" : "2px solid var(--border)",
            background: isDone ? "var(--success)" : "transparent",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: busy ? "not-allowed" : "pointer",
            flexShrink: 0,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            padding: 0,
          }}
        >
          {busy ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDone ? "#ffffff" : "var(--primary)"}
              strokeWidth="3"
              style={{ animation: "spin 0.8s linear infinite" }}
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          ) : isDone ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : null}
        </button>

        {/* Task Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontWeight: 600,
              fontSize: "0.98rem",
              color: isDone ? "var(--text-muted)" : "var(--text-main)",
              textDecoration: isDone ? "line-through" : "none",
              wordBreak: "break-word",
              transition: "all 0.2s ease",
            }}
          >
            {task.title}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-subtle)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Updated: {new Date(task.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Status Badge & Action */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
        <span className={`badge ${isDone ? "completed" : "pending"}`}>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: isDone ? "var(--success)" : "var(--warning)",
            }}
          />
          {isDone ? "Completed" : "Pending"}
        </span>

        <button
          type="button"
          className="button"
          onClick={() => onToggle(task)}
          disabled={busy}
          style={{
            fontSize: "0.8rem",
            padding: "0.35rem 0.75rem",
            borderRadius: "8px",
          }}
        >
          {busy ? "Saving..." : isDone ? "Reopen" : "Complete"}
        </button>
      </div>
    </li>
  );
}

