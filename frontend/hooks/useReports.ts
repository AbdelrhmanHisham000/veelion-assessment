"use client";

import { useCallback, useEffect, useState } from "react";
import type { ErrorResponse, TasksSummary } from "@/types/api";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export function useReports() {
  const [summary, setSummary] = useState<TasksSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/reports/tasks-summary");
      if (!response.ok) {
        let msg = `Request failed with status ${response.status}`;
        try {
          const body = (await response.json()) as ErrorResponse;
          if (body?.error?.message) {
            msg = body.error.message;
          }
        } catch {
          // ignore parse error
        }
        throw new Error(msg);
      }

      const data = (await response.json()) as TasksSummary;
      setSummary(data);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load reports summary right now."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    fetchSummary,
  };
}
