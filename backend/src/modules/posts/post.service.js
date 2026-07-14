const { GraphQLError } = require("graphql");
const Post = require("./post.model");

const assertNonEmpty = (value, fieldName) => {
  if (!value || !value.trim()) {
    throw new GraphQLError(`${fieldName} is required.`, {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
};

const assertValidPostId = (id) => {
  if (!Post.db.base.Types.ObjectId.isValid(id)) {
    throw new GraphQLError("Invalid post id.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const buildUniqueSlug = async (title, slug, excludeId = null) => {
  const baseSlug = slugify(slug || title);
  if (!baseSlug) {
    throw new GraphQLError("Slug is required.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };

    const existing = await Post.findOne(query).lean();
    if (!existing) return candidate;

    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

const normalizePostInput = (input = {}) => ({
  title: input.title?.trim(),
  slug: input.slug?.trim(),
  excerpt: input.excerpt?.trim() || "",
  content: input.content?.trim(),
  authorName: input.authorName?.trim() || "Anonymous",
  category: input.category?.trim() || "Technology",
  featuredImage: input.featuredImage?.trim() || "",
  tags: Array.isArray(input.tags) ? input.tags.map((tag) => tag.trim()).filter(Boolean) : [],
  visibility: input.visibility === "private" ? "private" : "public",
  status: input.status === "draft" ? "draft" : "published",
  publishDate: input.publishDate ? new Date(input.publishDate) : new Date(),
});

const listPosts = async () =>
  Post.find({ status: "published" }).sort({ publishDate: -1, createdAt: -1 }).lean();

const listPostsCount = async () =>{
 return  Post.countDocuments({ status: "published" });
}
 



const listDrafts = async () =>
  Post.find({ status: "draft" }).sort({ updatedAt: -1, createdAt: -1 }).lean();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const searchPosts = async (query) => {
  const trimmed = query?.trim();

  if (!trimmed) {
    return listPosts();
  }

  const regex = new RegExp(escapeRegex(trimmed), "i");

  return Post.find({
    status: "published",
    $or: [
      { title: regex },
      { excerpt: regex },
      { content: regex },
      { authorName: regex },
      { category: regex },
      { tags: regex },
    ],
  })
    .sort({ publishDate: -1, createdAt: -1 })
    .lean();
};

const getPostById = async (id) => {
  assertNonEmpty(id, "ID");
  assertValidPostId(id);

  const post = await Post.findById(id).lean();
  if (!post) {
    throw new GraphQLError("Post not found.", {
      extensions: { code: "NOT_FOUND" },
    });
  }

  return post;
};

const incrementPostView = async (id) => {
  assertNonEmpty(id, "ID");
  assertValidPostId(id);

  const post = await Post.findByIdAndUpdate(
    id,
    { $inc: { viewCount: 1 } },
    { new: true }
  ).lean();

  if (!post) {
    throw new GraphQLError("Post not found.", {
      extensions: { code: "NOT_FOUND" },
    });
  }

  return post;
};

const assertPublishableContent = (content) => {
  const plain = content?.replace(/<[^>]+>/g, "").trim();
  if (!plain) {
    throw new GraphQLError("Content is required to publish.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
};

const createPost = async (input) => {
  const data = normalizePostInput(input);
  assertNonEmpty(data.title, "Title");

  if (data.status === "published") {
    assertPublishableContent(data.content);
  } else {
    data.content = data.content || "";
  }

  data.slug = await buildUniqueSlug(data.title, data.slug);

  const post = await Post.create(data);
  return post.toObject();
};

const updatePost = async ({ id, ...input }) => {
  assertNonEmpty(id, "ID");
  assertValidPostId(id);

  const data = normalizePostInput(input);
  assertNonEmpty(data.title, "Title");

  if (data.status === "published") {
    assertPublishableContent(data.content);
  } else {
    data.content = data.content || "";
  }

  data.slug = await buildUniqueSlug(data.title, data.slug, id);

  const post = await Post.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    throw new GraphQLError("Post not found.", {
      extensions: { code: "NOT_FOUND" },
    });
  }

  return post.toObject();
};

const deletePost = async ({ id }) => {
  assertNonEmpty(id, "ID");
  assertValidPostId(id);

  const post = await Post.findByIdAndDelete(id);
  if (!post) {
    throw new GraphQLError("Post not found.", {
      extensions: { code: "NOT_FOUND" },
    });
  }

  return true;
};

module.exports = {
  listPosts,
  listDrafts,
  searchPosts,
  getPostById,
  incrementPostView,
  createPost,
  updatePost,
  deletePost,
  listPostsCount,
};
