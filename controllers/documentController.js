const Document = require("../model/RastriyaParichayaPatra");
const fs = require("fs");
const path = require("path");

async function compareFaces(imagePath1, imagePath2) {
  try {
    const form = new FormData();
    form.append("file1", fs.createReadStream(imagePath1));
    form.append("file2", fs.createReadStream(imagePath2));

    const response = await axios.post(
      "http://127.0.0.1:8000/compare-faces/",
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      }
    );

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

    // Extract base64 data from the image string
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");

    // Create a buffer from the base64 data
    const buffer = Buffer.from(base64Data, "base64");
    console.log("🚀 ~ uploadDocument ~ buffer:", buffer);

    // Generate a unique filename or use a specific name if needed
    const fileName = `RPP_${Date.now()}.jpg`; // Example: webcam-image_1625040335863.jpg

    console.log("🚀 ~ uploadDocument ~ fileName:", fileName);
    // Save the image to a file
    const filePath = path.join("uploads", fileName);
    console.log("🚀 ~ uploadDocument ~ filePath:", filePath);
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        console.error("Error saving image:", err);
        return res.status(500).send("Error saving image");
      }
    });
    // Save information to MongoDB after saving image

    const newDocument = await Document.create({
      fileName,
      filePath,
      citizenshipNumber,
      rastriyaPrarichayaPatraNumber,
      // Add more fields here if needed
    });
    console.log("🚀 ~ fs.writeFile ~ newDocument:", newDocument);

    // If saving to MongoDB succeeds, send a success response
    return res
      .status(201)
      .json({ message: "Image uploaded successfully", filePath });
  } catch (error) {
    console.error("Error saving document:", error);
    res.status(500).send({ msg: "Error saving document", error });
  }
};

const compareImage = async (req, res) => {
  try {
    const { citizenshipNumber, rastriyaPrarichayaPatraNumber, webCamImage } =
      req.body;
    console.log("🚀 ~ compareImage ~ citizenshipNumber:", citizenshipNumber);
    console.log(
      "🚀 ~ compareImage ~ rastriyaPrarichayaPatraNumber:",
      rastriyaPrarichayaPatraNumber
    );
    console.log("🚀 ~ compareImage ~ image:", webCamImage);

    if (!webCamImage) {
      return res.status(400).send("No image provided");
    }
    //search the document based on citizenshipNumber, rastriyaPrarichayaPatraNumber,
    const rppDocument = await Document.findOne({
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
