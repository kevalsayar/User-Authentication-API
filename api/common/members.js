const ConstantMembers = function () {
  const Messages = {
    token: {
      "token-not-provided": "Please provide a JWT token!",
      "bearer-token-required": "Bearer Token required!",
      "token-not-found": "Token not found, Please login!",
      "token-expired": "JWT Expired, Please login again!",
    },
    data: {
      success: "Data Fetched!",
      error: "Error Faced!",
      queryparams: "Error revolving query parameters!",
    },
    user: {
      "user-registered": "User successfully registered!",
      "user-verification-done": "User successfully verified!",
      "user-already-verified": "User already verified, please login!",
      "user-not-verified": "User's not yet verified!",
      "email-required": "Emailid required!",
      "uuid-does-not-exist": "uuid does not exist, try again!",
      "no-user-found": "User not found, Please register!",
      "login-success": "Login completed successfully!",
      "login-error": "User already logged in!",
      "wrong-password": "Please enter the right password!",
      "email-password-both-necessary": "Please enter both, email and password!",
      "user-exists": "User already exists, Please login!",
      "logout-success": "Logged out successfully!",
      "logout-error": "User is already logged out!",
      "password-update-success": "Password updated!",
      "uuid-necessary": "Please enter a uuid!",
      "user-delete-success": "Deleted user!",
      "user-delete-error": "Couldn't delete user!",
    },
  };

  const REQUEST_CODE = {
    BAD_REQUEST: 400,
    SUCCESS: 200,
    INTERNAL_SERVER_ERROR: 500,
    ENTRY_ADDED: 201,
    UNAUTHORIZED_USER: 401,
  };

  const STATUS = {
    TRUE: true,
    FALSE: false,
  };

  const ENDPOINTS = Object.freeze({
    USER: "/user",
    REGISTER: "/register",
    LOGIN: "/login",
    PASSWORD_UPDATE: "/passupdate",
    VERIFY: "/verify",
    DELETE: "/delete",
    LOGOUT: "/logout",
  });

  const HTML_TEMPLATES = Object.freeze({
    WELCOME: "welcome",
  });

  return {
    Messages,
    REQUEST_CODE,
    STATUS,
    ENDPOINTS,
    HTML_TEMPLATES,
  };
};

module.exports = {
  ConstantMembers: ConstantMembers(),
};
