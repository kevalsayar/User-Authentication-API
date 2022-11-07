const router = require("express").Router();
const { auth } = require("../middleware/auth.middleware");
const {
  addNumbers,
  multiplyNumbers,
  divideNumbers,
  subtractNumber,
  registerUser,
  getPersonDetails,
  userLogin
} = require("./calculation.handlers");

router.post("/sum", addNumbers);

router.post("/multiply", multiplyNumbers);

router.post("/divide", divideNumbers);

router.post("/subtract", subtractNumber);

router.get("/details/:uuid?", [auth], getPersonDetails)

router.post('/register', registerUser)

router.post('/login', userLogin)

module.exports = router;
