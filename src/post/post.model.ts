import { PostStatus } from './post.service';

export class PostModel {
  id?: number;
  title?: string;
  content?: string;
  userId?: number;
  status?: PostStatus;
}
