const form = document.getElementById("resetForm");
const toast = document.getElementById("toast");

// Obtener token desde la URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validación de contraseña en frontend
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!regex.test(newPassword)) {
    return showToast("La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula y número ❌");
  }

  if (newPassword !== confirmPassword) {
    return showToast("Las contraseñas no coinciden ❌");
  }

  try {
    const res = await fetch("http://localhost:5100/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword, confirmPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      showToast("Contraseña actualizada ✅");
      setTimeout(() => (window.location.href = "login.html"), 500);
    } else {
      showToast(data.error || "Enlace inválido o caducado ❌");
    }
  } catch (err) {
    showToast("Error de conexión ❌");
  }
});

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 4000);
}
