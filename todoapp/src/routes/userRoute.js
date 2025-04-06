const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * 📌 API: Lấy thông tin người dùng
 * 🔹 Route: GET /api/users/profile
 * 🔹 Bảo vệ: Yêu cầu xác thực (JWT)
 */
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});

/**
 * 📌 API: Cập nhật thông tin cá nhân (chỉ cập nhật tên)
 * 🔹 Route: PUT /api/users/update-profile
 * 🔹 Bảo vệ: Yêu cầu xác thực (JWT)
 */
router.put("/update-profile", authMiddleware, async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) return res.status(400).json({ message: "Tên không được để trống!" });

        // Chuyển id về ObjectId
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const user = await User.findOne({ _id: userId });
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

        user.username = username;
        await user.save();

        res.json({ message: "Cập nhật tên thành công!", user });
    } catch (error) {
        console.error("❌ Lỗi cập nhật:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});


/**
 * 📌 API: Đổi mật khẩu
 * 🔹 Route: PUT /api/users/change-password
 * 🔹 Bảo vệ: Yêu cầu xác thực (JWT)
 */
router.put("/change-password", authMiddleware, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Mật khẩu cũ không đúng!" });

        // Mã hóa mật khẩu mới và cập nhật
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Đổi mật khẩu thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});

module.exports = router;
