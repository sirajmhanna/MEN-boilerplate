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
    preLockCount: {
      type: Number,
      default: 0,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    userType: {
      type: String,
      enum: ["admin", "user"],
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

User.incrementFailedLoginAttempts = async (id) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $inc: { preLockCount: 1 } },
      {
        new: true,
      }
    );

    if (user.preLockCount >= process.env.NUMBER_OF_ALLOWED_FAILED_ATTEMPTS) {
      await User.findOneAndUpdate({ _id: id }, { isLocked: true });
    }
  } catch (error) {
    throw new Error(error);
  }
};

User.resetFailedLoginAttempts = async (id) => {
  try {
    await User.findOneAndUpdate({ _id: id }, { preLockCount: 0 });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = User;
