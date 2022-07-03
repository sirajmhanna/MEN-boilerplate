exports.health = (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Server is alive",
    data: {
      service: process.env.SERVICE_NAME,
    },
  });
};
