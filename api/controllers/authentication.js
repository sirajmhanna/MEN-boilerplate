const { Logger } = require("../../helpers/logger");
const User = require("../models/User");
const CommonResponses = require("../../helpers/common-responses");
const Token = require("../models/Token");

exports.register = async (req, res) => {
  const logger = new Logger(req.requestID, "authentication", "register");
  let session;
  try {
    // const token = new Token({
    //   user_id: "62e25b4fb99c6211d609beb6",
    //   token: "12345678",
    //   expiresAt: new Date().toISOString(),
    //   isBlacklisted: false,
    // });

    // const t = await token.save();

    // return res.status(201).json({
    //   message: "good",
    //   t,
    // });

    // update user and add the token ID



    // const u = await User.find().populate("tokens");

    // return res.status(201).json({
    //   message: "good",
    //   u,
    // });

    logger.info("Fetching user by email", { email: req.body.email });
    const isEmailExists = await User.getUserByEmail(req.body.email);

    if (isEmailExists) {
      logger.warn("Email address already exists", { email: req.body.email });
      return res.status(409).json({
        ...CommonResponses.emailExists,
        data: {
          email: req.body.email,
        },
      });
    }

    logger.info("Starting session", {});
    session = await User.startSession();
    await session.startTransaction();

    logger.info("Adding user", {});
    const user = await User.createUser(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.phone,
      req.body.password,
      "user",
      session
    );

    logger.info("Committing transaction :: Returning success response", {
      _id: user._id,
    });
    await session.commitTransaction();
    await session.endSession();

    return res.status(201).json({
      ...CommonResponses.successUserRegister,
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          userType: user.userType,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    logger.error("server error", { error: error.toString() });
    if (session) {
      await session.abortTransaction();
      await session.endSession();
    }

    return res.status(500).json(CommonResponses.serverError);
  }
};

exports.login = async (req, res) => {
  const logger = new Logger(req.requestID, "authentication", "login");
  let session;
  try {
  } catch (error) {
    logger.error("server error", { error: error.toString() });
    if (session) {
      await session.abortTransaction();
      await session.endSession();
    }

    return res.status(500).json(CommonResponses.serverError);
  }
};
