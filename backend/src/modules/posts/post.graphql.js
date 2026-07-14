const {
  listPosts,
  listDrafts,
  searchPosts,
  getPostById,
  incrementPostView,
  createPost,
  updatePost,
  deletePost,
  listPostsCount,
} = require("./post.service");

const postTypeDefs = `#graphql
  type Post {
    id: ID!
    title: String!
    slug: String!
    excerpt: String!
    content: String!
    authorName: String!
    category: String!
    featuredImage: String!
    tags: [String!]!
    visibility: String!
    status: String!
    publishDate: String!
    viewCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  input PostInput {
    title: String!
    content: String!
    slug: String
    excerpt: String
    authorName: String
    category: String
    featuredImage: String
    tags: [String!]
    visibility: String
    status: String
    publishDate: String
  }

  extend type Query {
    posts: [Post!]!
    drafts: [Post!]!
    post(id: ID!): Post!
    searchPosts(query: String!): [Post!]!
    postCount:Int!
  }

  extend type Mutation {
    addPost(input: PostInput!): Post!
    updatePost(id: ID!, input: PostInput!): Post!
    deletePost(id: ID!): Boolean!
    incrementPostView(id: ID!): Post!
  }
`;

const postResolvers = {
  Post: {
    id: (post) => String(post.id || post._id),
    slug: (post) => post.slug || "",
    excerpt: (post) => post.excerpt || "",
    authorName: (post) => post.authorName || "Anonymous",
    category: (post) => post.category || "Technology",
    featuredImage: (post) => post.featuredImage || "",
    tags: (post) => post.tags || [],
    visibility: (post) => post.visibility || "public",
    status: (post) => post.status || "published",
    viewCount: (post) => post.viewCount ?? 0,
    publishDate: (post) => {
      const value = post.publishDate || post.createdAt;
      return value ? new Date(value).toISOString() : new Date().toISOString();
    },
    createdAt: (post) => {
      if (post.createdAt) return new Date(post.createdAt).toISOString();
      if (post._id?.getTimestamp) return post._id.getTimestamp().toISOString();
      return new Date().toISOString();
    },
    updatedAt: (post) => {
      if (post.updatedAt) return new Date(post.updatedAt).toISOString();
      if (post.createdAt) return new Date(post.createdAt).toISOString();
      if (post._id?.getTimestamp) return post._id.getTimestamp().toISOString();
      return new Date().toISOString();
    },
  },
  Query: {
    posts: async () => listPosts(),
    drafts: async () => listDrafts(),
    post: async (_, { id }) => getPostById(id),
    searchPosts: async (_, { query }) => searchPosts(query),
    postCount: async () => listPostsCount(),
  },
  Mutation: {
    addPost: async (_, { input }) => createPost(input),
    updatePost: async (_, { id, input }) => updatePost({ id, ...input }),
    deletePost: async (_, { id }) => deletePost({ id }),
    incrementPostView: async (_, { id }) => incrementPostView(id),
  },
};

module.exports = { postTypeDefs, postResolvers };
