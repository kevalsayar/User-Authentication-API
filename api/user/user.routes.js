const router = require("express").Router();
const {
  registerUserSchema,
  searchReqSchema,
  paginationParams,
} = require("../common/validationSchema");
const { auth } = require("../middleware/auth.middleware");
const {
  validateReqBody,
  validateQueryParam,
} = require("../middleware/request.middleware");
const {
  passUpdateCheck,
  deleteUserCheck,
} = require("../middleware/requiredchecks.middleware");
const {
  registerUser,
  fetchUserDetails,
  userLogin,
  userLogout,
  updatePass,
  deleteUser,
  searchHandler,
} = require("./user.handlers");

router.get("/details/:uuid?", [auth], fetchUserDetails);

router.post("/register", [validateReqBody(registerUserSchema)], registerUser);

router.post("/login", userLogin);

router.post("/logout", [auth], userLogout);

router.patch("/passupdate", [auth, passUpdateCheck], updatePass);

router.delete("/deleteuser", [auth, deleteUserCheck], deleteUser);

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
