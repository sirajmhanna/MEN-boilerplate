const { Logger } = require("../../helpers/logger");
const User = require("../models/User");
const CommonResponses = require("../../helpers/common-responses");
const passwordHelpers = require("../../helpers/password");
const tokenHelpers = require("../../helpers/token");

exports.register = async (req, res) => {
  const logger = new Logger(req.requestID, "authentication", "register");
  let session;
  try {
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
    logger.error("Server error", { error: error.toString() });
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
    logger.info("Fetching user by email", { email: req.body.email });
    const user = await User.getUserByEmail(req.body.email);

    if (!user) {
      logger.warn("Email not found", { email: req.body.email });
      return res
        .status(403)
        .json(CommonResponses.invalidLoginCredentialsResponse);
    }

    logger.info("Comparing password", { _id: user._id });
    const comparePassword = await passwordHelpers.compare(
      req.body.password,
      user.password
    );

    if (!comparePassword) {
      // edit user schema
      // add failed login attempts count
      // add isLocked
      // increment failed login attempts count
      // lock account if attempts count > than allowed

      logger.warn("Wrong password", { _id: user._id });
      return res
        .status(403)
        .json(CommonResponses.invalidLoginCredentialsResponse);
    }

    logger.info("Generating access and refresh token", { _id: user._id });
    const tokenPromises = await Promise.all([
      tokenHelpers.generateAccessToken({ _id: user._id }),
      tokenHelpers.generateRefreshToken({ _id: user._id }),
    ]);

    const tokens = {
      access: tokenPromises[0],
      refresh: tokenPromises[1],
    };

    logger.info("Setting refresh token in an http-only secure cookie", {
      _id: user._id,
    });
    res.cookie("refreshToken", tokens.refresh, {
      maxAge:
        1000 * process.env.REFRESH_TOKEN_TIME.split("d")[0] * 24 * 60 * 60, // days to milliseconds
      httpOnly: true,
      sameSite: "strict",
      secure: !process.env.ENVIRONMENT === "development",
    });

    logger.info("Returning success response", {
      _id: user._id,
    });
    return res.status(200).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
      },
      token: {
        access: tokens.access,
      },
    });
  } catch (error) {
    logger.error("Server error", { error: error.toString() });
    if (session) {
      await session.abortTransaction();
      await session.endSession();
    }

    return res.status(500).json(CommonResponses.serverError);
  }
};
