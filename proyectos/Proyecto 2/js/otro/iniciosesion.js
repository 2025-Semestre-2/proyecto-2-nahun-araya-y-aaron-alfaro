// Mostrar O ocultar contraseña
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', 
        function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        
            // Cambiar icono
            const icon = this.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    );
}

const API_BASE = "http://localhost:3001";

// submit
document.querySelector(".login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim(); // email o +50663084229
  const password = document.getElementById("password").value.trim();

  if (!username) return alert("Ingresa tu correo o teléfono");
  if (!password) return alert("Ingresa tu contraseña");

  try {
    const resp = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await resp.json();

    if (!data.ok) return alert(data.error || "Login falló");

    // guardar sesión básica
    localStorage.setItem("role", data.role);
    if (data.role === "admin") localStorage.setItem("idAdmin", data.idAdmin);
    if (data.role === "cliente") localStorage.setItem("idCliente", data.idCliente);

    // redirecciones según tu UI
    if (data.role === "admin") {
      window.location.href = "/html/anfitrion/indexAnfitrion.html";
      console.log('admin')
    } else {
      window.location.href = "index.html"; // o tu home cliente
    }
  } catch (err) {
    console.error(err);
    alert("Error conectando con el servidor");
  }
});


// Funcionalidad para botones sociales
document.querySelectorAll('.btn-social').forEach(button => {
    button.addEventListener('click', function() {
        const provider = this.classList[2]; // btn-google, btn-apple, etc.
        const providerName = provider.replace('btn-', '').charAt(0).toUpperCase() + provider.slice(4);
        
        alert(`Iniciando sesión con ${providerName}... (simulado)`);
        
        // Aquí iría la integración real con OAuth
    });
});