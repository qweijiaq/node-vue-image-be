import { TokenPayload } from '../src/auth/auth.interface';
import { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      user: TokenPayload;
      fileMetadata: { width?: number; height?: number; metadata?: {} };
    }
  }
}
