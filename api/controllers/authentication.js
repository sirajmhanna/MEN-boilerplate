const { Logger } = require("../../helpers/logger");
const User = require("../models/User");
const passwordHelpers = require("../../helpers/password");

exports.register = async (req, res) => {
  const logger = new Logger(req.requestID, "authentication", "register");
  let session;
  try {
    // hash password
    const passwordHash = await passwordHelpers.hash(req.body.password);

    // start transaction
    session = await User.startSession();
    await session.startTransaction();

    // add user
    const userObject = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: passwordHash,
      userType: "user",
    });
    const user = await userObject.save({ session });

    // commit transaction
    await session.commitTransaction();
    await session.endSession();

    return res.status(201).json({
      status: "success",
      code: 201,
      message: "User registered successfully",
      data: {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          userType: user.userType,
        },
      },
    });
  } catch (error) {
    logger.error("server error", { error: error.toString() });
    if (session) {
      await session.abortTransaction();
      await session.endSession();
    }

    return res.status(500).json({
      status: "fail",
      code: 500,
      message: "Server error",
    });
  }
};
