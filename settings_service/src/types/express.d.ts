import { Request } from 'express';

declare module 'express' {
  interface Request {
    shopId?: string; // shopId is a string, matching VARCHAR(255) in the database
    user?: any; // Use 'any' for user, as its structure is unknown
    userId?: string; // userId is a string, assuming it's an identifier
  }
}