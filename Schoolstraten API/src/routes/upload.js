const router = require("express").Router();
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v4 } = require("uuid");
const { isAuthorized } = require("../guards/auth");
const { ProjectModel } = require("../models/project.model");
const { ProjectCityModel } = require("../models/projectCity.model");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

const imageFilter = (request, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  else cb(new Error("Invalid Mime Type, only JPEG and PNG"), false);
};

const upload = multer({
  fileFilter: imageFilter,
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const ext = file.originalname.split(".")[1];
      const filename = `${v4()}.${ext}`;
      cb(null, filename);
    },
  }),
});

const singleUpload = upload.single("image");

router.get("/", (request, response, next) => {
  return response
    .status(200)
    .json({ message: `Hello from ${request.baseUrl}` });
});

router.post("/", [isAuthorized], async (request, response, next) => {
  singleUpload(request, response, (error) => {
    if (error) return response.status(400).json({ message: error.message });
    const { id } = request.body;
    if (!request.file) return;
    const { location } = request.file;
    console.log({ id, location });
    return response.status(200).json({ imageURL: location });
  });
});

router.delete("/", async (request, response, next) => {
  let { id, path } = request.query;
  console.log({ body: request.query });

  let strArray = String(path).split("/");
  path = strArray[strArray.length - 1];
  const params = { Bucket: process.env.S3_BUCKET_NAME, Key: path };

  try {
    const file = await s3.deleteObject(params).promise();
    return response.status(200).json({ message: "Image deleted" });
  } catch (error) {
    console.log({ error });
    return response
      .status(400)
      .json({ message: "Failed to delete image", error });
  }

  // try {
  //   const project = await ProjectModel.find({ _id: String(id) });
  //   if (!project)
  //     return response.status(400).json({ message: "Project not found" });

  //   try {
  //     const updated = await ProjectModel.findByIdAndUpdate(
  //       { _id: id },
  //       { image: "" },
  //       { new: true }
  //     );
  //     return response
  //       .status(200)
  //       .json({ message: "Project updated", project: updated });
  //   } catch (error) {
  //     return response.status(400).json({
  //       message: "Something went wrong trying to update the project",
  //       error,
  //     });
  //   }
  // } catch (error) {
  //   return response.status(400).json({
  //     message: `Error trying to get the project with id: ${id}`,
  //     error,
  //   });
  // }
});

router.post("/city", [isAuthorized], async (request, response, next) => {
  singleUpload(request, response, (error) => {
    if (error) return response.status(400).json({ message: error.message });
    console.log(request.file);

    const { location } = request.file;
    return response.status(200).json({ imageURL: location });
  });
});

router.delete("/city", async (request, response, next) => {
  const { id, image } = request.query;

  let strArray = String(image).split("/");
  let path = strArray[strArray.length - 1];
  const params = { Bucket: process.env.S3_BUCKET_NAME, Key: path };

  try {
    const file = await s3.deleteObject(params).promise();
  } catch (error) {
    console.log({ error });
    return response
      .status(400)
      .json({ message: "Failed to delete image", error });
  }

  try {
    const updated = await ProjectCityModel.findOneAndUpdate(
      { _id: id },
      { cityLogo: "" },
      { new: true }
    );
    return response
      .status(200)
      .json({ message: "City image removed", city: updated });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Failed to update the city", error });
  }
});

module.exports = router;
