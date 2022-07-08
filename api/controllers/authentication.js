const { Logger } = require("../../helpers/logger");
const User = require("../models/User");
const CommonResponses = require("../../helpers/common-responses");

exports.register = async (req, res) => {
  const logger = new Logger(req.requestID, "authentication", "register");
  let session;
  try {
    // check if email exists
    const isEmailExists = await User.getUserByEmail(req.body.email);

    if (isEmailExists) {
      return res.status(409).json({
        ...CommonResponses.emailExists,
        data: {
          email: req.body.email,
        },
      });
    }

    // start transaction
    session = await User.startSession();
    await session.startTransaction();

    // add user
    const user = await User.createUser(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.phone,
      req.body.password,
      "user",
      session
    );

    // commit transaction
    await session.commitTransaction();
    await session.endSession();

    return res.status(201).json({
      ...CommonResponses.successUserRegister,
      data: {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
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

    return res.status(500).json(CommonResponses.serverError);
  }
};
