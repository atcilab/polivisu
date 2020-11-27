const path = require("path");

const getRoot = () => {
  return path.dirname(require.main.filename || process.mainModule.filename);
};

module.exports = { getRoot };
