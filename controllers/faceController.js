const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const faceRecognition = async (req, res) => {
  try {
    const { imageSrc } = req.body;
    console.log(imageSrc)
    if (!imageSrc) {
        return res.status(400).json({ message: 'No image provided' });
      }
  
      // Generate a unique filename
      const filename = `${uuidv4()}.jpeg`;
  
      // Convert Base64 to binary buffer
      const base64Data = imageSrc.replace(/^data:image\/jpeg;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
  
      // Define the path to save the image
      const filepath = path.join(__dirname, 'uploads', filename);
  
      // Save the image file
      fs.writeFileSync(filepath, buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports={faceRecognition}