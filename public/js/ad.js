
const fc = {
    apiKey: "AIzaSyASGjoeQujVnWaTO3w0M2HwmhR82ocV_CA",
    authDomain: "accor-growth-fund-e14e3.firebaseapp.com",
    projectId: "accor-growth-fund-e14e3",
    storageBucket: "accor-growth-fund-e14e3.appspot.com",
    messagingSenderId: "620527454055",
    appId: "1:620527454055:web:f2ec9499ebc3f8a694d1c2",
    measurementId: "G-4H37EDZ8M9"
};

const app = firebase.initializeApp(fc);
const auth = firebase.auth();
const loginBtn = document.getElementById("login-admin");

if (loginBtn) {
    loginBtn.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (!username || !password) {
            Toastify({
                text: "Please enter username and password",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#FF9800"
            }).showToast();
            return;
        }

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();


            if (data.statusCode === 200) {
                // ✅ Encrypt & Save token
                const userCred = await auth.signInWithEmailAndPassword(username, password);

                const token = await userCred.user.getIdToken();

                await saveTokenToCookie(token);

                Toastify({
                    text: data?.message || "Login successful",
                    duration: 2000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#4CAF50"
                }).showToast();

                // ✅ Redirect after 2s
                setTimeout(() => {
                    window.location.href = "aDash.html";
                }, 2000);
            } else {
                Toastify({
                    text: data?.message || "Login failed",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#FF5252"
                }).showToast();
            }
        } catch (err) {
            Toastify({
                text: "Something went wrong. Please try again.",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#FF5252"
            }).showToast();
            console.error("Login error:", err);
        }
    });
}


function setCookie(name, value, days = 1) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; Secure; SameSite=Strict`;
}


function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
// ttt
async function saveTokenToCookie(encryptedToken) {
    setCookie("a", encryptedToken, 1); // ✅ no JSON.stringify
}

