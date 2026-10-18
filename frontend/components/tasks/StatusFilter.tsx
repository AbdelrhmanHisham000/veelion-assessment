import type { TaskFilter } from "@/types/api";

type Counts = {
  all?: number;
  completed?: number;
  pending?: number;
};

type StatusFilterProps = {
  value: TaskFilter;
  onChange: (value: TaskFilter) => void;
  counts?: Counts;
};

export function StatusFilter({ value, onChange, counts }: StatusFilterProps) {
  const filters: Array<{ label: string; value: TaskFilter; count?: number }> = [
    { label: "All Tasks", value: "all", count: counts?.all },
    { label: "Pending", value: "pending", count: counts?.pending },
    { label: "Completed", value: "completed", count: counts?.completed },
  ];

  return (
    <section aria-label="Filter tasks by status" className="card" style={{ padding: "0.6rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {filters.map((filter) => {
          const active = filter.value === value;

          return (
            <button
              key={filter.value}
              type="button"
              className={active ? "button primary" : "button"}
              onClick={() => onChange(filter.value)}
              aria-pressed={active}
              style={{
                borderRadius: "10px",
                padding: "0.5rem 0.9rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>{filter.label}</span>
              {typeof filter.count === "number" ? (
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.1rem 0.5rem",
                    borderRadius: "999px",
                    background: active ? "rgba(255, 255, 255, 0.25)" : "var(--border)",
                    color: active ? "#ffffff" : "var(--text-muted)",
                    fontWeight: 700,
                  }}
                >
                  {filter.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

