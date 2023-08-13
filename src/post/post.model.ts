import { PostStatus } from './post.service';

export class PostModel {
  id?: number;
  title?: string;
  content?: string;
  user_id?: number;
  status?: PostStatus;
}
