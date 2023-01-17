const Upload = require("../models/Upload");

async function getFilesController(req, res) {
  const files = await Upload.find();
  res.json(files);
}

module.exports = getFilesController;
