// This is a placeholder for custom TypeScript type definitions.

// Example of a custom type that might be shared across the application
export type UserId = string | number;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    details?: string;
  };
}

// You can also re-export types from other files if needed
// export * from './user.types';
// export * from './product.types';
