document.getElementById("login-btn").addEventListener("click", () => {
  window.location.href = "/auth/google"; // redirige al flujo de Google
});

document.getElementById("logout-btn").addEventListener("click", () => {
  fetch("/logout")
    .then(() => location.reload());
});

// (Opcional) puedes hacer una llamada para saber si el usuario está autenticado
window.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("/api/userinfo");
  if (res.ok) {
    const user = await res.json();
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("user-info").style.display = "block";
    document.getElementById("user-name").textContent = user.name;
    document.getElementById("user-email").textContent = user.email;
    document.getElementById("user-pic").src = user.picture;
  }
});
