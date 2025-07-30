import { User } from '../models/user.model'; // Adjust path as needed

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      shopId?: string;
      user?: User; // If you have a User type/interface
    }
  }
}