const router = require("express").Router(),
  { UserHandler } = require("./user.handlers"),
  { reqMiddleware } = require("../middleware/request.middleware"),
  { authMiddleware } = require("../middleware/auth.middleware"),
  { validationSchemas } = require("./user.validationSchema"),
  { ConstantMembers } = require("../common/members");

router.get(
  ConstantMembers.ENDPOINTS.GET_DETAILS,
  [authMiddleware.auth],
  UserHandler.fetchUserDetails
);

router.post(
  ConstantMembers.ENDPOINTS.REGISTER,
  [reqMiddleware.validateReqBody(validationSchemas.registerUserSchema)],
  UserHandler.registerUser
);

router.post(
  ConstantMembers.ENDPOINTS.LOGIN,
  [reqMiddleware.validateReqBody(validationSchemas.loginUserSchema)],
  UserHandler.userLogin
);

router.post(
  ConstantMembers.ENDPOINTS.LOGOUT,
  [authMiddleware.auth],
  UserHandler.userLogout
);

router.patch(ConstantMembers.ENDPOINTS.VERIFY, UserHandler.verifyUserEmail);

router.patch(
  ConstantMembers.ENDPOINTS.PASSWORD_UPDATE,
  [
    authMiddleware.auth,
    reqMiddleware.validateReqBody(validationSchemas.loginUserSchema),
  ],
  UserHandler.updatePass
);

router.delete(
  ConstantMembers.ENDPOINTS.DELETE,
  [
    authMiddleware.auth,
    reqMiddleware.validateReqBody(validationSchemas.deleteUserSchema),
  ],
  UserHandler.deleteUser
);

router.post(
  ConstantMembers.ENDPOINTS.SEARCH,
  [
    authMiddleware.auth,
    reqMiddleware.validateReqBody(validationSchemas.searchReqSchema),
    reqMiddleware.validateQueryParam(validationSchemas.paginationParams),
  ],
  UserHandler.searchHandler
);

module.exports = router;
