import { asyncHandler } from "../middleware/asyncHandler.js";
import { createCommentSchema, createPostSchema } from "../schemas/community.schema.js";
import {
  addCommunityComment,
  createCommunityPost,
  listCommunityPosts,
  toggleCommunityLike,
} from "../services/community.service.js";
import { AppError } from "../utils/errors.js";

export const list = asyncHandler(async (req, res) => {
  const posts = listCommunityPosts(req.user?.id);
  res.json({ posts });
});

export const create = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  const payload = createPostSchema.parse(req.body);
  const post = await createCommunityPost({ ...payload, userId: req.user.id });
  res.status(201).json({ post });
});

export const like = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  const { postId } = req.params;
  if (!postId) {
    throw new AppError("Post id missing", 400);
  }
  const post = await toggleCommunityLike({ userId: req.user.id, postId });
  res.json({ post });
});

export const comment = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  const { postId } = req.params;
  if (!postId) {
    throw new AppError("Post id missing", 400);
  }
  const payload = createCommentSchema.parse(req.body);
  const post = await addCommunityComment({ userId: req.user.id, postId, message: payload.message });
  res.status(201).json({ post });
});