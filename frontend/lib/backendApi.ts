import { BACKEND_BASE_URL } from "@/lib/constants";
import type {
  ActivityLog,
  ErrorResponse,
  Task,
  TaskResponse,
  TasksResponse,
  TasksSummary,
} from "@/types/api";

function buildBackendUrl(path: string): string {
  return `${BACKEND_BASE_URL}${path}`;
}

async function parseError(response: Response): Promise<string> {
  const fallback = `Request failed with status ${response.status}`;
  try {
    const body = (await response.json()) as ErrorResponse;
    return body.error?.message || fallback;
  } catch {
    return fallback;
  }
}

function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

function validateTask(item: unknown): Task {
  if (!isObject(item)) {
    throw new Error("Invalid task: expected an object.");
  }
  if (typeof item.id !== "string" || typeof item.title !== "string" || typeof item.completed !== "boolean") {
    throw new Error("Invalid task: missing or invalid required fields (id, title, completed).");
  }

  return {
    id: item.id,
    title: item.title,
    completed: item.completed,
    createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : new Date().toISOString(),
  };
}

function validateTasks(items: unknown): Task[] {
  if (!Array.isArray(items)) {
    throw new Error("Expected an array of tasks.");
  }
  return items.map(validateTask);
}

function validateActivityLog(item: unknown): ActivityLog {
  if (!isObject(item)) {
    throw new Error("Invalid activity log: expected an object.");
  }
  if (typeof item.id !== "string" || typeof item.when !== "string") {
    throw new Error("Invalid activity log: missing id or timestamp.");
  }

  return {
    id: item.id,
    action: typeof item.action === "string" ? item.action : undefined,
    info: typeof item.info === "string" ? item.info : undefined,
    when: item.when,
  };
}

function validateActivityLogs(items: unknown): ActivityLog[] {
  if (!Array.isArray(items)) {
    throw new Error("Expected an array of activity logs.");
  }
  return items.map(validateActivityLog);
}

function validateTasksSummary(data: unknown): TasksSummary {
  if (!isObject(data)) {
    throw new Error("Invalid reports summary: expected an object.");
  }

  if (typeof data.total !== "number" || typeof data.recentActivityCount !== "number") {
    throw new Error("Invalid reports summary: total or recentActivityCount is not a number.");
  }

  if (!isObject(data.byStatus)) {
    throw new Error("Invalid reports summary: byStatus must be an object.");
  }

  const byStatus = data.byStatus as Record<string, unknown>;

  return {
    total: data.total,
    byStatus: {
      todo: typeof byStatus.todo === "number" ? byStatus.todo : 0,
      "in-progress": typeof byStatus["in-progress"] === "number" ? byStatus["in-progress"] : 0,
      done: typeof byStatus.done === "number" ? byStatus.done : 0,
    },
    recentActivityCount: data.recentActivityCount,
  };
}

export async function getTasksFromBackend(): Promise<Task[]> {
  try {
    const response = await fetch(buildBackendUrl("/tasks"), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    const body = (await response.json()) as TasksResponse;
    const rawList = Array.isArray(body?.data) ? body.data : body;
    return validateTasks(rawList);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to load tasks.");
  }
}

export async function updateTaskInBackend(taskId: string, completed: boolean): Promise<Task> {
  try {
    const response = await fetch(buildBackendUrl(`/tasks/${taskId}`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    const body = (await response.json()) as TaskResponse;
    const rawTask = body?.data ? body.data : body;
    return validateTask(rawTask);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update task.");
  }
}

export async function getActivityFromBackend(): Promise<ActivityLog[]> {
  try {
    const response = await fetch(buildBackendUrl("/activity"), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    const json = await response.json();
    const rawLogs = isObject(json) && Array.isArray(json.data) ? json.data : json;
    return validateActivityLogs(rawLogs);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to load activity logs.");
  }
}

export async function getTasksSummaryFromBackend(): Promise<TasksSummary> {
  try {
    const response = await fetch(buildBackendUrl("/reports/tasks-summary"), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    const json = await response.json();
    return validateTasksSummary(json);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to load reports summary.");
  }
}

