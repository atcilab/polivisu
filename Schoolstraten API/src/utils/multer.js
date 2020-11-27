const multer = require("multer");
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "../../uploads");
const { v4 } = require("uuid");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, dir);
  },
  filename: (request, file, callback) => {
    const ext = file.originalname.split(".")[1];
    const filename = `${v4()}.${ext}`;
    callback(null, filename);
  }
});

module.exports = { storage };
