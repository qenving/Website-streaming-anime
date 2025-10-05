import { nanoid } from "nanoid";
import { getDb } from "../db/database.js";
import { AppError } from "../utils/errors.js";

const serializeUser = (row) =>
  row
    ? {
        id: row.id,
        name: row.name,
        email: row.email,
        isPremium: Boolean(row.is_premium),
        role: row.role,
      }
    : null;

const buildPostSerializer = (currentUserId) => {
  const db = getDb();
  const posts = db
    .prepare(
      `SELECT p.*, u.name AS author_name, u.email AS author_email, u.is_premium AS author_is_premium,
              u.role AS author_role, u.id AS author_id
       FROM community_posts p
       LEFT JOIN users u ON u.id = p.user_id
       ORDER BY p.created_at DESC`
    )
    .all();

  const likes = db.prepare("SELECT post_id, user_id FROM community_post_likes").all();
  const comments = db
    .prepare(
      `SELECT c.*, u.name AS commenter_name, u.email AS commenter_email, u.is_premium AS commenter_is_premium,
              u.role AS commenter_role, u.id AS commenter_id
       FROM community_comments c
       LEFT JOIN users u ON u.id = c.user_id
       ORDER BY c.created_at ASC`
    )
    .all();

  const usersById = new Map(
    db
      .prepare("SELECT id, name, email, is_premium, role FROM users")
      .all()
      .map((user) => [user.id, user])
  );

  const likesByPost = new Map();
  likes.forEach((like) => {
    const collection = likesByPost.get(like.post_id) ?? new Set();
    collection.add(like.user_id);
    likesByPost.set(like.post_id, collection);
  });

  const commentsByPost = new Map();
  comments.forEach((comment) => {
    const collection = commentsByPost.get(comment.post_id) ?? [];
    collection.push({
      id: comment.id,
      message: comment.message,
      createdAt: comment.created_at,
      author: comment.commenter_name ?? "Community Member",
      authorProfile: serializeUser(
        comment.commenter_id
          ? {
              id: comment.commenter_id,
              name: comment.commenter_name,
              email: comment.commenter_email,
              is_premium: comment.commenter_is_premium,
              role: comment.commenter_role,
            }
          : null
      ),
    });
    commentsByPost.set(comment.post_id, collection);
  });

  const serializePost = (post) => {
    const likedSet = likesByPost.get(post.id) ?? new Set();
    const author = post.author_id
      ? usersById.get(post.author_id) ?? {
          id: post.author_id,
          name: post.author_name,
          email: post.author_email,
          is_premium: post.author_is_premium,
          role: post.author_role,
        }
      : null;
    return {
      id: post.id,
      title: post.title,
      message: post.message,
      tags: post.tags ? JSON.parse(post.tags) : [],
      likes: likedSet.size,
      likedBy: Array.from(likedSet),
      author: post.author_name ?? "Community Member",
      authorProfile: serializeUser(author),
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      comments: commentsByPost.get(post.id) ?? [],
      __liked: currentUserId ? likedSet.has(currentUserId) : false,
    };
  };

  return {
    posts: posts.map(serializePost),
    serializePost,
    likesByPost,
    commentsByPost,
  };
};

export const listCommunityPosts = (currentUserId) => {
  const { posts } = buildPostSerializer(currentUserId);
  return posts;
};

export const createCommunityPost = ({ userId, title, message, tags }) => {
  const db = getDb();
  const timestamp = new Date().toISOString();
  const tagsJson = JSON.stringify(tags ?? []);
  db
    .prepare(
      `INSERT INTO community_posts (id, user_id, title, message, tags, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(nanoid(), userId, title, message, tagsJson, timestamp, timestamp);
  const { serializePost } = buildPostSerializer(userId);
  const inserted = db
    .prepare("SELECT * FROM community_posts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1")
    .get(userId);
  return serializePost(inserted);
};

export const toggleCommunityLike = ({ userId, postId }) => {
  const db = getDb();
  const post = db.prepare("SELECT * FROM community_posts WHERE id = ?").get(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }
  const like = db
    .prepare("SELECT 1 FROM community_post_likes WHERE post_id = ? AND user_id = ?")
    .get(postId, userId);
  if (like) {
    db.prepare("DELETE FROM community_post_likes WHERE post_id = ? AND user_id = ?").run(postId, userId);
  } else {
    db
      .prepare("INSERT INTO community_post_likes (post_id, user_id, created_at) VALUES (?, ?, ?)")
      .run(postId, userId, new Date().toISOString());
  }
  const { serializePost } = buildPostSerializer(userId);
  const refreshed = db.prepare("SELECT * FROM community_posts WHERE id = ?").get(postId);
  return serializePost(refreshed);
};

export const addCommunityComment = ({ userId, postId, message }) => {
  const db = getDb();
  const post = db.prepare("SELECT * FROM community_posts WHERE id = ?").get(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }
  const timestamp = new Date().toISOString();
  db
    .prepare("INSERT INTO community_comments (id, post_id, user_id, message, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(nanoid(), postId, userId, message, timestamp);
  db.prepare("UPDATE community_posts SET updated_at = ? WHERE id = ?").run(timestamp, postId);
  const { serializePost } = buildPostSerializer(userId);
  const refreshed = db.prepare("SELECT * FROM community_posts WHERE id = ?").get(postId);
  return serializePost(refreshed);
};
