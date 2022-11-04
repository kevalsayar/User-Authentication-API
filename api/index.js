const router = require("express").Router();
const calcRoutes = require("./calculation/calculation.routes");

router.use("/", calcRoutes);

module.exports = router;
