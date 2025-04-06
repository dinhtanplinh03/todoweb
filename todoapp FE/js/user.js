document.addEventListener("DOMContentLoaded", async () => {
    await loadUserProfile();
});

// 📌 Lấy thông tin người dùng từ API
async function loadUserProfile() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            window.location.href = "login.html";
            return;
        }

        console.log("Token gửi đi:", token); // 📌 Kiểm tra token trong Console

        const response = await fetch("http://localhost:5000/api/users/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Trạng thái API:", response.status); // 📌 Kiểm tra mã phản hồi

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Không thể lấy thông tin người dùng!");
        }

        const user = await response.json();
        console.log("Dữ liệu người dùng:", user); // 📌 Kiểm tra dữ liệu từ API

        // Cập nhật giao diện
        document.getElementById("user-name").textContent = user.username || "Chưa có tên";
        document.getElementById("user-email").textContent = user.email || "Không có email";
    } catch (error) {
        console.error("Lỗi:", error.message);
        alert(error.message);
    }
}

// Gọi hàm khi trang load
document.addEventListener("DOMContentLoaded", loadUserProfile);


// 📌 Cập nhật hồ sơ người dùng
document.getElementById("update-profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newName = document.getElementById("new-name").value.trim();

    if (!newName) {
        alert("Tên không được để trống!");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/users/update-profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ username: newName }) // Sửa từ name => username
        });

        const data = await response.json();
        if (response.ok) {
            alert("Cập nhật thành công!");
            loadUserProfile(); // Cập nhật lại thông tin trên giao diện
        } else {
            alert(data.message || "Lỗi khi cập nhật thông tin!");
        }
    } catch (error) {
        alert("Lỗi kết nối đến server!");
    }
});

// 📌 Đổi mật khẩu người dùng
document.getElementById("change-password-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const oldPassword = document.getElementById("old-password").value;
    const newPassword = document.getElementById("new-password").value;

    if (!oldPassword || !newPassword) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/users/change-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ oldPassword, newPassword })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Đổi mật khẩu thành công!");
        } else {
            alert(data.message || "Lỗi khi đổi mật khẩu!");
        }
    } catch (error) {
        alert("Lỗi kết nối đến server!");
    }
});

// 📌 Đăng xuất người dùng
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}
