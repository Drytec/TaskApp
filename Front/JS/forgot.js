const forgotForm = document.getElementById("forgotForm");
const emailInput = document.getElementById("email");
const sendBtn = document.getElementById("sendBtn");
const spinner = document.getElementById("spinner");
const toast = document.getElementById("toast");

forgotForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission

  const email = emailInput.value.trim();

  if (!email) {
    return showToast("Por favor, ingresa tu correo electrónico ❌");
  }

  // Disable button and show spinner
  sendBtn.disabled = true;
  spinner.classList.remove("hidden");
  toast.classList.remove("visible"); // Hide any previous toast

  try {
    const response = await fetch("/api/recover-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    // Simulate network delay for a better user experience (optional)
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    if (response.ok || response.status === 202) { // Backend returns 202 even if email not found
      showToast("Si existe una cuenta con ese correo, se ha enviado un enlace de recuperación. ✅");
    } else {
      // For any other unexpected error from the server
      const errorData = await response.json();
      showToast(`Error: ${errorData.error || "Inténtalo de nuevo más tarde"} ❌`);
    }
  } catch (err) {
    console.error("Error during password recovery request:", err);
    showToast("Error de conexión. Por favor, verifica tu internet o inténtalo más tarde ❌");
  } finally {
    // Re-enable button and hide spinner
    sendBtn.disabled = false;
    spinner.classList.add("hidden");
  }
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => {
    toast.classList.remove("visible");
  }, 5000); // Toast visible for 5 seconds
}