const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) {
    alert("Bạn chưa đăng nhập! Vui lòng đăng nhập lại.");
    window.location.href = "login.html";
}

// 🟢 Xem thông tin hồ sơ (profile)
async function viewProfile() {
    const res = await fetch(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
        alert("Không thể tải hồ sơ. Vui lòng thử lại!");
        return;
    }

    const user = await res.json();
    alert(`👤 Hồ Sơ:\nTên: ${user.username}\nEmail: ${user.email}`);
}

// 🟢 Đăng xuất
function logout() {
    localStorage.removeItem("token");
    alert("Bạn đã đăng xuất!");
    window.location.href = "login.html";
}

// 🟢 Load công việc
async function loadTasks() {
    const res = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
        alert("Không thể tải danh sách công việc.");
        return;
    }

    const tasks = await res.json();
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        const deadlineFormatted = new Date(task.deadline).toLocaleString(); // Định dạng deadline
        li.innerHTML = `
            <span>${task.title} - ${deadlineFormatted} - ${task.completed ? "✔ Hoàn thành" : "⏳ Chưa xong"}</span>
            <button onclick="editTask('${task._id}', '${task.title}', '${task.deadline}')">✏ Sửa</button>
            <button onclick="deleteTask('${task._id}')">🗑 Xóa</button>
            <button onclick="toggleTask('${task._id}', ${task.completed})">${task.completed ? "↩ Chưa hoàn thành" : "✅ Hoàn thành"}</button>
        `;
        taskList.appendChild(li);
    });
}


// 🟢 Thêm công việc
document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const deadline = document.getElementById('task-deadline').value; // Lấy giá trị date-time

    try {
        await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, deadline }) // Gửi cả ngày và giờ
        });
        loadTasks(); // Gọi loadTasks() thay vì fetchTasks()
    } catch (error) {
        console.error('Lỗi khi thêm công việc:', error);
    }
});



// 🟢 Chỉnh sửa công việc (Cập nhật cả tên và deadline)
async function editTask(id, currentTitle, currentDeadline) {
    const newTitle = prompt("Nhập tên công việc mới:", currentTitle);
    if (!newTitle) return;

    const newDeadline = prompt("Nhập deadline mới (YYYY-MM-DD):", currentDeadline);
    if (!newDeadline) return;

    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newTitle, deadline: newDeadline }) // Gửi cả deadline
    });

    if (res.ok) {
        alert("✏ Công việc đã được cập nhật!");
        loadTasks();
    } else {
        alert("❌ Lỗi khi cập nhật!");
    }
}


// 🟢 Xóa công việc
async function deleteTask(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa?")) return;

    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
        alert("🗑 Công việc đã bị xóa!");
        loadTasks();
    } else {
        alert("❌ Lỗi khi xóa!");
    }
}

// 🟢 Hoàn thành / Bỏ hoàn thành công việc
async function toggleTask(id, currentStatus) {
    try {
        const res = await fetch(`${API_URL}/tasks/${id}/toggle`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status: currentStatus ? "pending" : "completed" }) // Đảo trạng thái
        });

        const data = await res.json();
        console.log("Dữ liệu từ server:", data);

        if (res.ok) {
            alert(data.completed ? "✅ Công việc đã hoàn thành!" : "↩ Công việc chưa hoàn thành!");
            loadTasks();
        } else {
            alert("❌ Lỗi khi cập nhật trạng thái!");
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
    }

    // Tải danh sách công việc khi trang load
    loadTasks();
}
