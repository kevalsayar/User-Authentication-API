const {
  add,
  multiply,
  subtract,
  divide,
  getData,
  addPersonDetails,
  getUserDetails
} = require("./calculation.services");
const { writeFile, readFile } = require("../common/helper");

const UserHandlers = () => {
  const addNumbers = async function (req, res) {
    const response = add(req.body);
    res.status(response.code).json(response);
    writeFile(response.data.uuid, response);
  };

  const multiplyNumbers = function (req, res) {
    const response = multiply(req.body);
    res.status(response.code).json(response);
    writeFile(response.data.uuid, response);
  };

  const divideNumbers = function (req, res) {
    const response = subtract(req.body);
    res.status(response.code).json(response);
    writeFile(response.data.uuid, data);
  };

  const subtractNumber = function (req, res) {
    const response = divide(req.body);
    res.status(response.code).json(response);
    writeFile(response.data.uuid, response);
  };

  const getUserData = async function (req, res) {
    const response = await getData(req.query);
    res.status(response.code).json(response);
  };

  const personDetails = async function (req, res) {
    const response = addPersonDetails(req.body);
    res.status(response.code).json(response);
    const data = await readFile("userDetails");
    data.data.push(response);
    writeFile("userDetails", data.data);
  };

  const getPersonDetails = async function (req, res) {
    const response = await getUserDetails(req.params)
    res.status(response.code).json(response);
  };

  return {
    addNumbers,
    multiplyNumbers,
    divideNumbers,
    subtractNumber,
    getUserData,
    personDetails,
    getPersonDetails,
  };
};

module.exports = UserHandlers();
