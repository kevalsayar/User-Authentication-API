const {
  add,
  multiply,
  subtract,
  divide,
  addUser,
  getUserDetails,
  confirmCreds
} = require("./calculation.services");

const UserHandlers = () => {
  const addNumbers = async function (req, res) {
    const response = add(req.body);
    res.status(response.code).json(response);
    // writeFile(response.data.uuid, response);
  };

  const multiplyNumbers = function (req, res) {
    const response = multiply(req.body);
    res.status(response.code).json(response);
    // writeFile(response.data.uuid, response);
  };

  const divideNumbers = function (req, res) {
    const response = subtract(req.body);
    res.status(response.code).json(response);
    // writeFile(response.data.uuid, data);
  };

  const subtractNumber = function (req, res) {
    const response = divide(req.body);
    res.status(response.code).json(response);
    // writeFile(response.data.uuid, response);
  };

  const registerUser = async function (req, res) {
    const response = await addUser(req.body);
    res.status(response.code).json(response);
  };

  const getPersonDetails = async function (req, res) {
    const response = await getUserDetails(req.params);
    res.status(response.code).json(response);
  };

  const userLogin = async function (req,res) {
    console.log("AUTH",req.headers.authorization);
    const response = await confirmCreds(req.body);
    res.status(response.code).json(response);
  };

  return {
    addNumbers,
    multiplyNumbers,
    divideNumbers,
    subtractNumber,
    registerUser,
    getPersonDetails,
    userLogin,
  };
};

module.exports = UserHandlers();
