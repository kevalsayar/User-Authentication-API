const {
  register,
  userDetails,
  login,
  logout,
  passwordUpdate,
  removeUserFromDB,
  searchInfoOfDeal,
} = require("./user.services");

const UserHandlers = () => {
  const registerUser = async function (req, res) {
    const response = await register(req.body);
    res.status(response.code).json(response);
  };

  const fetchUserDetails = async function (req, res) {
    const response = await userDetails(req.params);
    res.status(response.code).json(response);
  };

  const updatePass = async function (req, res) {
    const response = await passwordUpdate(req.body);
    res.status(response.code).json(response);
  };

  const userLogin = async function (req, res) {
    const response = await login(req.body);
    res.status(response.code).json(response);
  };

  const userLogout = async function (req, res) {
    const response = await logout(req.headers.authorization.split(" ")[1]);
    res.status(response.code).json(response);
  };

  const deleteUser = async function (req, res) {
    const response = await removeUserFromDB(req.body);
    res.status(response.code).json(response);
  };

  const searchHandler = async function (req, res) {
    console.log(req.body);
    console.log(req.query);
    const response = await searchInfoOfDeal({
      ...req.query,
      ...req.body,
    });
    res.status(response.code).json(response);
  };

  return {
    registerUser,
    fetchUserDetails,
    userLogin,
    userLogout,
    updatePass,
    deleteUser,
    searchHandler,
  };
};

module.exports = UserHandlers();
