"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ErrorResponse, Task, TaskFilter, TaskResponse, TasksResponse } from "@/types/api";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed with ${response.status}`;
    try {
      const body = (await response.json()) as ErrorResponse;
      if (body?.error?.message) {
        message = body.error.message;
      }
    } catch {
      // Ignored: response was not JSON
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [updateError, setUpdateError] = useState<string>("");
  const [updatingTaskIds, setUpdatingTaskIds] = useState<Set<string>>(new Set());

  const isTaskUpdating = useCallback(
    (taskId: string) => updatingTaskIds.has(taskId),
    [updatingTaskIds]
  );

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const body = await requestJson<TasksResponse>("/api/tasks", {
        method: "GET",
      });

      setTasks(body.data || []);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load tasks right now."));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTaskStatus = useCallback(async (taskId: string, completed: boolean) => {
    try {
      setUpdatingTaskIds((prev) => new Set(prev).add(taskId));
      setUpdateError("");

      const body = await requestJson<TaskResponse>(`/api/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ completed }),
      });

      setTasks((previous) =>
        previous.map((task) => (task.id === taskId ? body.data : task))
      );
    } catch (err) {
      setUpdateError(getErrorMessage(err, "Could not update task status."));
    } finally {
      setUpdatingTaskIds((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    if (filter === "completed") {
      return tasks.filter((task) => task.completed);
    }

    if (filter === "pending") {
      return tasks.filter((task) => !task.completed);
    }

    return tasks;
  }, [tasks, filter]);

  const updatingTaskId = updatingTaskIds.values().next().value || "";

  return {
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
    clearUpdateError: () => setUpdateError(""),
  };
}

