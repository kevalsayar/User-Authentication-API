const router = require("express").Router();
const userRoutes = require("./user/user.routes");
const { ENDPOINTS } = require("./common/members");

router.use(ENDPOINTS.USER, userRoutes);

module.exports = router;
