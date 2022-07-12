const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passwordHelpers = require("../../helpers/password");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    tokens: [{ type: Schema.Types.ObjectId, ref: "Token" }],
    deletedAt: {
      type: Date,
      require: false,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema, "user");

User.createUser = async (
  firstName,
  lastName,
  email,
  phone,
  password,
  userType,
  session
) => {
  try {
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password: await passwordHelpers.hash(password),
      userType,
    });

    return await user.save({ session });
  } catch (error) {
    throw new Error(error);
  }
};

User.getUserByEmail = (email) => {
  try {
    return User.findOne({ email, deletedAt: null });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = User;
