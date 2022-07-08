exports.validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.options({ abortEarly: false }).validateAsync({
        ...req.body,
        ...req.query,
      });
      next();
    } catch (error) {
      if (error.isJoi) {
        return res.status(403).json({
          status: "fail",
          code: 403,
          message: "Validation error",
          data: {
            ...error,
          },
        });
      }
    }
  };
};
