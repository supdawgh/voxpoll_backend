const Document = require("../model/RastriyaParichayaPatra");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const Candidate = require("../model/Candidate");
const User = require("../model/User");
// Require the Cloudinary library
const cloudinary = require("cloudinary").v2;

//set cloudinary config section
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function compareFaces(url1, url2) {
  console.log("🚀 ~ compareFaces ~ url1:", url1);
  console.log("🚀 ~ compareFaces ~ url2:", url2);

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
    return { match: false };
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
  const {
    citizenshipNumber,
    rastriyaPrarichayaPatraNumber,
    webCamImage,
    candidate,
    voter,
  } = req.body;
  try {
    if (!webCamImage) {
      return res.status(400).send({ msg: "No image data received!" });
    }

    let imageUrl1, imageUrl2;
    let uploadedImageUrl;
    // Upload image to Cloudinary
    await cloudinary.uploader.upload(
      webCamImage,
      { folder: "Voxpoll" },
      async (err, result) => {
        if (err) {
          console.error("Error uploading image to Cloudinary:", err);
          return res.status(500).send("Error uploading image");
        }

        // Get the URL of the uploaded image
        uploadedImageUrl = result.secure_url;
        console.log("🚀 ~ uploadedImageUrl:", uploadedImageUrl);
        imageUrl1 = uploadedImageUrl;
      }
    );

    //fetch url based on citizenship number and rpp number
    const document = await Document.findOne({
      citizenshipNumber,
      rastriyaPrarichayaPatraNumber,
    });
    if (!document) {
      return res.status(401).send({ msg: "No image data received!" });
    }
    imageUrl2 = document.imageUrl;
    console.log("🚀 ~ compareImage ~ document:", document);

    const response = await compareFaces(imageUrl1, imageUrl2);
    if (response.match === true) {
      console.log("🚀 ~ compareImage ~ candidate:", candidate);
      const can = await Candidate.findOneAndUpdate(
        { _id: candidate },
        { $inc: { voteCount: 1 } },
        { new: true }
      );
      console.log("🚀 ~ compareImage ~ can:", can);

      const usr = await User.findOneAndUpdate(
        { _id: voter },
        { $push: { votes: can._id, votedEvents: can.eventId } }
      );
      res.status(201).json({
        message: "Vote Success",
      });
    } else {
      res.status(401).json({
        message: "Could not verify face",
      });
    }
  } catch (error) {
    console.error("Error saving document:", error);
    res.status(500).send({ msg: "Error saving document", error });
  }
};

module.exports = { uploadDocument, compareImage };
