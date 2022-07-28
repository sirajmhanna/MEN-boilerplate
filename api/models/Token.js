const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");

const TokenSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Access", "Refresh", "Register", "ResetPassword"],
      require: true,
    },
    token: {
      type: String,
      require: true,
    },
    expiresAt: {
      type: Date,
      require: true,
    },
    isBlacklisted: {
      type: Boolean,
      require: false,
    },
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    deletedAt: {
      type: Date,
      require: false,
      default: null,
    },
  },
  { timestamps: true }
);

TokenSchema.post("save", async (doc) => {
  await User.findOneAndUpdate(
    { _id: doc.user_id },
    { $push: { tokens: doc._id } }
  );
});

const Token = mongoose.model("Token", TokenSchema, "token");

module.exports = Token;
