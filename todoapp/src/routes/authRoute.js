const express = require("express");
const User = require("../models/User");
const { hashPassword, comparePassword, generateToken } = require("../services/authService");

const router = express.Router();

// Đăng ký người dùng
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "Email đã được sử dụng!" });

        const hashedPassword = await hashPassword(password);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        console.error("Lỗi đăng ký:", error.message);
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
});


// Đăng nhập người dùng
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm user trong database
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

        // Kiểm tra mật khẩu
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Mật khẩu không đúng!" });

        // Tạo token
        const token = generateToken(user._id);

        res.json({ message: "Đăng nhập thành công!", token });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});

module.exports = router;
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại!" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});