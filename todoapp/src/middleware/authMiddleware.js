const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Không có token, quyền truy cập bị từ chối!" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin user vào request
        next();
    } catch (error) {
        res.status(401).json({ message: "Token không hợp lệ!" });
    }
};

module.exports = authMiddleware;
