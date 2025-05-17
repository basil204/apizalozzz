//models\messageModel.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const saveImage = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    // Xác định phần mở rộng từ URL
    const extension = path.extname(imageUrl).split("?")[0] || ".jpg";
    const imagePathToSave = path.join(__dirname, "..", "data", `image${extension}`);

    fs.writeFileSync(imagePathToSave, response.data);

    return imagePathToSave;
  } catch (error) {
    throw new Error("Không thể tải ảnh: " + error.message);
  }
};

module.exports = { saveImage };
