// app.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios"); // thêm axios để gọi API nội bộ
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const PORT = 8080;
const apiDocs = require("./routes/apiDocs");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(express.json());
app.use(apiDocs);
app.use("/api", messageRoutes);

// Route hiển thị danh sách nhóm và thành viên
app.get("/groups", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:3030/api/allgroups");
        const data = response.data.groupInfos;
        res.render("groups", { groups: data });
    } catch (error) {
        res.status(500).send("Lỗi khi lấy dữ liệu nhóm");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
