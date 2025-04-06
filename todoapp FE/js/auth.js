const API_URL = "http://localhost:5000/api/auth";

// 📌 Xử lý đăng nhập
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
    } else {
        alert(data.message);
    }
});

// 📌 Xử lý đăng ký
document.getElementById("register-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim(); // Đảm bảo không có dấu cách thừa
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Kiểm tra dữ liệu trước khi gửi
    console.log("Dữ liệu gửi đi:", { username, email, password });

    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }) // Đảm bảo gửi đúng `username`
    });

    const data = await res.json();
    if (res.ok) {
        alert("🎉 Đăng ký thành công! Chuyển đến trang đăng nhập.");
        window.location.href = "login.html";
    } else {
        alert(`❌ Đăng ký thất bại: ${data.message}`);
    }
});



// 📌 Đăng xuất
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}
