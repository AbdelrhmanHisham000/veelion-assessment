import type { Task } from "@/types/api";
import { TaskItem } from "@/components/tasks/TaskItem";

type TaskListProps = {
  tasks: Task[];
  updatingTaskId?: string;
  updatingTaskIds?: Set<string>;
  isTaskUpdating?: (taskId: string) => boolean;
  onToggle: (task: Task) => void;
};

export function TaskList({
  tasks,
  updatingTaskId,
  updatingTaskIds,
  isTaskUpdating,
  onToggle,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <section
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
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>
        <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>No tasks found</h3>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>
          No tasks match the selected filter criteria.
        </p>
      </section>
    );
  }


  const checkBusy = (task: Task) => {
    if (isTaskUpdating) {
      return isTaskUpdating(task.id);
    }
    if (updatingTaskIds) {
      return updatingTaskIds.has(task.id);
    }
    return updatingTaskId === task.id;
  };

  return (
    <section aria-label="Task list">
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.7rem" }}>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} busy={checkBusy(task)} onToggle={onToggle} />
        ))}
      </ul>
    </section>
  );
}

