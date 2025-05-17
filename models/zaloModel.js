// models/zaloModel.js
const fs = require("fs");
const { Zalo, MessageType, ThreadType } = require("zca-js");

const zaloConfig = {
  cookie: "_ga=GA1.2.1659441231.1744019390; _gid=GA1.2.1269685242.1744019390; _zlang=vn; zpsid=z_iS.431228409.2.DjSkFxetvtr3CbDajZVdVSz4bKc91jLFWWFNH17DjI2mntpokp57Zjqtvtq; zpw_sek=CR1w.431228409.a0.aCteqBq1u5T415HEd07WLyOZXJoVEy8k-N298TKpiYtQP85bt5M76F4kgItQFDrrmAeQ1U0B4Cmo0ERtJcRWLm; __zi=3000.SSZzejyD6zOgdh2mtnLQWYQN_RAG01ICFjIXe9fEM8WzcE-caKjQWtcTwAlPIboEVfJfgZCq.1; __zi-legacy=3000.SSZzejyD6zOgdh2mtnLQWYQN_RAG01ICFjIXe9fEM8WzcE-caKjQWtcTwAlPIboEVfJfgZCq.1; ozi=2000.QOBlzDCV2uGerkFzm09GsMNSv_J425JHBDxc-Om9Kjmhr-VuCpG.1; app.event.zalo.me=4979394212251693715; _gat=1; _ga_RYD7END4JE=GS1.2.1744019390.1.1.1744020044.60.0.0",
  imei: "46f81a98-1f21-40e2-965f-6698edb02a3c-33d0f257a817d1ca4c4381b87f8ad83f",
  userAgent:
      "Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.6788.76 Safari/537.36",
};

const zaloOptions = {
  selfListen: false,
  checkUpdate: true,
};

const zalo = new Zalo(zaloConfig, zaloOptions);

const loginToZalo = async () => {
  try {
    console.log("Đang đăng nhập vào Zalo...");
    const api = await zalo.login();
    console.log("Đăng nhập thành công!");
    return api;
  } catch (error) {
    console.error("Lỗi đăng nhập vào Zalo:", error);
    throw new Error("Không thể đăng nhập vào Zalo");
  }
};

const findUser = async (api, phone) => {
  console.log(`Đang tìm người dùng với số điện thoại: ${phone}`);
  return await api.findUser(phone);
};

const sendMessage = async (api, messageContent, recipientId, isGroup = false) => {
  try {
    const messageType = isGroup ? MessageType.GroupMessage : MessageType.Message;
    const result = await api.sendMessage(messageContent, recipientId, messageType);
    return result;
  } catch (error) {
    console.error("Lỗi gửi tin nhắn:", error);
    throw new Error("Không thể gửi tin nhắn");
  }
};


const sendSticker = async (api, stickerKeyword, recipientId, isGroup = false) => {
  try {
    console.log(`Đang tìm sticker với từ khóa: ${stickerKeyword}`);
    const stickerList = await api.getStickers(stickerKeyword);
    
    if (stickerList.length === 0) {
      throw new Error(`Không tìm thấy sticker nào với từ khóa "${stickerKeyword}"`);
    }
    
    console.log(`Tìm thấy ${stickerList.length} sticker(s) với từ khóa "${stickerKeyword}"`);
    
    // Chọn ngẫu nhiên một sticker từ danh sách
    const randomIndex = Math.floor(Math.random() * stickerList.length);
    const stickersDetail = await api.getStickersDetail(stickerList[randomIndex]);
    const stickerToSend = stickersDetail[0];
    
    const messageType = isGroup ? MessageType.GroupMessage : MessageType.Message;
    const result = await api.sendSticker(stickerToSend, recipientId, messageType);

    return {
      success: true,
      sticker: stickerToSend,
      result: result
    };
  } catch (error) {
    console.error("Lỗi khi gửi sticker:", error);
    throw new Error(`Gửi sticker thất bại: ${error.message}`);
  }
};


module.exports = {
  loginToZalo,
  findUser,
  sendMessage,
  sendSticker, 
}  
