// routes\messageRoutes.js
const express = require("express");
const { loginToZalo, findUser, sendMessage, sendSticker } = require("../models/zaloModel");
const { saveImage } = require("../models/messageModel");

const router = express.Router();
router.post("/send-sticker", async (req, res) => {
  const { stickerKeyword, threadId, isGroup } = req.body;

  if (!stickerKeyword || !threadId) {
    return res.status(400).json({ error: "Vui lòng cung cấp từ khóa sticker và threadId" });
  }

  try {
    const api = await loginToZalo();
    
    // Gửi sticker
    const sendResult = await sendSticker(api, stickerKeyword, threadId, isGroup);

    res.status(200).json({
      message: "Gửi sticker thành công!",
      sendResult,
    });
  } catch (error) {
    console.error("Lỗi khi gửi sticker:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi gửi sticker.",
      error: error.message,
    });
  }
});
router.post("/user-info", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      error: "Vui lòng cung cấp số điện thoại.",
    });
  }

  try {
    const api = await loginToZalo();
    const user = await findUser(api, phone);

    if (!user || !user.uid) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng với số điện thoại đã cung cấp.",
      });
    }

    res.status(200).json({
      message: "Lấy thông tin người dùng thành công.",
      user,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi lấy thông tin người dùng.",
      error: error.message,
    });
  }
});

router.post("/send-member-v2", async (req, res) => {
  const { imagePath, phone, msg, stickerKeyword, numbersticker } = req.body;

  if (!phone || !msg) {
    return res.status(400).json({
      error: "Vui lòng cung cấp số điện thoại và nội dung tin nhắn.",
    });
  }

  try {
    const api = await loginToZalo();

    const user = await findUser(api, phone);
    if (!user || !user.uid) {
      return res.status(404).json({ error: "Không tìm thấy người dùng với số điện thoại đã cung cấp." });
    }

    const userId = user.uid;

    let imagePathToSave;
    let messagePayload = { msg };

    if (imagePath) {
      imagePathToSave = await saveImage(imagePath);
      messagePayload.attachments = [imagePathToSave];
    }

    const messageResult = await sendMessage(api, messagePayload, userId, false); // false = DirectMessage

    const stickerResults = [];
    if (stickerKeyword && numbersticker && numbersticker > 0) {
      for (let i = 0; i < numbersticker; i++) {
        const stickerResult = await sendSticker(api, stickerKeyword, userId, false);
        stickerResults.push(stickerResult);
      }
    }

    res.status(200).json({
      message: `Gửi tin nhắn đến người dùng ${phone} thành công!`,
      imagePath: imagePathToSave,
      messageResult,
      stickerResults,
    });
  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn đến người dùng:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi gửi tin nhắn.",
      error: error.message,
    });
  }
});

router.post("/send-group-v2", async (req, res) => {
  const { imagePath, groupId, msg, stickerKeyword, numbersticker } = req.body;

  if (!groupId || !msg) {
    return res.status(400).json({
      error: "Vui lòng cung cấp groupId và nội dung tin nhắn.",
    });
  }

  try {
    const api = await loginToZalo();

    let imagePathToSave;
    let messagePayload = { msg };

    // Nếu có ảnh thì xử lý lưu ảnh và thêm vào payload
    if (imagePath) {
      imagePathToSave = await saveImage(imagePath);
      messagePayload.attachments = [imagePathToSave];
    }

    // Gửi tin nhắn (văn bản hoặc văn bản + ảnh)
    const messageResult = await sendMessage(
      api,
      messagePayload,
      groupId,
      true
    );

    // Gửi sticker nếu có yêu cầu
    const stickerResults = [];
    if (stickerKeyword && numbersticker && numbersticker > 0) {
      for (let i = 0; i < numbersticker; i++) {
        const stickerResult = await sendSticker(api, stickerKeyword, groupId, true);
        stickerResults.push(stickerResult);
      }
    }

    res.status(200).json({
      message: `Gửi tin nhắn${imagePath ? " kèm ảnh" : ""}${stickerResults.length > 0 ? ` và ${stickerResults.length} sticker` : ""} đến nhóm thành công!`,
      imagePath: imagePathToSave,
      messageResult,
      stickerResults,
    });
  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn nhóm:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi gửi tin nhắn đến nhóm.",
      error: error.message,
    });
  }
});
router.get("/allgroups", async (req, res) => {
  try {
    const api = await loginToZalo();
    const groups = await api.getAllGroups();
 console.log(groups);
    const groupIds = Object.keys(groups.gridVerMap);
    const groupInfos = [];

    for (const groupId of groupIds) {
      const groupDetail = await api.getGroupInfo(groupId);
      console.log(groupDetail);
      const gridInfo = groupDetail.gridInfoMap[groupId];

      groupInfos.push({
        groupId,
        groupName: gridInfo.name,
        totalMember: gridInfo.totalMember,
      
      });
    }

    res.status(200).json({
      message: "Lấy danh sách nhóm thành công.",
      groupInfos,
    });
  } catch (error) {
    res.status(500).json({
      message: "Đã xảy ra lỗi khi lấy danh sách nhóm.",
      error: error.message,
    });
  }
});


module.exports = router;
// Đoạn mã này định nghĩa các route cho việc gửi tin nhắn và sticker qua Zalo API.
// Nó bao gồm các route để gửi tin nhắn đến người dùng cá nhân và nhóm, cũng như lấy thông tin người dùng.
// Các route này sử dụng các hàm từ zaloModel để thực hiện các thao tác cụ thể.
// Các route này cũng xử lý các lỗi có thể xảy ra và trả về phản hồi thích hợp cho client.  