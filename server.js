const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer"); // 用於檔案上傳
const nedb = require("nedb-promises");
const path = require("path"); // 確保只宣告一次
const cors = require("cors");

const app = express();
const PORT = 5500;

// 跨域支持
app.use(cors());

// 靜態資源目錄
app.use(express.static(path.join(__dirname, "web")));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// NeDB 資料庫設置
const ContactDB = nedb.create({ filename: "contact.db", autoload: true });

// Multer 設定 (用於處理檔案上傳)
const upload = multer({
    dest: path.join(__dirname, "uploads"), // 檔案儲存目錄
    limits: { fileSize: 10 * 1024 * 1024 }, // 最大檔案大小 (10MB)
});

// 表單提交路由
app.post("/contact", upload.single("file"), (req, res) => {
    console.log("接收到的數據：", req.body);
    console.log("接收到的檔案：", req.file);

    const { name, email, message } = req.body;
    const filePath = req.file ? req.file.path : null; // 檔案路徑

    if (!name || !email || !message) {
        return res.status(400).send("所有欄位為必填項目！");
    }

    ContactDB.insert({ name, email, message, filePath, timestamp: new Date() })
        .then(() => res.json({ success: true, message: "您的訊息已成功送出！" }))
        .catch(err => {
            console.error("儲存數據錯誤：", err.message);
            res.status(500).json({ success: false, message: "訊息儲存失敗，請稍後再試！" });
        });
});

// 查看聯絡資料路由
app.get("/viewContacts", (req, res) => {
    ContactDB.find({})
        .then(results => {
            if (results.length === 0) {
                return res.status(404).send("目前沒有聯絡資料！");
            }
            res.json({ success: true, data: results, message: "聯絡資料檢索成功！" });
        })
        .catch(err => {
            console.error("檢索資料時發生錯誤：", err.message);
            res.json({ success: false, message: "無法檢索資料，請稍後再試！", error: err.message });
        });
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`伺服器已啟動，請訪問 http://localhost:${PORT}`);
});
