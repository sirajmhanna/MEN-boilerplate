module.exports = {
  serverError: {
    status: "fail",
    code: 500,
    message: "Server error, please try again later",
  },
  emailExists: {
    status: "warn",
    code: 409,
    message: "Email address already exists",
  },
  successUserRegister: {
    status: "success",
    code: 201,
    message: "User registered successfully",
  },
  invalidLoginCredentialsResponse: {
    status: "warn",
    code: 403,
    message: "Invalid login credentials",
  },
  accountLocked: {
    status: "warn",
    code: 403,
    message: "Account is locked",
  },
};
