const { UserService } = require("./user.services"),
  { HelperFunction } = require("../common/helper");

const UserHandlers = function () {
  const registerUser = async function (req, res) {
    const response = await UserService.register(req.body);
    res
      .status(response.code)
      .json(await HelperFunction.specificLangData(response, req.t));
  };

  const fetchUserDetails = async function (req, res) {
    const response = await UserService.userDetails(req.params);
    res
      .status(response.code)
      .json(await HelperFunction.specificLangData(response, req.t));
  };

  const updatePass = async function (req, res) {
    const response = await UserService.passwordUpdate(req.body);
    res
      .status(response.code)
      .json(await HelperFunction.specificLangData(response, req.t));
  };

  const userLogin = async function (req, res) {
    const response = await UserService.login(req.body);
    res
      .status(response.code)
      .json(await HelperFunction.specificLangData(response, req.t));
  };

  const userLogout = async function (req, res) {
    const response = await UserService.logout(
      req.headers.authorization.split(" ")[1]
    );
    res
      .status(response.code)
      .json(await HelperFunction.specificLangData(response, req.t));
  };

  const deleteUser = async function (req, res) {
    const response = await UserService.removeUserFromDB(req.body);
    res
      .status(response.code)
      .json(await HelperFunction.specificLangData(response, req.t));
  };

  const searchHandler = async function (req, res) {
    const response = await UserService.searchInfoOfDeal({
      ...req.query,
      ...req.body,
    });
    res
      .status(response.code)
      .json(await HelperFunction.specificLangData(response, req.t));
  };

  const verifyUserEmail = async function (req, res) {
    const response = await UserService.verifyUser(req.params);
    res
      .status(response.code)
      .json(await HelperFunction.specificLangData(response, req.t));
  };

  const uploadUserImage = async function (req, res) {
    const response = await UserService.uploadImage({
      ...req.params,
      ...req.file,
    });
    res
      .status(response.code)
      .json(await HelperFunction.specificLangData(response, req.t));
  };

  return {
    registerUser,
    fetchUserDetails,
    userLogin,
    userLogout,
    updatePass,
    deleteUser,
    searchHandler,
    verifyUserEmail,
    uploadUserImage,
  };
};

module.exports = {
  UserHandler: UserHandlers(),
};
