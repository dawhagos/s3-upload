const s3 = require("../libs/s3");
const Upload = require("../models/Upload");

async function postFileController(req, res) {
  const file = req.file;

  const upload = new Upload();
  upload.filename = file.originalname;
  const createdFile = await upload.save();

  await s3
    .putObject({
      Key: file.originalname,
      Bucket: process.env.BUCKET_NAME,
      Body: file.buffer,
    })
    .promise();

  res.json(createdFile);
}
module.exports = postFileController;
