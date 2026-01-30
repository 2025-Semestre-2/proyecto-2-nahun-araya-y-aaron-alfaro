const countries = [
    { code: "mx", name: "México", phoneCode: "+52", maxDigits: 10 },
    { code: "us", name: "Estados Unidos", phoneCode: "+1", maxDigits: 10 },
    { code: "es", name: "España", phoneCode: "+34", maxDigits: 9 },
    { code: "ar", name: "Argentina", phoneCode: "+54", maxDigits: 10 },
    { code: "co", name: "Colombia", phoneCode: "+57", maxDigits: 10 },
    { code: "pe", name: "Perú", phoneCode: "+51", maxDigits: 9 },
    { code: "cl", name: "Chile", phoneCode: "+56", maxDigits: 9 },
    { code: "br", name: "Brasil", phoneCode: "+55", maxDigits: 11 },
    { code: "fr", name: "Francia", phoneCode: "+33", maxDigits: 9 },
    { code: "de", name: "Alemania", phoneCode: "+49", maxDigits: 10 },
    { code: "it", name: "Italia", phoneCode: "+39", maxDigits: 10 },
    { code: "gb", name: "Reino Unido", phoneCode: "+44", maxDigits: 10 },
    { code: "jp", name: "Japón", phoneCode: "+81", maxDigits: 10 },
    { code: "cn", name: "China", phoneCode: "+86", maxDigits: 11 },
    { code: "ru", name: "Rusia", phoneCode: "+7", maxDigits: 10 },
    { code: "in", name: "India", phoneCode: "+91", maxDigits: 10 },
    { code: "au", name: "Australia", phoneCode: "+61", maxDigits: 9 },
    { code: "ca", name: "Canadá", phoneCode: "+1", maxDigits: 10 },
    { code: "kr", name: "Corea del Sur", phoneCode: "+82", maxDigits: 9 },
    { code: "za", name: "Sudáfrica", phoneCode: "+27", maxDigits: 9 },
    { code: "cr", name: "Costa Rica", phoneCode: "+506", maxDigits: 8 }
];

let currentCountry = countries.find(c => c.code === 'cr');

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

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarTelefono(telefono, maxDigits) {
    const limpio = telefono.replace(/\s/g, '');

    if (!/^\d+$/.test(limpio)) {
        return { valido: false, mensaje: "El teléfono solo debe contener números" };
    }

    if (limpio.length !== maxDigits) {
        return { valido: false, mensaje: `El teléfono debe tener ${maxDigits} dígitos` };
    }

    return { valido: true };
}

function validarContrasenas() {
    const pass1 = document.getElementById('contrasena');
    const pass2 = document.getElementById('confirmarContrasena');
    
    if (!pass1 || !pass2) return false;
    
    const valor1 = pass1.value.trim();
    const valor2 = pass2.value.trim();
    
    if (!valor1 || !valor2) {
        return false;
    }
    
    if (valor1.length < 8) {
        return false;
    }

    return valor1 === valor2;
}

function mostrarErrorContrasenas(pass1, pass2, mensaje) {
    if (pass1) {
        mostrarErrorCampo(pass1, mensaje);
    }
    if (pass2) {
        mostrarErrorCampo(pass2, mensaje);
    }
}

function initPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (!input || !icon) return;
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

function setupFormValidation() {
    const form = document.getElementById('register-form');
    if (!form) return;
    const campos = form.querySelectorAll('[required]');
    campos.forEach(campo => {
        campo.addEventListener('blur', function() {
            validarCampo(this);
        });
        campo.addEventListener('input', function() {
            limpiarError(this);
            if (this.id === 'confirmarContrasena') {
                const pass1 = document.getElementById('contrasena');
                if (pass1 && pass1.value && this.value) {
                    validarCoincidenciaContrasenas();
                }
            }
        });
    });

    const pass1 = document.getElementById('contrasena');
    if (pass1) {
        pass1.addEventListener('input', function() {
            const pass2 = document.getElementById('confirmarContrasena');
            if (pass2 && pass2.value) {
                validarCoincidenciaContrasenas();
            }
        });
    }
}

function validarCoincidenciaContrasenas() {
    const pass1 = document.getElementById('contrasena');
    const pass2 = document.getElementById('confirmarContrasena');
    
    if (!pass1 || !pass2) return;
    
    const valor1 = pass1.value.trim();
    const valor2 = pass2.value.trim();

    if (!valor1 || !valor2) return;
    
    if (valor1 !== valor2) {
        mostrarErrorCampo(pass2, 'Las contraseñas no coinciden');
        return false;
    } else {
        limpiarError(pass2);
        return true;
    }
}

function validarCampo(campo) {
    const valor = campo.value.trim();
    let error = '';
    
    if (campo.hasAttribute('required') && !valor) {
        error = campo.getAttribute('data-error') || 'Este campo es requerido';
    } 

    else if (campo.type === 'email' && valor && !validarEmail(valor)) {
        error = 'Por favor ingrese un correo electrónico válido';
    } 
    else if (campo.id === 'contrasena' && valor && valor.length < 8) {
        error = 'La contraseña debe tener al menos 8 caracteres';
    } 
    else if (campo.id === 'telefono' && valor) {
        const telValidation = validarTelefono(valor.replace(/\s/g, ''), currentCountry.maxDigits);
        if (!telValidation.valido) {
            error = telValidation.mensaje;
        }
    }

    else if (campo.id === 'confirmarContrasena' && valor) {
        const pass1 = document.getElementById('contrasena');
        if (pass1 && pass1.value.trim() && valor !== pass1.value.trim()) {
            error = 'Las contraseñas no coinciden';
        }
    }
    
    if (error) {
        mostrarErrorCampo(campo, error);
        return false;
    } else {
        mostrarExitoCampo(campo);
        return true;
    }
}

function mostrarErrorCampo(campo, mensaje) {
    campo.classList.add('field-error');
    campo.classList.remove('field-success');
    
    let contenedor = campo.parentNode;
    if (contenedor.classList.contains('password-input')) {
        contenedor = contenedor.parentNode;
    }
    
    let errorDiv = contenedor.querySelector('.validation-message.error');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'validation-message error';
        contenedor.appendChild(errorDiv);
    }
    
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
}

function mostrarExitoCampo(campo) {
    campo.classList.add('field-success');
    campo.classList.remove('field-error');
    
    let contenedor = campo.parentNode;
    if (contenedor.classList.contains('password-input')) {
        contenedor = contenedor.parentNode;
    }
    
    const errorDiv = contenedor.querySelector('.validation-message.error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

function limpiarError(campo) {
    campo.classList.remove('field-error');

    let contenedor = campo.parentNode;
    if (contenedor.classList.contains('password-input')) {
        contenedor = contenedor.parentNode;
    }

    const errorDiv = contenedor.querySelector('.validation-message.error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

function validarFormularioCompleto() {
    const form = document.getElementById('register-form');
    if (!form) return false;
    
    let esValido = true;
    
    const camposRequeridos = ['cedula', 'email', 'nombre', 'contrasena', 'confirmarContrasena', 'telefono'];
    
    camposRequeridos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            if (!validarCampo(campo)) {
                esValido = false;
            }
        }
    });
    
    if (esValido) {
        const pass1 = document.getElementById('contrasena');
        const pass2 = document.getElementById('confirmarContrasena');
        
        if (pass1 && pass2) {
            const valor1 = pass1.value.trim();
            const valor2 = pass2.value.trim();
            
            if (!valor1 || !valor2) {
                mostrarErrorCampo(pass1, 'La contraseña es requerida');
                mostrarErrorCampo(pass2, 'Confirmar contraseña es requerida');
                esValido = false;
            } 

            else if (valor1.length < 8) {
                mostrarErrorCampo(pass1, 'La contraseña debe tener al menos 8 caracteres');
                esValido = false;
            }

            else if (valor1 !== valor2) {
                mostrarErrorCampo(pass2, 'Las contraseñas no coinciden');
                esValido = false;
            }
        }
    }
    
    const terms = document.getElementById('terms');
    if (terms && !terms.checked) {
        mostrarError('Debe aceptar los términos y condiciones');
        esValido = false;
    }
    
    return esValido;
}


function initCountrySelector() {
    const selectedCountry = document.getElementById('selectedCountry');
    const countriesDropdown = document.getElementById('countriesDropdown');
    const countryList = document.getElementById('countryList');
    const hiddenPaisInput = document.getElementById('pais');
    const hiddenCodigoInput = document.getElementById('codigoPais');
    const countryCodeDisplay = document.getElementById('countryCodeDisplay');
    const telefonoInput = document.getElementById('telefono');

    if (!selectedCountry || !telefonoInput) return;

    function crearNumeros(cantidad) {
        return "0".repeat(cantidad).replace(/(.{4})/g, '$1 ').trim();
    }

    function selectCountry(country) {
        currentCountry = country;

        selectedCountry.querySelector('.flag').className = `flag fi fi-${country.code}`;
        selectedCountry.querySelector('.country-name').textContent = country.name;

        if (hiddenPaisInput) hiddenPaisInput.value = country.code.toUpperCase();
        if (hiddenCodigoInput) hiddenCodigoInput.value = country.phoneCode;
        if (countryCodeDisplay) countryCodeDisplay.textContent = country.phoneCode;

        telefonoInput.placeholder = crearNumeros(country.maxDigits);
        
        if (telefonoInput.value) {
            let nums = telefonoInput.value.replace(/\D/g, '').slice(0, country.maxDigits);
            telefonoInput.value = nums.replace(/(.{4})/g, '$1 ').trim();
        }

        selectedCountry.classList.remove('open');
        if (countriesDropdown) countriesDropdown.style.display = 'none';
    }

    function loadCountries() {
        if (!countryList) return;
        
        countryList.innerHTML = '';
        countries.forEach(country => {
            const li = document.createElement('li');
            li.className = 'country-item';
            li.innerHTML = `
                <div class="flag fi fi-${country.code}"></div>
                <div class="country-name">${country.name}</div>
                <div class="country-code">${country.phoneCode}</div>
            `;
            li.addEventListener('click', () => selectCountry(country));
            countryList.appendChild(li);
        });
    }

    telefonoInput.addEventListener('input', () => {
        let nums = telefonoInput.value.replace(/\D/g, '').slice(0, currentCountry.maxDigits);
        telefonoInput.value = nums.replace(/(.{4})/g, '$1 ').trim();
    });

    selectedCountry.addEventListener('click', e => {
        e.stopPropagation();
        selectedCountry.classList.toggle('open');
        if (countriesDropdown) {
            countriesDropdown.style.display = selectedCountry.classList.contains('open') ? 'block' : 'none';
        }
    });

    document.addEventListener('click', () => {
        selectedCountry.classList.remove('open');
        if (countriesDropdown) countriesDropdown.style.display = 'none';
    });

    loadCountries();
    selectCountry(currentCountry);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    
    initPasswordToggles();
    initCountrySelector();
    setupFormValidation();

    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();

        if (!validarFormularioCompleto()) {
            mostrarError('Por favor corrija los errores en el formulario');
            return;
        }
        mostrarExito('¡Registro exitoso!');

        setTimeout(() => {
            window.location.href = "../../InicioSesion.html";
        }, 1200);
    });
});