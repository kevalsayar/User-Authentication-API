const router = require("express").Router();
const { auth } = require("../middleware/auth.middleware");
const {
  registerUserCheck,
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
} = require("./user.handlers");

router.get("/details/:uuid?", [auth], fetchUserDetails);

router.post("/register", [registerUserCheck], registerUser);

router.post("/login", userLogin);

router.post("/logout", [auth], userLogout);

router.patch("/passupdate", [auth, passUpdateCheck], updatePass);

router.delete("/deleteuser", [auth, deleteUserCheck], deleteUser);

module.exports = router;
