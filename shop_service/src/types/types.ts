// This is a placeholder for custom TypeScript type definitions (Phase 1)

export type UserId = string | number;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
