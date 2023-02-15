const s3 = require("../libs/s3");
const Upload = require("../models/Upload");

async function deleteFileController(req, res) {
  const fileName = req.params.filename;

  const del = await Upload.findOneAndDelete({ filename: fileName });

  res.json(del);
  await s3
    .deleteObject({
      Key: fileName,
      Bucket: process.env.BUCKET_NAME,
    })
    .promise();
}

module.exports = deleteFileController;
