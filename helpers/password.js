const bcrypt = require("bcryptjs");

exports.hash = async (password) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  } catch (error) {
    throw new Error(error);
  }
};

exports.compare = async (password, hash) => {
  try {
    return bcrypt.compareSync(password, hash);
  } catch (error) {
    throw new Error(error);
  }
};
