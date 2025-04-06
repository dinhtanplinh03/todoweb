const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Lấy danh sách công việc (có hỗ trợ lọc theo trạng thái)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const { status } = req.query; // Lấy trạng thái từ query string
        let filter = { userId: req.user.id };

        if (status) {
            filter.status = status; // Lọc theo trạng thái nếu có
        }

        const tasks = await Task.find(filter);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// Lọc công việc đã quá hạn
router.get("/overdue", authMiddleware, async (req, res) => {
    try {
        const now = new Date();
        const overdueTasks = await Task.find({
            userId: req.user.id,
            deadline: { $lt: now }, // Lọc công việc có deadline nhỏ hơn thời gian hiện tại
            status: "pending"
        });

        res.json(overdueTasks);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});



// Thêm công việc mới
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description, deadline } = req.body;

        const newTask = new Task({
            userId: req.user.id,
            title,
            description,
            deadline
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});


// Cập nhật công việc
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { title, description, status, deadline } = req.body;

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { title, description, status, deadline },
            { new: true }
        );

        if (!task) return res.status(404).json({ message: "Công việc không tồn tại!" });

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});


// Xóa công việc
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!task) return res.status(404).json({ message: "Công việc không tồn tại!" });

        res.json({ message: "Đã xóa công việc!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// 🟢 Đánh dấu hoàn thành / chưa hoàn thành công việc
router.patch("/:id/toggle", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
        if (!task) return res.status(404).json({ message: "Công việc không tồn tại!" });

        task.completed = !task.completed; // Đảo trạng thái
        await task.save(); // Lưu vào MongoDB

        res.json({
            message: "Cập nhật trạng thái thành công!",
            completed: task.completed
        });
    } catch (error) {
        console.error("Lỗi cập nhật trạng thái:", error.message);
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
});

module.exports = router;