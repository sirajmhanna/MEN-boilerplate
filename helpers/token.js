const jwt = require("jsonwebtoken");
const logger = require("../config/winston");
const crypto = require("crypto-js");

/**
 * This function verifies JSON Web Tokens
 * @function verifyRefreshToken()
 * @param { String } token
 * @returns { Object } Decoded token will be returned after verification
 */
exports.verifyRefreshToken = async (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return false;
    } else {
      logger.warn(
        new Date().getTime(),
        "helpers-token",
        "verifyRefreshToken",
        "Token has expired",
        {}
      );
      throw new Error(error);
    }
  }
};

/**
 * This function verifies JSON Web Tokens
 * @function verifyAccessToken()
 * @param { String } token
 * @returns { Object } Decoded token will be returned after verification
 */
exports.verifyAccessToken = async (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      logger.warn(
        new Date().getTime(),
        "helpers-token",
        "verifyAccessToken",
        "Token has expired",
        {}
      );
      return false;
    } else {
      throw new Error(error);
    }
  }
};

exports.generateAccessToken = async (data) => {
  try {
    return jwt.sign(data, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    });
  } catch (error) {
    throw new Error(error);
  }
};

exports.generateRefreshToken = async (data) => {
  try {
    const _idHash = await crypto.AES.encrypt(
      data._id.toString(),
      process.env.REFRESH_TOKEN_CRYPTO_ID
    ).toString();

    return await jwt.sign({ _id: _idHash }, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    });
  } catch (error) {
    throw new Error(error);
  }
};
