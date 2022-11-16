const { ALGORITHM, EXPIRES_IN, FROM_MAIL, FILE_SIZE } = require("../../env"),
  multer = require("multer"),
  path = require("path");

const options = {
  algorithm: ALGORITHM,
  expiresIn: EXPIRES_IN,
};

const mailDetails = {
  from: FROM_MAIL,
};

const swaggerOptions = {
  swaggerOptions: { filter: "", persistAuthorization: true },
  customSiteTitle: "User Authentication Swagger",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: FILE_SIZE,
  },
  fileFilter: fileFilter,
});

module.exports = {
  options,
  mailDetails,
  swaggerOptions,
  upload,
};
