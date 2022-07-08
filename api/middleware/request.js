/**
 * Generate Request ID Middleware
 * @param { Object } req
 * @param { Object } res
 * @param { Object } next
 * @returns { Object }
 */
exports.generateRequestIdentifier = async (req, res, next) => {
  const requestID = new Date().getTime();
  req.requestID = requestID;
  return next();
};
