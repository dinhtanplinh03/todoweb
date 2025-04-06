const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false }, // 🟢 Sử dụng Boolean thay vì String
    deadline: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
