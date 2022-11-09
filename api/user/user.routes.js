const router = require("express").Router();
const {
  registerUserSchema,
  searchReqSchema,
  paginationParams,
  loginUserSchema,
  deleteUserSchema,
} = require("../common/validationSchema");
const { auth } = require("../middleware/auth.middleware");
const {
  validateReqBody,
  validateQueryParam,
} = require("../middleware/request.middleware");
const {
  registerUser,
  fetchUserDetails,
  userLogin,
  userLogout,
  updatePass,
  deleteUser,
  searchHandler,
  verifyUserEmail,
} = require("./user.handlers");
const { ENDPOINTS } = require("../common/members");

router.get("/details/:uuid?", [auth], fetchUserDetails);

router.post(
  ENDPOINTS.REGISTER,
  [validateReqBody(registerUserSchema)],
  registerUser
);

router.post(ENDPOINTS.LOGIN, [validateReqBody(loginUserSchema)], userLogin);

router.post(ENDPOINTS.LOGOUT, [auth], userLogout);

router.patch("/verify/:uuidhash", verifyUserEmail);

router.patch(
  ENDPOINTS.PASSWORD_UPDATE,
  [auth, validateReqBody(loginUserSchema)],
  updatePass
);

router.delete(
  ENDPOINTS.DELETE,
  [auth, validateReqBody(deleteUserSchema)],
  deleteUser
);

router.post(
  "/search",
  [
    auth,
    validateReqBody(searchReqSchema),
    validateQueryParam(paginationParams),
  ],
  searchHandler
);

module.exports = router;
