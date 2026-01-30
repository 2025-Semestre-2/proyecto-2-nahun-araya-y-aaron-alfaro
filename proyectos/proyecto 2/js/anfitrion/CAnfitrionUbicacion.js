// Datos completos de Costa Rica sin tildes
const cantonesPorProvincia = {
    san_jose: [
        "San Jose", "Escazu", "Desamparados", "Puriscal", "Tarrazu", 
        "Aserri", "Mora", "Goicoechea", "Santa Ana", "Alajuelita", 
        "Vazquez de Coronado", "Acosta", "Tibas", "Moravia", 
        "Montes de Oca", "Turrubares", "Dota", "Curridabat", 
        "Perez Zeledon", "Leon Cortes Castro"
    ],
    alajuela: [
        "Alajuela", "San Ramon", "Grecia", "San Mateo", "Atenas", 
        "Naranjo", "Palmares", "Poas", "Orotina", "San Carlos", 
        "Zarcero", "Sarchi", "Upala", "Los Chiles", "Guatuso", 
        "Rio Cuarto"
    ],
    cartago: [
        "Cartago", "Paraiso", "La Union", "Jimenez", "Turrialba", 
        "Alvarado", "Oreamuno", "El Guarco"
    ],
    heredia: [
        "Heredia", "Barva", "Santo Domingo", "Santa Barbara", 
        "San Rafael", "San Isidro", "Belen", "Flores", 
        "San Pablo", "Sarapiqui"
    ],
    guanacaste: [
        "Liberia", "Nicoya", "Santa Cruz", "Bagaces", "Carrillo", 
        "Canas", "Abangares", "Tilaran", "Nandayure", "La Cruz", 
        "Hojancha"
    ],
    puntarenas: [
        "Puntarenas", "Esparza", "Buenos Aires", "Montes de Oro", 
        "Osa", "Quepos", "Golfito", "Coto Brus", "Parrita", 
        "Corredores", "Garabito"
    ],
    limon: [
        "Limon", "Pococi", "Siquirres", "Talamanca", "Matina", 
        "Guacimo"
    ]
};

// Datos completos de distritos por canton sin tildes
const distritosPorCanton = {
    // San Jose
    "san_jose": ["Carmen", "Merced", "Hospital", "Catedral", "Zapote", "San Francisco de Dos Rios", "Uruca", "Mata Redonda", "Pavas", "Hatillo", "San Sebastian"],
    "escazu": ["Escazu", "San Antonio", "San Rafael"],
    "desamparados": ["Desamparados", "San Miguel", "San Juan de Dios", "San Rafael Arriba", "San Antonio", "Frailes", "Patarra", "San Cristobal", "Rosario", "Damas", "San Rafael Abajo", "Gravilias", "Los Guido"],
    "puriscal": ["Santiago", "Mercedes Sur", "Barbacoas", "Grifo Alto", "San Rafael", "Candelarita", "Desamparaditos", "San Antonio", "Chires"],
    "tarrazu": ["San Marcos", "San Lorenzo", "San Carlos"],
    "aserri": ["Aserri", "Tarbaca", "Vuelta de Jorco", "San Gabriel", "Legua", "Monterrey", "Salitrillos"],
    "mora": ["Colon", "Guayabo", "Tabarcia", "Piedras Negras", "Picagres", "Jaris"],
    "goicoechea": ["Guadalupe", "San Francisco", "Calle Blancos", "Mata de Platano", "Ipis", "Rancho Redondo", "Purral"],
    "santa_ana": ["Santa Ana", "Salitral", "Pozos", "Uruca", "Piedades", "Brasil"],
    "alajuelita": ["Alajuelita", "San Josecito", "San Antonio", "Concepcion", "San Felipe"],
    "vazquez_de_coronado": ["San Isidro", "San Rafael", "Dulce Nombre de Jesus", "Patalillo", "Cascajal"],
    "acosta": ["San Ignacio", "Guaitil", "Palmichal", "Cangrejal", "Sabanillas"],
    "tibas": ["San Juan", "Cinco Esquinas", "Anselmo Llorente", "Leon XIII", "Colima"],
    "moravia": ["San Vicente", "San Jeronimo", "La Trinidad"],
    "montes_de_oca": ["San Pedro", "Sabanilla", "Mercedes", "San Rafael"],
    "turrubares": ["San Pablo", "San Pedro", "San Juan de Mata", "San Luis", "Carara"],
    "dota": ["Santa Maria", "Jardin", "Copey"],
    "curridabat": ["Curridabat", "Granadilla", "Sanchez", "Tirrases"],
    "perez_zeledon": ["San Isidro de El General", "El General", "Daniel Flores", "Rivas", "San Pedro", "Platanares", "Pejibaye", "Cajon", "Baru", "Rio Nuevo", "Paramo", "La Amistad"],
    "leon_cortes_castro": ["San Pablo", "San Andres", "Llano Bonito", "San Isidro", "Santa Cruz", "San Antonio"],

    // Alajuela
    "alajuela": ["Alajuela", "San Jose", "Carrizal", "San Antonio", "Guacima", "San Isidro", "Sabanilla", "San Rafael", "Rio Segundo", "Desamparados", "Turrucares", "Tambor"],
    "san_ramon": ["San Ramon", "Santiago", "San Juan", "Piedades Norte", "Piedades Sur", "San Rafael", "San Isidro", "Angeles", "Alfaro", "Volio", "Concepcion", "Zapotal", "Penas Blancas"],
    "grecia": ["Grecia", "San Isidro", "San Jose", "San Roque", "Tacares", "Rio Cuarto", "Puente de Piedra", "Bolivar"],
    "san_mateo": ["San Mateo", "Desmonte", "Jesus Maria", "Labrador"],
    "atenas": ["Atenas", "Jesus", "Mercedes", "San Isidro", "Concepcion", "San Jose", "Santa Eulalia", "Escobal"],
    "naranjo": ["Naranjo", "San Miguel", "San Jose", "Cirri Sur", "San Jeronimo", "San Juan", "El Rosario", "Palmitos"],
    "palmares": ["Palmares", "Zaragoza", "Buenos Aires", "Santiago", "Candelaria", "Esquipulas", "La Granja"],
    "poas": ["San Pedro", "San Juan", "San Rafael", "Carrillos", "Sabana Redonda"],
    "orotina": ["Orotina", "El Mastate", "Hacienda Vieja", "Coyolar", "La Ceiba"],
    "san_carlos": ["Quesada", "Florencia", "Buenavista", "Aguas Zarcas", "Venecia", "Pital", "La Fortuna", "La Tigra", "La Palmera", "Venado", "Cutris", "Monterrey", "Pocosol", "Cairo", "Sonafluca"],
    "zarcero": ["Zarcero", "Laguna", "Tapesco", "Guadalupe", "Palmira", "Zapote", "Brisas"],
    "sarchi": ["Sarchi Norte", "Sarchi Sur", "Toro Amarillo", "San Pedro", "Rodriguez"],
    "upala": ["Upala", "Aguas Claras", "San Jose", "Bijagua", "Delicias", "Dos Rios", "Yolillal", "Canalete"],
    "los_chiles": ["Los Chiles", "Cano Negro", "El Amparo", "San Jorge"],
    "guatuso": ["San Rafael", "Buenavista", "Cote", "Katira"],
    "rio_cuarto": ["Rio Cuarto"],

    // Cartago
    "cartago": ["Oriental", "Occidental", "Carmen", "San Nicolas", "Aguacaliente", "Guadalupe", "Corralillo", "Tierra Blanca", "Dulce Nombre", "Llano Grande", "Quebradilla"],
    "paraiso": ["Paraiso", "Santiago", "Orosi", "Cachi", "Llanos de Santa Lucia", "Birrisito"],
    "la_union": ["Tres Rios", "San Diego", "San Juan", "San Rafael", "Concepcion", "Dulce Nombre", "San Ramon", "Rio Azul"],
    "jimenez": ["Juan Vinas", "Tucurrique", "Pejibaye"],
    "turrialba": ["Turrialba", "La Suiza", "Peralta", "Santa Cruz", "Santa Teresita", "Pavones", "Tuis", "Tayutic", "Santa Rosa", "Tres Equis", "La Isabel", "Chirripo"],
    "alvarado": ["Pacayas", "Cervantes", "Capellades"],
    "oreamuno": ["San Rafael", "Cot", "Potrero Cerrado", "Cipreses", "Santa Rosa"],
    "el_guarco": ["El Tejar", "San Isidro", "Tobosi", "Patio de Agua"],

    // Heredia
    "heredia": ["Heredia", "Mercedes", "San Francisco", "Ulloa", "Varablanca"],
    "barva": ["Barva", "San Pedro", "San Pablo", "San Roque", "Santa Lucia", "San Jose de la Montana"],
    "santo_domingo": ["Santo Domingo", "San Vicente", "San Miguel", "Paracito", "Santo Tomas", "Santa Rosa", "Tures", "Para"],
    "santa_barbara": ["Santa Barbara", "San Pedro", "San Juan", "Jesus", "Santo Domingo", "Puraba"],
    "san_rafael": ["San Rafael", "San Josecito", "Santiago", "Angeles", "Concepcion"],
    "san_isidro": ["San Isidro", "San Jose", "Concepcion", "San Francisco"],
    "belen": ["San Antonio", "La Ribera", "La Asuncion"],
    "flores": ["San Joaquin", "Barrantes", "Llorente"],
    "san_pablo": ["San Pablo", "Rincon de Sabanilla"],
    "sarapiqui": ["Puerto Viejo", "La Virgen", "Horquetas", "Llanuras del Gaspar", "Curena"],

    // Guanacaste
    "liberia": ["Liberia", "Canas Dulces", "Mayorga", "Nacascolo", "Curubande"],
    "nicoya": ["Nicoya", "Mansion", "San Antonio", "Quebrada Honda", "Samara", "Nosara", "Belen de Nosarita"],
    "santa_cruz": ["Santa Cruz", "Bolson", "Veintisiete de Abril", "Tempate", "Cartagena", "Cuajiniquil", "Diria", "Cabo Velas", "Tamarindo"],
    "bagaces": ["Bagaces", "Fortuna", "Mogote", "Rio Naranjo"],
    "carrillo": ["Filadelfia", "Palmira", "Sardinal", "Belen"],
    "canas": ["Canas", "Palmira", "San Miguel", "Bebedero", "Porozal"],
    "abangares": ["Las Juntas", "Sierra", "San Juan", "Colorado"],
    "tilaran": ["Tilaran", "Quebrada Grande", "Tronadora", "Santa Rosa", "Libano", "Tierras Morenas", "Arenal"],
    "nandayure": ["Carmona", "Santa Rita", "Zapotal", "San Pablo", "Porvenir", "Bejuco"],
    "la_cruz": ["La Cruz", "Santa Cecilia", "Garita", "Santa Elena"],
    "hojancha": ["Hojancha", "Monte Romo", "Puerto Carrillo", "Huacas"],

    // Puntarenas
    "puntarenas": ["Puntarenas", "Pitahaya", "Chomes", "Lepanto", "Paquera", "Manzanillo", "Guacimal", "Barranca", "Monte Verde", "Cobano", "Chacarita", "Chira", "Acapulco", "El Roble", "Arancibia"],
    "esparza": ["Espiritu Santo", "San Juan Grande", "Macacona", "San Rafael", "San Jeronimo", "Caldera"],
    "buenos_aires": ["Buenos Aires", "Volcan", "Potrero Grande", "Boruca", "Pilas", "Colinas", "Changuena", "Biolley", "Brunka"],
    "montes_de_oro": ["Miramar", "La Union", "San Isidro"],
    "osa": ["Puerto Cortes", "Palmar", "Sierpe", "Bahia Ballena", "Piedras Blancas", "Bahia Drake"],
    "quepos": ["Quepos", "Savegre", "Naranjito"],
    "golfito": ["Golfito", "Puerto Jimenez", "Guaycara", "Pavon"],
    "coto_brus": ["San Vito", "Sabalito", "Aguabuena", "Limoncito", "Pittier", "Gutierrez Brown"],
    "parrita": ["Parrita"],
    "corredores": ["Corredores", "La Cuesta", "Paso Canoas", "Laurel"],
    "garabito": ["Jaco", "Tarcoles"],

    // Limon
    "limon": ["Limon", "Valle La Estrella", "Rio Blanco", "Matama"],
    "pococi": ["Guapiles", "Jimenez", "Rita", "Roxana", "Cariari", "Colorado", "La Colonia"],
    "siquirres": ["Siquirres", "Pacuarito", "Florida", "Germania", "El Cairo", "Alegria"],
    "talamanca": ["Bratsi", "Sixaola", "Cahuita", "Telire"],
    "matina": ["Matina", "Batan", "Carrandi"],
    "guacimo": ["Guacimo", "Mercedes", "Pocora", "Rio Jimenez", "Duacari"]
};


// FUNCIONES GENERALES

function normalizeName(name) {
    return name.toLowerCase().replace(/ /g, "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function isValidURL(url) {
    try {
        const parsed = new URL(url);
        const allowedHosts = [
            "maps.google.com",
            "www.google.com",
            "google.com",
            "maps.app.goo.gl"
        ];
        return allowedHosts.some(h => parsed.hostname.includes(h));
    } catch {
        return false;
    }
}

function showValidationError(element, message) {
    mostrarMensajeError(message);
    if (element) {
        element.focus();
        element.style.borderColor = "#dc2626";
        element.style.boxShadow = "0 0 0 3px rgba(220,38,38,0.1)";
        setTimeout(() => {
            element.style.borderColor = "#e1e1e1";
            element.style.boxShadow = "none";
        }, 3000);
    }
}

// MANEJO DE ESTADO

const DatosAnfitrion = {

    obtenerEstado: function () {
        const data = localStorage.getItem("estadoAnfitrion");
        if (data) return JSON.parse(data);

        return {
            ubicacion: null,
            pasosCompletados: {
                ubicacion: false
            }
        };
    },

    guardarEnLocalStorage: function (estado) {
        localStorage.setItem("estadoAnfitrion", JSON.stringify(estado));
        localStorage.setItem("anfitrion_ubicacion", JSON.stringify(estado.ubicacion));
    },

    guardarEnSessionStorage: function (estado) {
        sessionStorage.setItem("estadoAnfitrion", JSON.stringify(estado));
        sessionStorage.setItem("anfitrion_ubicacion", JSON.stringify(estado.ubicacion));
    },

    guardarUbicacion: function (datos) {
        if (!datos.provincia || !datos.canton || !datos.distrito || !datos.direccion) {
            throw new Error("Datos incompletos");
        }

        const estado = this.obtenerEstado();
        estado.ubicacion = datos;
        estado.pasosCompletados.ubicacion = true;

        this.guardarEnLocalStorage(estado);
        this.guardarEnSessionStorage(estado);

        return true;
    },

    limpiarDatos: function () {
        localStorage.clear();
        sessionStorage.clear();
    }
};

// DOM

document.addEventListener("DOMContentLoaded", () => {

    const provincia = document.getElementById("provincia");
    const canton = document.getElementById("canton");
    const distrito = document.getElementById("distrito");
    const direccion = document.getElementById("direccion");
    const googleMaps = document.getElementById("googleMaps");
    const form = document.getElementById("ubicacion-form");
    const btnContinuar = document.querySelector(".btn-primary");

    provincia.addEventListener("change", () => {
        canton.innerHTML = '<option value="">Seleccione...</option>';
        distrito.innerHTML = '<option value="">Seleccione...</option>';
        distrito.disabled = true;

        if (!provincia.value) return;

        cantonesPorProvincia[provincia.value].forEach(c => {
            const o = document.createElement("option");
            o.value = normalizeName(c);
            o.textContent = c;
            canton.appendChild(o);
        });

        canton.disabled = false;
    });

    canton.addEventListener("change", () => {
        distrito.innerHTML = '<option value="">Seleccione...</option>';

        if (!canton.value) {
            distrito.disabled = true;
            return;
        }

        const lista = distritosPorCanton[canton.value] || [];
        lista.forEach(d => {
            const o = document.createElement("option");
            o.value = normalizeName(d);
            o.textContent = d;
            distrito.appendChild(o);
        });

        distrito.disabled = lista.length === 0;
    });

    function procesar() {
        if (!provincia.value) return showValidationError(provincia, "Seleccione provincia");
        if (!canton.value) return showValidationError(canton, "Seleccione canton");
        if (!distrito.value) return showValidationError(distrito, "Seleccione distrito");
        if (!direccion.value.trim()) return showValidationError(direccion, "Ingrese direccion");

        if (googleMaps.value.trim() && !isValidURL(googleMaps.value.trim())) {
            return showValidationError(googleMaps, "Enlace Google Maps invalido");
        }

        DatosAnfitrion.guardarUbicacion({
            provincia: provincia.value,
            canton: canton.value,
            distrito: distrito.value,
            direccion: direccion.value.trim(),
            googleMaps: googleMaps.value.trim()
        });

        mostrarMensajeExito("Ubicacion guardada");
        setTimeout(() => location.href = "CAnfitrionEspacio.html", 1200);
    }

    form.addEventListener("submit", e => {
        e.preventDefault();
        procesar();
    });

    btnContinuar.addEventListener("click", e => {
        e.preventDefault();
        procesar();
    });

    googleMaps.addEventListener("focus", function () {
        if (!this.value) this.placeholder = "https://maps.google.com/?q=lat,long";
    });
});

// MENSAJES

function showValidationError(element, message) {
        mostrarMensajeError(message);
        
        // Resaltar el campo con error
        if (element) {
            element.focus();
            element.style.borderColor = '#dc2626';
            element.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
            
            // Remover el estilo de error después de 3 segundos
            setTimeout(() => {
                element.style.borderColor = '#e1e1e1';
                element.style.boxShadow = 'none';
            }, 3000);
        }
    }

    function validateField(field) {
        if (field.required && !field.value.trim()) {
            field.style.borderColor = '#dc2626';
            field.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
        } else {
            field.style.borderColor = '#e1e1e1';
            field.style.boxShadow = 'none';
            
            // Validacion especial para Google Maps
            if (field.id === 'googleMaps' && field.value.trim()) {
                if (!isValidURL(field.value.trim())) {
                    field.style.borderColor = '#fbbf24';
                    field.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                }
            }
        }
    }

// Funcion para mostrar mensaje de error
function mostrarMensajeError(mensaje) {
    // Crear elemento de mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'mensaje-error';
    mensajeDiv.innerHTML = `
        <div class="mensaje-contenido">
            <i class="fas fa-exclamation-circle"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    // Estilos para el mensaje
    //no se si quitarlo
    mensajeDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc2626;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Estilos para el contenido
    mensajeDiv.querySelector('.mensaje-contenido').style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    // Agregar al documento
    document.body.appendChild(mensajeDiv);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        mensajeDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (mensajeDiv.parentNode) {
                mensajeDiv.parentNode.removeChild(mensajeDiv);
            }
        }, 300);
    }, 5000);
}

function mostrarMensajeExito(msg) {
    alert(msg);
}

