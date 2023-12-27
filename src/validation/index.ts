const emailNotValid = {
  error: {
    code: 400,
    message: "Please enter a valid email",
  },
};

const passwordAndEmailNotSent = {
  error: {
    code: 400,
    message: "Please enter all fields",
  },
};

const roleNotValid = {
  error: {
    code: 400,
    message: "Please enter a valid role",
  },
};

const userDoesNotExist = {
  error: {
    code: 400,
    message: "User does not exist",
  },
};

const invalidCredentials = {
  error: {
    code: 400,
    message: "Invalid credentials",
  },
};

const passwordNotValid = {
  error: {
    code: 400,
    message:
      "Password must be at least 8 characters, have at least 2 digits, have at least one uppercase letter, have at least one lowercase letter, have at least one special character, and should not contain spaces",
  },
};

const userAlreadyExists = {
  error: {
    code: 400,
    message: "User already exists",
  },
};

const emailNotSent = {
  error: {
    code: 400,
    message: "Email not sent",
  },
};

const passwordNotSent = {
  error: {
    code: 400,
    message: "Password not sent",
  },
};

const emailFailedToSend = {
  error: {
    code: 400,
    message: "Email failed to send",
  },
};

const tokenNotFound = {
  error: {
    code: 400,
    message: "Token not found",
  },
};

const tokenIsNotValid = {
  error: {
    code: 400,
    message: "Token is not valid",
  },
};

const refreshTokenNotFound = {
  error: {
    code: 400,
    message: "Refresh token not found",
  },
};

const refreshTokenIsNotValid = {
  error: {
    code: 400,
    message: "Refresh token is not valid",
  },
};


export {
  emailNotValid,
  passwordAndEmailNotSent,
  roleNotValid,
  userDoesNotExist,
  invalidCredentials,
  passwordNotValid,
  userAlreadyExists,
  emailNotSent,
  passwordNotSent,
  emailFailedToSend,
  tokenNotFound,
  tokenIsNotValid,
  refreshTokenNotFound,
  refreshTokenIsNotValid,
};
