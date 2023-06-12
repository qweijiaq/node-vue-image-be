import { TokenPayload } from '../src/auth/auth.interface';
import { Request } from 'express';
import { GetPostsOptionsFilter } from '../src/post/post.service';

declare global {
  namespace Express {
    export interface Request {
      user: TokenPayload;
      fileMetadata: { width?: number; height?: number; metadata?: {} };
      sort: string;
      filter: GetPostsOptionsFilter;
    }
  }
}
