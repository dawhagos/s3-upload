const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  endpoint: process.env.S3_ENDPOINT,
  region: "us-west-2",
  s3ForcePathStyle: true,
});

module.exports = s3;
