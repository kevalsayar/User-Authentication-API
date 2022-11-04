const router = require("express").Router();
const {
  addNumbers,
  multiplyNumbers,
  divideNumbers,
  subtractNumber,
  getUserData,
  personDetails,
  getPersonDetails
} = require("./calculation.handlers");

// router.get("/query", getUserData)

router.post("/sum", addNumbers);

router.post("/multiply", multiplyNumbers);

router.post("/divide", divideNumbers);

router.post("/subtract", subtractNumber);

router.get("/details/:uuid?", getPersonDetails)

router.post('/details', personDetails)

module.exports = router;
