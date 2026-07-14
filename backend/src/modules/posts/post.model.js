const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
      default: "",
    },
    authorName: {
      type: String,
      trim: true,
      default: "Anonymous",
    },
    category: {
      type: String,
      trim: true,
      default: "Technology",
    },
    featuredImage: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
