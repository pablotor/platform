import { Injectable } from '@nestjs/common';
import type {
  CreatePost,
  PatchPost,
  PostQuery,
  PostResponse,
} from '@repo/contracts';

/**
 * Stub — method signatures only, matching the repository/service interface
 * from BLOG_FEATURE_PLAN.md. Real business logic (ownership checks, slug
 * generation/collision handling) lands in steps 7/8 of EXTENDING.md. This
 * exists now so PostsController has something real to inject and the test
 * suite has a class to mock against.
 */
@Injectable()
export class PostsService {
  create(_data: CreatePost, _authorId: string): Promise<PostResponse> {
    throw new Error('Not implemented — see EXTENDING.md steps 7/8');
  }

  patch(
    _slug: string,
    _data: PatchPost,
    _requesterId: string,
  ): Promise<PostResponse> {
    throw new Error('Not implemented — see EXTENDING.md steps 7/8');
  }

  delete(_slug: string, _requesterId: string): Promise<void> {
    throw new Error('Not implemented — see EXTENDING.md steps 7/8');
  }

  findMany(_query: PostQuery): Promise<PostResponse[]> {
    throw new Error('Not implemented — see EXTENDING.md steps 7/8');
  }

  findBySlug(_slug: string): Promise<PostResponse> {
    throw new Error('Not implemented — see EXTENDING.md steps 7/8');
  }
}
