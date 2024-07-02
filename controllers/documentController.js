const Document = require("../model/RastriyaParichayaPatra");
const fs = require("fs");
const path = require("path");
// Require the Cloudinary library
const cloudinary = require("cloudinary").v2;

//set cloudinary config section
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function compareFaces(url1, url2) {
  try {
    const response = await axios.post("http://127.0.0.1:8000/compare-faces/", {
      url1,
      url2,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error comparing faces:",
      error.response ? error.response.data : error.message
    );
    return false;
  }
}

const uploadDocument = async (req, res) => {
  try {
    const { citizenshipNumber, rastriyaPrarichayaPatraNumber, image } =
      req.body;

    if (!image) {
      return res.status(400).send({ msg: "No image data received!" });
    }

    // Upload image to Cloudinary
    cloudinary.uploader.upload(
      image,
      { folder: "Voxpoll" },
      async (err, result) => {
        if (err) {
          console.error("Error uploading image to Cloudinary:", err);
          return res.status(500).send("Error uploading image");
        }

        // Get the URL of the uploaded image
        const uploadedImageUrl = result.secure_url;
        console.log("🚀 ~ uploadedImageUrl:", uploadedImageUrl);

        // Save information to MongoDB
        const newDocument = await Document.create({
          imageUrl: uploadedImageUrl,
          citizenshipNumber,
          rastriyaPrarichayaPatraNumber,
          // Add more fields here if needed
        });
        console.log("🚀 ~ uploadDocument ~ newDocument:", newDocument);

        // If saving to MongoDB succeeds, send a success response
        return res.status(201).json({
          message: "Image uploaded successfully",
          imageUrl: uploadedImageUrl,
        });
      }
    );
  } catch (error) {
    console.error("Error saving document:", error);
    res.status(500).send({ msg: "Error saving document", error });
  }
};

const compareImage = async (req, res) => {
  try {
    const { citizenshipNumber, rastriyaPrarichayaPatraNumber, webCamImage } =
      req.body;

    if (!webCamImage) {
      return res.status(400).send({ msg: "No image data received!" });
    }

    let imageUrl1, imageUrl2;
    // Upload image to Cloudinary
    cloudinary.uploader.upload(
      webCamImage,
      { folder: "Voxpoll" },
      async (err, result) => {
        if (err) {
          console.error("Error uploading image to Cloudinary:", err);
          return res.status(500).send("Error uploading image");
        }

        // Get the URL of the uploaded image
        const uploadedImageUrl = result.secure_url;
        console.log("🚀 ~ uploadedImageUrl:", uploadedImageUrl);
        imageUrl1 = uploadedImageUrl;
      }
    );

    //fetch url based on citizenship number and rpp number
    const document = await Document.findOne({
      citizenshipNumber,
      rastriyaPrarichayaPatraNumber,
    });
    console.log("🚀 ~ compareImage ~ rppDocument:", rppDocument);
    if (!rppDocument) return res.sendStatus(404);

    // Extract base64 data from the image string
    const webcamBase64Data = webCamImage.replace(
      /^data:image\/jpeg;base64,/,
      ""
    );

    // Create a buffer from the base64 data
    const webCamBuffer = Buffer.from(webcamBase64Data, "base64");

    // Generate a unique filename or use a specific name if needed
    const fileName = `webcam_image_${Date.now()}.jpg`; // Example: webcam-image_1625040335863.jpg

    // Save the image to a file
    const filePath = path.join("uploads", fileName);
    fs.writeFile(filePath, webCamBuffer, (err) => {
      if (err) {
        console.error("Error saving image:", err);
        return res.status(500).send("Error saving image");
      }
    });

    const otherFilePath = rppDocument.filePath;
    const comparisionStatus = await compareFaces(filePath, otherFilePath);
    console.log(comparisionStatus);
  } catch (error) {
    console.error("Error saving document:", error);
    res.status(500).send({ msg: "Error saving document", error });
  }
};

module.exports = { uploadDocument, compareImage };
