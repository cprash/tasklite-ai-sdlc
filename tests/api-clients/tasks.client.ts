import type { APIRequestContext, APIResponse } from "@playwright/test";

export type TaskStatus = "OPEN" | "COMPLETED";

export interface CreateTaskPayload {
  title: string;
}

export interface UpdateStatusPayload {
  status: TaskStatus | string;
}

/** Thin wrapper around the /api/tasks endpoints used by both API and UI test setup. */
export class TasksApiClient {
  constructor(private readonly request: APIRequestContext) {}

  list(): Promise<APIResponse> {
    return this.request.get("tasks");
  }

  create(payload: CreateTaskPayload): Promise<APIResponse> {
    return this.request.post("tasks", { data: payload });
  }

  updateStatus(id: number, payload: UpdateStatusPayload): Promise<APIResponse> {
    return this.request.patch(`tasks/${id}/status`, { data: payload });
  }

  remove(id: number): Promise<APIResponse> {
    return this.request.delete(`tasks/${id}`);
  }
}
