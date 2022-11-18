const ConstantMembers = function () {
  const Messages = {
    image: {
      "image-uploaded": "image.image-uploaded",
      "imagetype-not-supported": "image.imagetype-not-supported",
      "image-not-uploaded": "image.image-not-uploaded",
    },
    token: {
      "token-not-provided": "token.token-not-provided",
      "bearer-token-required": "token.bearer-token-required",
      "token-not-found": "token.token-not-found",
      "token-expired": "token.token-expired",
    },
    data: {
      success: "data.success",
      error: "data.error",
      queryparams: "data.queryparams",
    },
    user: {
      "user-registered": "user.user-registered",
      "user-verification-done": "user.user-verification-done",
      "user-already-verified": "user.user-already-verified",
      "user-not-verified": "user.user-not-verified",
      "email-required": "user.email-required",
      "uuid-does-not-exist": "user.uuid-does-not-exist",
      "no-user-found": "user.no-user-found",
      "login-success": "user.login-success",
      "login-error": "user.login-error",
      "wrong-password": "user.wrong-password",
      "email-password-both-necessary": "user.email-password-both-necessary",
      "user-exists": "user.user-exists",
      "logout-success": "user.logout-success",
      "logout-error": "user.logout-error",
      "password-update-success": "user.password-update-success",
      "uuid-necessary": "user.uuid-necessary",
      "user-delete-success": "user.user-delete-success",
      "user-delete-error": "user.user-delete-error",
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
    PROFILE_PIC_UPDATE: "/updateprofilepic/:uuid",
    VERIFY: "/verify/:uuidhash",
    GET_DETAILS: "/details/:uuid?",
    SEARCH: "/search",
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
