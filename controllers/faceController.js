const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { spawn } = require("child_process");

const faceRecognition = async (req, res) => {
  try {
    // Access uploaded files from req.files
    const file1 = req.files.file1;
    const file2 = req.files.file2;

    // Define paths for temporary storage
    const tempPath1 = path.join(__dirname, "uploads", file1.name);
    const tempPath2 = path.join(__dirname, "uploads", file2.name);

    // Move files to the uploads directory
    await promisify(file1.mv)(tempPath1);
    await promisify(file2.mv)(tempPath2);

    // Function to read image files and return buffers
    const readImage = async (imagePath) => {
      try {
        const buffer = await promisify(fs.readFile)(imagePath);
        return buffer;
      } catch (error) {
        console.error("Error reading image file:", error);
        throw error;
      }
    };

    // Read images as buffers
    const imageBuffer1 = await readImage(tempPath1);
    const imageBuffer2 = await readImage(tempPath2);

    // Face comparison logic using a Python script with subprocess
    const pythonScriptPath = path.join(__dirname, "compare_faces.py");
    const pythonProcess = spawn(
      "python",
      [pythonScriptPath, tempPath1, tempPath2],
      {
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer size (adjust as needed)
      }
    );

    pythonProcess.stdout.on("data", (data) => {
      const result = JSON.parse(data.toString());
      res.json(result);
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Error from Python script: ${data.toString()}`);
      res.status(500).json({ error: "Internal server error" });
    });

    pythonProcess.on("exit", (code) => {
      console.log(`Python process exited with code ${code}`);
      // Cleanup: Delete temporary files
      fs.unlinkSync(tempPath1);
      fs.unlinkSync(tempPath2);
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { faceRecognition };
