import { nanoid } from "nanoid";
import { getDb } from "../db/database.js";
import { AppError } from "../utils/errors.js";

const mapUser = (user) =>
  user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        role: user.role,
      }
    : null;

const serializePost = (post, users, currentUserId, comments) => {
  const owner = users.find((user) => user.id === post.userId);
  const postComments = comments.filter((comment) => comment.postId === post.id);
  return {
    id: post.id,
    title: post.title,
    message: post.message,
    tags: post.tags ?? [],
    likes: post.likes ?? (post.likedBy?.length ?? 0),
    likedBy: post.likedBy ?? [],
    author: owner?.name ?? post.author ?? "Community Member",
    authorProfile: mapUser(owner),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    comments: postComments.map((comment) => {
      const commenter = users.find((user) => user.id === comment.userId);
      return {
        id: comment.id,
        message: comment.message,
        createdAt: comment.createdAt,
        author: commenter?.name ?? comment.author ?? "Community Member",
        authorProfile: mapUser(commenter),
      };
    }),
    __liked: currentUserId ? (post.likedBy ?? []).includes(currentUserId) : false,
  };
};

export const listCommunityPosts = (currentUserId) => {
  const db = getDb();
  const { posts, users, comments } = db.data;
  return posts
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((post) => serializePost(post, users, currentUserId, comments));
};

export const createCommunityPost = async ({ userId, title, message, tags }) => {
  const db = getDb();
  const timestamp = new Date().toISOString();
  const post = {
    id: nanoid(),
    userId,
    title,
    message,
    tags: tags ?? [],
    likes: 0,
    likedBy: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  db.data.posts.unshift(post);
  await db.write();
  return serializePost(post, db.data.users, userId, db.data.comments);
};

export const toggleCommunityLike = async ({ userId, postId }) => {
  const db = getDb();
  const post = db.data.posts.find((entry) => entry.id === postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }
  const likedBy = new Set(post.likedBy ?? []);
  if (likedBy.has(userId)) {
    likedBy.delete(userId);
  } else {
    likedBy.add(userId);
  }
  post.likedBy = Array.from(likedBy);
  post.likes = post.likedBy.length;
  post.updatedAt = new Date().toISOString();
  await db.write();
  return serializePost(post, db.data.users, userId, db.data.comments);
};

export const addCommunityComment = async ({ userId, postId, message }) => {
  const db = getDb();
  const post = db.data.posts.find((entry) => entry.id === postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }
  const timestamp = new Date().toISOString();
  const comment = {
    id: nanoid(),
    postId,
    userId,
    message,
    createdAt: timestamp,
  };
  db.data.comments.push(comment);
  post.updatedAt = timestamp;
  await db.write();
  return serializePost(post, db.data.users, userId, db.data.comments);
};