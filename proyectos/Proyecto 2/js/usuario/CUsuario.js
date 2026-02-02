console.log("CUsuario.js cargó ✅");

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

function llenarDias() {
    const selectDia = document.getElementById('dia');
    selectDia.innerHTML = '';
    
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectDia.appendChild(option);
    }
}

function llenarMeses() {
    const selectMes = document.getElementById('mes');
    selectMes.innerHTML = '';
    
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    meses.forEach((mes, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = mes;
        selectMes.appendChild(option);
    });
}

function llenarAnios() {
    const selectAnio = document.getElementById('anio');
    selectAnio.innerHTML = '';
    
    const anioActual = new Date().getFullYear();
    const anioInicio = anioActual - 100;
    
    for (let i = anioActual; i >= anioInicio; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectAnio.appendChild(option);
    }
}

function actualizarDias() {
    const mes = document.getElementById('mes').value;
    const anio = document.getElementById('anio').value;
    const selectDia = document.getElementById('dia');
    
    if (!mes || !anio) return;
    let dias = 31;
    if (mes == 4 || mes == 6 || mes == 9 || mes == 11) {
        dias = 30;
    } else{
        if (mes == 2) {
        const esBisiesto = (anio % 4 == 0 && (anio % 100 != 0 || anio % 400 == 0));
        dias = esBisiesto ? 29 : 28;
        }
    }
    const diaSeleccionado = selectDia.value;
    selectDia.innerHTML = '';
    for (let i = 1; i <= dias; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectDia.appendChild(option);
    }
    if (diaSeleccionado && diaSeleccionado <= dias) {
        selectDia.value = diaSeleccionado;
    }
}

// Configurar visibilidad para PRIMERA contraseña
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('contrasena');

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
const togglePassword2 = document.getElementById('toggleConfirmPassword');
const passwordInput2 = document.getElementById('confirmarContrasena');
if (togglePassword2 && passwordInput2) {
    togglePassword2.addEventListener('click',
        function() {
            const type = passwordInput2.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput2.setAttribute('type', type);
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

function validarContrasenas() {
    return (passwordInput && passwordInput2 && passwordInput.value === passwordInput2.value);
}

// Función para validar email
function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// selector de paises
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
    { code: "cr", name: "Costa Rica", phoneCode: "+506", maxDigits: 8 },
    { code: "pa", name: "Panamá", phoneCode: "+507", maxDigits: 8 },
    { code: "do", name: "República Dominicana", phoneCode: "+1", maxDigits: 10 },
    { code: "ve", name: "Venezuela", phoneCode: "+58", maxDigits: 10 },
    { code: "ec", name: "Ecuador", phoneCode: "+593", maxDigits: 9 },
    { code: "uy", name: "Uruguay", phoneCode: "+598", maxDigits: 8 },
    { code: "py", name: "Paraguay", phoneCode: "+595", maxDigits: 9 },
    { code: "bo", name: "Bolivia", phoneCode: "+591", maxDigits: 8 },
    { code: "sv", name: "El Salvador", phoneCode: "+503", maxDigits: 8 },
    { code: "gt", name: "Guatemala", phoneCode: "+502", maxDigits: 8 },
    { code: "hn", name: "Honduras", phoneCode: "+504", maxDigits: 8 },
    { code: "ni", name: "Nicaragua", phoneCode: "+505", maxDigits: 8 }
];

let currentCountry = { code: "cr", name: "Costa Rica", phoneCode: "+506", maxDigits: 8 };

function initCountrySelector() {
    const selectedCountry = document.getElementById('selectedCountry');
    const countriesDropdown = document.getElementById('countriesDropdown');
    const countryList = document.getElementById('countryList');
    const countrySearch = document.getElementById('countrySearch');
    const hiddenPaisInput = document.getElementById('pais');
    const hiddenCodigoInput = document.getElementById('codigoPais');
    const countryCodeDisplay = document.getElementById('countryCodeDisplay');
    const telefonoInput = document.getElementById('telefono');

    // Cargar lista de paises
    function loadCountries() {
        countryList.innerHTML = '';
        
        countries.forEach(country => {
            const li = document.createElement('li');
            li.className = `country-item ${country.code === currentCountry.code ? 'selected' : ''}`;
            li.dataset.code = country.code;
            li.dataset.name = country.name;
            li.dataset.phoneCode = country.phoneCode;
            li.dataset.maxDigits = country.maxDigits;
            
            li.innerHTML = `
                <div class="flag fi fi-${country.code}"></div>
                <div class="country-name">${country.name}</div>
                <div class="country-code">${country.phoneCode}</div>
            `;
            
            li.addEventListener('click', () => selectCountry(country));
            countryList.appendChild(li);
        });
    }
    
    function crearNumeros(cantidad){
        let respuesta = "";
        for(let i = 0; i < cantidad; i++) {
            respuesta += "0";
        }
        return respuesta.replace(/(.{4})/g, '$1 ').trim();
    }
    
    // Seleccionar pais
    function selectCountry(country) {
        currentCountry = country;
        
        const selectedFlag = selectedCountry.querySelector('.flag');
        const selectedName = selectedCountry.querySelector('.country-name');
        selectedFlag.className = `flag fi fi-${country.code}`;
        selectedName.textContent = country.name;
        
        hiddenPaisInput.value = country.code.toUpperCase();
        hiddenCodigoInput.value = country.phoneCode;
        
        countryCodeDisplay.textContent = country.phoneCode;
        
        telefonoInput.placeholder = crearNumeros(country.maxDigits);
        
        telefonoInput.maxLength = country.maxDigits + 3;
        
        telefonoInput.value = '';
        
        let digitosElement = document.getElementById('digitosPermitidos');
        if (!digitosElement) {
            digitosElement = document.createElement('div');
            digitosElement.id = 'digitosPermitidos';
            digitosElement.className = 'input-hint digitos-info';
            telefonoInput.parentNode.insertBefore(digitosElement, telefonoInput.nextSibling);
        }
        
        selectedCountry.classList.remove('open');
        countriesDropdown.style.display = 'none';
        
        document.querySelectorAll('.country-item').forEach(item => {
            item.classList.remove('selected');
            if (item.dataset.code === country.code) {
                item.classList.add('selected');
            }
        });
        
        telefonoInput.focus();
    }

    //formatea número de teléfono
    function formatearTelefono(input) {
        // Obtener solo los números
        let numeros = input.value.replace(/\D/g, '');
        
        // Limitar a los digitos
        if (currentCountry && numeros.length > currentCountry.maxDigits) {
            numeros = numeros.substring(0, currentCountry.maxDigits);
        }
        
        // Formatear con espacios cada 4 dígitos
        let formateado = '';
        for (let i = 0; i < numeros.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formateado += ' ';
            }
            formateado += numeros[i];
        }
        
        input.value = formateado;
    }

    if (telefonoInput) {
        telefonoInput.addEventListener('input', function() {
            formatearTelefono(this);
        });
        
        telefonoInput.addEventListener('paste', function(e) {
            setTimeout(() => {
                formatearTelefono(this);
            }, 0);
        });
    }

    // Filtrar paises
    function filterCountries() {
        const searchTerm = countrySearch.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const items = countryList.querySelectorAll('.country-item');
        
        items.forEach(item => {
            const countryName = item.dataset.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (countryName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Inicializar eventos
    function initEvents() {
        selectedCountry.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedCountry.classList.toggle('open');
            countriesDropdown.style.display = selectedCountry.classList.contains('open') ? 'block' : 'none';
            
            if (selectedCountry.classList.contains('open')) {
                setTimeout(() => countrySearch.focus(), 100);
            }
        });

        // Filtrar paises mientras se escribe
        countrySearch.addEventListener('input', filterCountries);

        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!selectedCountry.contains(e.target) && !countriesDropdown.contains(e.target)) {
                selectedCountry.classList.remove('open');
                countriesDropdown.style.display = 'none';
            }
        });

        // Permitir navegación con teclado
        countrySearch.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                selectedCountry.classList.remove('open');
                countriesDropdown.style.display = 'none';
                selectedCountry.focus();
            }
        });
    }
    
    loadCountries();
    initEvents();
    selectCountry(currentCountry);
}

function validarTelefono(telefono, maxDigits) {
    // Limpiar el numero (quitar espacios)
    const telefonoLimpio = telefono.replace(/\s/g, '');
    
    // Validar que solo tenga numeros
    if (!/^\d+$/.test(telefonoLimpio)) {
        return {
            valido: false,
            mensaje: "El teléfono solo debe contener números"
        };
    }
    //validar longitud
    if (telefonoLimpio.length != maxDigits) {
        return {
            valido: false,
            mensaje: `El teléfono debe tener ${maxDigits} dígitos`
        };
    }
    return {
        valido: true,
        mensaje: ""
    };
}

function validarIdentificacion(tipo, valor) {
    const limpio = valor.replace(/\s/g, "");

    if (!limpio) {
        return { ok: false, msg: "Debe ingresar el número de identificación" };
    }

    if (!/^\d+$/.test(limpio)) {
        return { ok: false, msg: "La identificación solo debe contener números" };
    }

    let longitudEsperada;

    switch (tipo) {
        case "cedula":
            longitudEsperada = 9;
            break;
        case "dni":
            longitudEsperada = 9;
            break;
        case "pasaporte":
            longitudEsperada = 9;
            break;
        default:
            return { ok: false, msg: "Seleccione un tipo de identificación" };
    }

    if (limpio.length !== longitudEsperada) {
        return {
            ok: false,
            msg: `La ${tipo} debe tener exactamente ${longitudEsperada} dígitos`
        };
    }

    return { ok: true, limpio };
}


// Ejecutar cuando la pagina cargue
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("register-form");
    console.log("Form encontrado:", form);

    console.log('DOM cargado - Inicializando formulario...');
    llenarDias();
    llenarMeses();
    llenarAnios();
    initCountrySelector();
    
    document.getElementById('mes').addEventListener('change', actualizarDias);
    document.getElementById('anio').addEventListener('change', actualizarDias);
    

    // Validar formulario
    const API_BASE = "http://localhost:3001";

    function pad2(n) { return String(n).padStart(2, "0"); }

    function mapTipoIdentificacion(valor) {
    switch ((valor || "").toLowerCase()) {
        case "pasaporte": return "Pasaporte";
        case "cedula": return "Cédula nacional";
        case "dni": return "Otro";
        default: return "Otro";
    }
    }

    async function registrarCliente(payload) {
        const resp = await fetch(`${API_BASE}/api/auth/register/cliente`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
        // si el backend manda {ok:false, error:"Correo ya existe."}
        throw new Error(data.error || `Error HTTP ${resp.status}`);
    }
    if (data.ok === false) {
        throw new Error(data.error || "No se pudo registrar");
    }
    return data;
}

    document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // === datos del form (tus ids reales) ===
    const tipoIdUI = document.getElementById('tipoIdentificacion').value;
    const cedula = document.getElementById('cedula').value.trim();
    const email = document.getElementById('email').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const apellido1 = document.getElementById('apellido1').value.trim();
    const apellido2 = document.getElementById('apellido2').value.trim();
    const contrasena = document.getElementById('contrasena').value;
    const confirmar = document.getElementById('confirmarContrasena').value;
    const telefono = document.getElementById('telefono').value;
    const terms = document.getElementById('terms').checked;

    const dia = document.getElementById('dia').value;
    const mes = document.getElementById('mes').value;
    const anio = document.getElementById('anio').value;
    function pad2(n) {
    return String(n).padStart(2, "0");
    }

    const fechaNacimiento = `${anio}-${pad2(mes)}-${pad2(dia)}`;

    const codigoPais = document.getElementById('codigoPais').value.trim();
    const paisResidencia = (currentCountry?.name || "Costa Rica").trim();

    
    // 1) Términos
    if (!terms) return alert("Debe aceptar los términos");

    // 2) Campos obligatorios (apellido2 NO)
    const obligatorios = [
    { val: tipoIdUI, msg: "Seleccione el tipo de identificación" },
    { val: cedula, msg: "Ingrese la identificación" },
    { val: email, msg: "Ingrese el correo" },
    { val: nombre, msg: "Ingrese el nombre" },
    { val: apellido1, msg: "Ingrese el primer apellido" },
    { val: contrasena, msg: "Ingrese la contraseña" },
    { val: confirmar, msg: "Confirme la contraseña" },
    { val: telefono, msg: "Ingrese el teléfono" },
    { val: dia, msg: "Seleccione el día de nacimiento" },
    { val: mes, msg: "Seleccione el mes de nacimiento" },
    { val: anio, msg: "Seleccione el año de nacimiento" },
    ];

    
    for (const c of obligatorios) {
    if (!String(c.val || "").trim()) {
        mostrarError(c.msg);
        return;
        }
    }


    // 3) Email válido
    if (!validarEmail(email)) {
        mostrarMensaje('Correo inválido', 'error', 5000);
        return;
    }

    // 4) Contraseñas
    if (contrasena.length < 6) {
        mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error', 5000);
        return;
    }
    if (contrasena !== confirmar) {
        mostrarMensaje('Las contraseñas no coinciden', 'error', 5000);
        return;
    }

    // 5) Validar identificación por tipo 
    const checkId = validarIdentificacion(tipoIdUI, cedula);
    if (!checkId.ok) {
        mostrarError(checkId.msg);
        return;
    }


    const identificacionLimpia = checkId.limpio;

    // 6) Validar teléfono según país seleccionado (ya lo tenés armado)
    const telCheck = validarTelefono(telefono, currentCountry.maxDigits);
    if (!telCheck.valido) {
        mostrarError(telCheck.mensaje);
        return;
    }


    const telefonoLimpio = telefono.replace(/\s/g, "");


    // ✅ AHORA SÍ: crear payload (esto era lo que faltaba)
    const payload = {
        nombre,
        primerApellido: apellido1,
        segundoApellido: apellido2 || "",
        fechaNacimiento: fechaNacimiento,
        tipoIdentificacion: mapTipoIdentificacion(tipoIdUI),
        identificacion: identificacionLimpia,
        paisResidencia,
        correo: email,
        codigoPais,
        telefono: telefonoLimpio,
        password: contrasena
    };

    console.log("ENVIANDO A API ✅", payload);

    try {
        const r = await registrarCliente(payload);
        console.log("RESPUESTA API ✅", r);
        mostrarMensaje('¡Registro exitoso!', 'exito', 3000)
        window.location.href = "../../InicioSesion.html";
    } catch (err) {
        console.error(err);
        mostrarError(err.message);
    }
    });


});