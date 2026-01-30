const mostrarMensaje = (mensaje, tipo = 'error', tiempo = 3000) => {
    const div = document.createElement('div');
    div.className = tipo === 'error' ? 'mensaje-error' : 'mensaje-exito';
    div.innerHTML = `
        <i class="fas ${tipo === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
        <span>${mensaje}</span>
    `;
    document.body.appendChild(div);

    setTimeout(() => {
        div.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => div.remove(), 300);
    }, tiempo);
};

const mostrarError = msg => mostrarMensaje(msg, 'error', 5000);
const mostrarExito = msg => mostrarMensaje(msg, 'exito', 3000);

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

// Validación de formulario
const loginForm = document.querySelector('.login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Validaciones básicas
        if (!username) {
            mostrarMensaje('Por favor ingresa tu email o número telefónico','error',5000);
            return;
        }
        
        if (!password) {
            mostrarMensaje('Por favor ingresa tu contraseña','error',5000);
            return;
        }
        
        // Aqui falta la logica de Base de datos

        console.log('Iniciando sesión...');
        console.log('Usuario:', username);
        console.log('Contraseña:', password);
        
        // Simular login exitoso
        const submitBtn = this.querySelector('.btn-primary');
        const originalText = submitBtn.querySelector('span').textContent;
        
        submitBtn.querySelector('span').textContent = 'Iniciando sesión...';
        submitBtn.disabled = true;

        window,location.href = "index.html"
        
        setTimeout(() => {
            mostrarMensaje('¡Login exitoso! (simulado)','exito',3000);
            submitBtn.querySelector('span').textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Funcionalidad para botones sociales
document.querySelectorAll('.btn-social').forEach(button => {
    button.addEventListener('click', function() {
        const provider = this.classList[2]; // btn-google, btn-apple, etc.
        const providerName = provider.replace('btn-', '').charAt(0).toUpperCase() + provider.slice(4);
        
        alert(`Iniciando sesión con ${providerName}... (simulado)`);
        
        // Aquí iría la integración real con OAuth
    });
});