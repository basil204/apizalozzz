// routes\apiDocs.js
const express = require("express");
const router = express.Router();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Cấu hình Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Zalo API",
      version: "1.0.0",
      description: "Tài liệu API cho hệ thống gửi tin nhắn qua Zalo",
    },
   
  },
  apis: ["./routes/*.js"], 
};

const specs = swaggerJsdoc(options);
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: `
      .topbar-wrapper::after { 
        content: ' | '; 
        font-size: 18px; 
      } 
      .topbar-wrapper::after { 
        content: 'Nhóm'; 
        font-size: 18px; 
        cursor: pointer; 
        color: #007bff; 
        margin-left: 10px; 
      }
      .topbar-wrapper::after:hover {
        text-decoration: underline;
      }
    `,
    customJs: `
      document.addEventListener("DOMContentLoaded", function() {
        let topbar = document.querySelector(".topbar-wrapper::after");
        if (topbar) {
          topbar.addEventListener("click", function() {
            window.location.href = "/groups";
          });
        }
      });
    `,
    customSiteTitle: "Zalo API Docs",
  }));
  
/**
 * @swagger
 * /send-user:
 *   post:
 *     summary: Gửi tin nhắn có hình ảnh đến người dùng qua Zalo
 *     tags: [Zalo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imagePath:
 *                 type: string
 *                 description: Đường dẫn ảnh cần gửi
 *               phone:
 *                 type: string
 *                 description: Số điện thoại người nhận
 *               msg:
 *                 type: string
 *                 description: Nội dung tin nhắn
 *     responses:
 *       200:
 *         description: Gửi tin nhắn thành công
 *       400:
 *         description: Thiếu thông tin cần thiết
 *       500:
 *         description: Lỗi khi gửi tin nhắn
 */
/**
 * @swagger
 * /send-group:
 *   post:
 *     summary: Gửi tin nhắn có hình ảnh đến nhóm Zalo
 *     tags: [Zalo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imagePath:
 *                 type: string
 *                 description: Đường dẫn ảnh cần gửi
 *               groupId:
 *                 type: string
 *                 description: ID của nhóm nhận tin nhắn
 *               msg:
 *                 type: string
 *                 description: Nội dung tin nhắn
 *     responses:
 *       200:
 *         description: Gửi tin nhắn thành công
 *       400:
 *         description: Thiếu thông tin cần thiết
 *       500:
 *         description: Lỗi khi gửi tin nhắn
 */

/**
 * @swagger
 * /allgroups:
 *   get:
 *     summary: Lấy danh sách tất cả các nhóm và thành viên
 *     tags: [Zalo]
 *     responses:
 *       200:
 *         description: Lấy danh sách nhóm thành công
 *       500:
 *         description: Lỗi khi lấy danh sách nhóm
 */
module.exports = router;
