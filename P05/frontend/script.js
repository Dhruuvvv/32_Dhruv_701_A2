const API = "http://localhost:5000";
let token = localStorage.getItem("token");

// Login
if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = "profile.html";
        } else {
            alert(data.msg);
        }
    });
}

// Profile
if (document.getElementById("profile")) {
    fetch(`${API}/employee/profile`, {
        headers: { "Authorization": token }
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById("profile").innerHTML = `
      <p>ID: ${data.empId}</p>
      <p>Name: ${data.name}</p>
      <p>Email: ${data.email}</p>
    `;
        });
}

// Leave
if (document.getElementById("leaveForm")) {
    document.getElementById("leaveForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const date = document.getElementById("date").value;
        const reason = document.getElementById("reason").value;

        await fetch(`${API}/leave/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ date, reason })
        });

        loadLeaves();
    });

    async function loadLeaves() {
        const res = await fetch(`${API}/leave/list`, {
            headers: { "Authorization": token }
        });
        const data = await res.json();
        document.getElementById("leaveList").innerHTML =
            data.map(l => `<li>${l.date} - ${l.reason} - ${l.grant}</li>`).join("");
    }

    loadLeaves();
}

// Logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}
