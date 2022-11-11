const router = require("express").Router(),
  userRoutes = require("./user/user.routes"),
  { ConstantMembers } = require("./common/members");

router.use(ConstantMembers.ENDPOINTS.USER, userRoutes);

module.exports = router;
