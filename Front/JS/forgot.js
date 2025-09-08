const form = document.getElementById("forgotForm");
const spinner = document.getElementById("spinner");
const toast = document.getElementById("toast");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();

  if (!email) {
    return showToast("Por favor ingresa tu correo electrónico ❌");
  }

  spinner.classList.remove("hidden");

  try {
    const res = await fetch("http://localhost:3000/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    // Simulamos spinner máximo 2 segundos
    setTimeout(async () => {
      spinner.classList.add("hidden");

      if (res.ok) {
        showToast("Revisa tu correo para continuar ✅");
      } else {
        showToast("Inténtalo de nuevo más tarde ❌");
      }
    }, 2000);
  } catch (err) {
    spinner.classList.add("hidden");
    showToast("Error de conexión ❌");
  }
});

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 4000);
}
