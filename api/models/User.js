const mongoose = require("mongoose");
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
    phoneNumber: {
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
    deletedAt: {
      type: Date,
      require: false,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", UserSchema);

User.createUser = async (
  firstName,
  lastName,
  email,
  phoneNumber,
  password,
  userType,
  session
) => {
  try {
    const user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
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
