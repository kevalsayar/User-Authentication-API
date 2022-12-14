const {
    ALGORITHM,
    EXPIRES_IN,
    FROM_MAIL,
    FILE_SIZE,
    IMAGE_UPLOAD,
    MIMETYPES,
  } = require("../../env"),
  multer = require("multer"),
  path = require("path");

/**
 * JWT Generations Configs
 */
const options = {
  algorithm: ALGORITHM,
  expiresIn: EXPIRES_IN,
};

/**
 * Mail Configs
 */
const mailDetails = {
  from: FROM_MAIL,
};

/**
 * Swagger Configs
 */
const swaggerOptions = {
  swaggerOptions: { filter: "", persistAuthorization: true },
  customSiteTitle: "User Authentication Swagger",
};

/**
 * File Upload Configs
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + `${IMAGE_UPLOAD}`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (_req, file, cb) => {
  if (MIMETYPES.split(", ").includes(file.mimetype)) {
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
