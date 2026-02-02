// UTILIDADES DE MENSAJES
const mostrarMensaje = (mensaje, tipo = 'error', tiempo = 3000) => {
    const container = document.getElementById('mensaje-container');
    if (!container) return;

    container.querySelector('.mensaje')?.remove();

    const div = document.createElement('div');
    div.className = `mensaje mensaje-${tipo}`;
    div.innerHTML = `
        <i class="fas ${tipo === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
        <span>${mensaje}</span>
    `;
    container.appendChild(div);

    setTimeout(() => {
        div.remove();
    }, tiempo);
};

const mostrarError = msg => mostrarMensaje(msg, 'error', 5000);
const mostrarExito = msg => mostrarMensaje(msg, 'exito', 3000);

// OBTENER DATOS DESDE LA URL

function obtenerDatosHabitacion() {
    const params = new URLSearchParams(window.location.search);

    return {
        accion: params.get('accion'),
        id: params.get('id'),
        title: params.get('nombre') || '',
        price: parseFloat(params.get('precio')) || 0,
        guests: parseInt(params.get('capacidad')) || 2,
        beds: parseInt(params.get('camas')) || 1,
        bathrooms: parseFloat(params.get('banos')) || 1,
        status: params.get('estado') || 'available',
        images: []
    };
}

// CARGAR DATOS EN FORMULARIO

function cargarDatosEnFormulario(room) {
    document.getElementById('edit-room-name').value = room.title;
    document.getElementById('edit-room-price').value = room.price;
    document.getElementById('edit-max-adults').value = room.guests;
    document.getElementById('edit-bed-count').value = room.beds;
    document.getElementById('edit-bathroom-count').value = room.bathrooms;

    const statusRadio = document.querySelector(
        `input[name="room-status"][value="${room.status}"]`
    );
    statusRadio && (statusRadio.checked = true);

    cargarImagenes(room.images);
}

// IMÁGENES (SWIPER)

let mainSwiper = null;
let thumbSwiper = null;
let imagenesActuales = [];

function cargarImagenes(imagenes) {
    imagenesActuales = imagenes;

    const main = document.getElementById('main-images-wrapper');
    const thumb = document.getElementById('thumb-images-wrapper');

    if (!main || !thumb) return;

    main.innerHTML = '';
    thumb.innerHTML = '';

    imagenes.forEach((src, i) => {
        // Imagen principal con botón de eliminar
        main.innerHTML += `
            <div class="swiper-slide">
                <img src="${src}" alt="Imagen ${i + 1}">
                <button class="main-delete-btn" onclick="eliminarImagen(${i})" 
                        title="Eliminar imagen">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Miniatura con botón de eliminar
        thumb.innerHTML += `
            <div class="swiper-slide thumb-slide">
                <img src="${src}" alt="Miniatura ${i + 1}">
                <button class="delete-image-btn" onclick="eliminarImagen(${i})" 
                        title="Eliminar imagen">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });

    // Si no hay imágenes, mostrar placeholder
    if (imagenesActuales.length === 0) {
        main.innerHTML = `
            <div class="swiper-slide no-images">
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                    <i class="fas fa-images" style="font-size: 60px; color: #ccc; margin-bottom: 20px;"></i>
                    <p style="color: #888; font-size: 16px;">No hay imágenes cargadas</p>
                </div>
            </div>
        `;
        
        thumb.innerHTML = `
            <div class="swiper-slide no-images-thumb">
                <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
                    <i class="fas fa-camera" style="color: #ccc;"></i>
                </div>
            </div>
        `;
    }

    // Ocultar/Mostrar el carrusel de miniaturas según si hay imágenes
    const thumbWrapper = document.getElementById('thumb-images-wrapper');
    if (thumbWrapper) {
        if (imagenesActuales.length === 0) {
            thumbWrapper.style.display = 'none';
        } else {
            thumbWrapper.style.display = '';
        }
    }

    inicializarCarruseles();
}

// ===== FUNCIÓN PARA ELIMINAR IMAGEN =====
function eliminarImagen(index) {
    if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
        imagenesActuales.splice(index, 1);
        cargarImagenes(imagenesActuales);
        mostrarExito('Imagen eliminada correctamente');
    }
}

function inicializarCarruseles() {
    mainSwiper?.destroy();
    thumbSwiper?.destroy();

    // Solo inicializar si hay imágenes
    if (imagenesActuales.length > 0) {
        thumbSwiper = new Swiper('.thumb-images-swiper', {
            slidesPerView: Math.min(5, imagenesActuales.length),
            spaceBetween: 10,
            freeMode: true,
            watchSlidesProgress: true
        });

        mainSwiper = new Swiper('.main-images-swiper', {
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            thumbs: { swiper: thumbSwiper }
        });
    }
}

// SUBIDA DE IMÁGENES

function configurarSubidaImagenes() {
    const input = document.getElementById('image-upload');
    if (!input) return;

    input.addEventListener('change', e => {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            if (!validarImagen(file)) return;

            const reader = new FileReader();
            reader.onload = ev => {
                imagenesActuales.push(ev.target.result);
                cargarImagenes(imagenesActuales);
                mostrarExito('Imagen agregada');
            };
            reader.readAsDataURL(file);
        });

        input.value = '';
    });
}

function validarImagen(file) {
    const permitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!permitidos.includes(file.type)) {
        mostrarError('Formato de imagen no permitido. Use JPG, PNG o WebP');
        return false;
    }
    if (file.size > 5 * 1024 * 1024) {
        mostrarError('La imagen supera los 5MB');
        return false;
    }
    return true;
}

// VALIDACIÓN Y GUARDADO

function configurarValidacionFormulario() {
    const form = document.getElementById('form-habitacion');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        if (validarFormulario()) guardarCambios();
    });
}

function validarFormulario() {
    const nombre = document.getElementById('edit-room-name').value.trim();
    const precio = document.getElementById('edit-room-price').value;
    const tipo = document.getElementById('edit-room-type').value;

    if (nombre.length < 3) {
        mostrarError('El nombre debe tener al menos 3 caracteres');
        return false;
    }
    
    if (!tipo) {
        mostrarError('Debe seleccionar un tipo de habitación');
        return false;
    }
    
    if (precio <= 0) {
        mostrarError('El precio debe ser mayor a 0');
        return false;
    }
    
    if (imagenesActuales.length === 0) {
        mostrarError('Debe subir al menos una imagen');
        return false;
    }
    
    return true;
}

async function guardarCambios() {
  try {
    const params = new URLSearchParams(window.location.search);
    const accion = params.get("accion") || "crear";

    const datos = {
      // idHabitacion solo aplica para editar/eliminar
      title: document.getElementById('edit-room-name').value.trim(),
      price: Number(document.getElementById('edit-room-price').value),
      guests: Number(document.getElementById('edit-max-adults').value || 0),
      beds: Number(document.getElementById('edit-bed-count').value || 0),
      bathrooms: Number(document.getElementById('edit-bathroom-count').value || 0),
      type: document.getElementById('edit-room-type').value, // esto lo vamos a mapear a tipoCama o a nombre según tu select
      status: document.querySelector('input[name="room-status"]:checked').value,
      images: imagenesActuales, // IMPORTANTÍSIMO: que sean URLs, no base64
    };

    // idHotel debería venir del login (localStorage)
    const idHotel = Number(localStorage.getItem("idHotel"));
    if (!idHotel) {
      mostrarError("No hay idHotel en sesión. Iniciá sesión otra vez.");
      return;
    }

    let url = `/api/anfitrion/habitaciones`;
    let method = "POST";

    if (accion === "editar") {
      const idHabitacion = Number(params.get("id"));
      url = `/api/anfitrion/habitaciones/${idHabitacion}`;
      method = "PUT";
    }

    if (accion === "eliminar") {
      const idHabitacion = Number(params.get("id"));
      url = `/api/anfitrion/habitaciones/${idHabitacion}`;
      method = "DELETE";
    }

    const body = (method === "DELETE") ? null : JSON.stringify({ idHotel, ...datos });

    const r = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body
    });

    const j = await r.json();
    if (!r.ok || !j.ok) {
      mostrarError(j.error || "No se pudo guardar.");
      return;
    }

    mostrarExito(j.msg || "Guardado ✅");
    setTimeout(() => window.location.href = 'indexAnfitrion.html', 900);

  } catch (e) {
    mostrarError(e.message);
  }
}


// BOTONES

function configurarBotones() {
    document.getElementById('btn-volver')?.addEventListener('click', () => {
        if (confirm('¿Salir sin guardar los cambios?')) {
            window.location.href = 'indexAnfitrion.html';
        }
    });

    document.getElementById('btn-cancelar')?.addEventListener('click', () => {
        if (confirm('¿Cancelar y volver?')) {
            window.location.href = 'indexAnfitrion.html';
        }
    });

    document.getElementById('btn-eliminar')?.addEventListener('click', () => {
        const habitacion = obtenerDatosHabitacion();
        if (confirm(`¿Estás seguro de eliminar la habitación "${habitacion.title || 'esta habitación'}"?`)) {
            mostrarExito('Habitación eliminada');
            setTimeout(() => {
                window.location.href = 'indexAnfitrion.html';
            }, 1500);
        }
    });
}

// CONTADOR DE CARACTERES

function configurarContadorCaracteres() {
    const textarea = document.getElementById('edit-room-description');
    const contador = document.getElementById('edit-char-counter');
    
    if (textarea && contador) {
        textarea.addEventListener('input', function() {
            contador.textContent = `${this.value.length}/500`;
        });
        
        // Inicializar contador
        contador.textContent = `${textarea.value.length}/500`;
    }
}

// DETECTAR MODO (CREAR/EDITAR)

function detectarModo() {
    const params = new URLSearchParams(window.location.search);
    const accion = params.get('accion');
    
    // Mostrar/Ocultar botón eliminar según modo
    const btnEliminar = document.getElementById('btn-eliminar');
    const tituloPagina = document.getElementById('titulo-pagina');
    const btnGuardar = document.getElementById('btn-guardar');
    
    if (accion === 'crear' || !accion) {
        // Modo creación
        tituloPagina.textContent = 'Crear Nueva Habitación';
        document.getElementById('room-info').textContent = 'Nueva habitación';
        btnEliminar.style.display = 'none';
        btnGuardar.innerHTML = '<i class="fas fa-save"></i> Crear Habitación';
    } else {
        // Modo edición
        tituloPagina.textContent = 'Editar Habitación';
        btnEliminar.style.display = 'flex';
        btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
    }
}
// OCULTAR/MOSTRAR ELEMENTOS SEGÚN IMÁGENES
function controlarVisibilidadElementos() {
    const thumbWrapper = document.getElementById('thumb-images-wrapper');
    const mainWrapper = document.getElementById('main-images-wrapper');
    const uploadZone = document.querySelector('.upload-zone');
    
    if (thumbWrapper && mainWrapper && uploadZone) {
        if (imagenesActuales.length === 0) {
            // Ocultar carruseles y mostrar mensaje de carga
            thumbWrapper.style.display = 'none';
            mainWrapper.style.opacity = '0.5';
            uploadZone.style.borderColor = '#6366f1';
            uploadZone.style.backgroundColor = '#f0f4ff';
        } else {
            // Mostrar todo normal
            thumbWrapper.style.display = '';
            mainWrapper.style.opacity = '1';
            uploadZone.style.borderColor = '#cbd5e1';
            uploadZone.style.backgroundColor = '';
        }
    }
}

// INIT

document.addEventListener('DOMContentLoaded', () => {
    // Detectar modo (crear/editar)
    detectarModo();
    
    // Cargar datos si estamos en modo edición
    const room = obtenerDatosHabitacion();
    if (room.accion && room.accion !== 'crear') {
        cargarDatosEnFormulario(room);
    }
    
    // Inicializar componentes
    configurarSubidaImagenes();
    configurarValidacionFormulario();
    configurarBotones();
    configurarContadorCaracteres();
    
    // Cargar imágenes iniciales
    cargarImagenes(imagenesActuales);
    
    // Controlar visibilidad inicial
    controlarVisibilidadElementos();
});

// ACTIVIDADES RECREATIVAS
let actividadesSeleccionadas = [];
let actividadesDisponibles = [];

// Actividades predefinidas
const actividadesPredefinidas = [
    {
        id: 1,
        nombre: "Tour en Kayak",
        descripcion: "Recorrido guiado en kayak por el lago cercano",
        icono: "fa-ship",
        tipo: "tour",
        precio: 25,
        duracion: "2 horas",
        incluido: false
    },
    {
        id: 2,
        nombre: "Yoga al Amanecer",
        descripcion: "Sesión de yoga al aire libre al amanecer",
        icono: "fa-spa",
        tipo: "yoga",
        precio: 15,
        duracion: "1 hora",
        incluido: true
    },
    {
        id: 3,
        nombre: "Masaje Relajante",
        descripcion: "Masaje terapéutico de 60 minutos",
        icono: "fa-hands",
        tipo: "massage",
        precio: 40,
        duracion: "1 hora",
        incluido: false
    },
    {
        id: 4,
        nombre: "Acceso a Piscina",
        descripcion: "Acceso ilimitado a piscina temperada",
        icono: "fa-swimming-pool",
        tipo: "pool",
        precio: 0,
        duracion: "Todo el día",
        incluido: true
    },
    {
        id: 5,
        nombre: "Ruta en Bicicleta",
        descripcion: "Alquiler de bicicletas y ruta guiada",
        icono: "fa-bicycle",
        tipo: "bike",
        precio: 20,
        duracion: "3 horas",
        incluido: false
    },
    {
        id: 6,
        nombre: "Senderismo Guiado",
        descripcion: "Excursión por senderos naturales",
        icono: "fa-hiking",
        tipo: "hiking",
        precio: 30,
        duracion: "4 horas",
        incluido: false
    },
    {
        id: 7,
        nombre: "Clase de Golf",
        descripcion: "Clase con instructor profesional",
        icono: "fa-golf-ball",
        tipo: "golf",
        precio: 50,
        duracion: "2 horas",
        incluido: false
    },
    {
        id: 9,
        nombre: "Spa Completo",
        descripcion: "Tratamiento completo de spa",
        icono: "fa-hot-tub",
        tipo: "spa",
        precio: 60,
        duracion: "2 horas",
        incluido: false
    },
    {
        id: 10,
        nombre: "Clase de Cocina",
        descripcion: "Clase de cocina local con chef",
        icono: "fa-utensils",
        tipo: "cooking",
        precio: 35,
        duracion: "3 horas",
        incluido: false
    }
];

function inicializarActividades() {
    actividadesDisponibles = [...actividadesPredefinidas];
    cargarActividadesEnGrid();
    configurarBotonAgregarActividad();
    
    // Cargar actividades seleccionadas desde datos existentes si hay
    const room = obtenerDatosHabitacion();
    if (room.actividades && Array.isArray(room.actividades)) {
        actividadesSeleccionadas = room.actividades;
        actualizarActividadesSeleccionadas();
    }
}

function cargarActividadesEnGrid() {
    const grid = document.getElementById('activities-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    actividadesDisponibles.forEach(actividad => {
        const isSelected = actividadesSeleccionadas.some(a => a.id === actividad.id);
        
        const activityCard = document.createElement('div');
        activityCard.className = `activity-card ${isSelected ? 'selected' : ''}`;
        activityCard.setAttribute('data-id', actividad.id);
        activityCard.innerHTML = `
            <div class="activity-header">
                <div class="activity-icon ${actividad.tipo}">
                    <i class="fas ${actividad.icono}"></i>
                </div>
                <div class="activity-title">${actividad.nombre}</div>
                <div class="activity-checkbox ${isSelected ? 'checked' : ''}"></div>
            </div>
            <div class="activity-description">${actividad.descripcion}</div>
            <div class="activity-details">
                <div class="activity-price ${actividad.incluido ? 'included' : ''}">
                    ${actividad.incluido ? 'Incluido' : `$${actividad.precio}`}
                </div>
                <div class="activity-duration">
                    <i class="far fa-clock"></i>
                    ${actividad.duracion}
                </div>
            </div>
        `;
        
        activityCard.addEventListener('click', () => toggleActividad(actividad.id));
        grid.appendChild(activityCard);
    });
}

function toggleActividad(actividadId) {
    const actividad = actividadesDisponibles.find(a => a.id === actividadId);
    if (!actividad) return;
    
    const index = actividadesSeleccionadas.findIndex(a => a.id === actividadId);
    
    if (index === -1) {
        // Agregar actividad
        actividadesSeleccionadas.push(actividad);
        mostrarExito(`${actividad.nombre} agregada`);
    } else {
        // Remover actividad
        actividadesSeleccionadas.splice(index, 1);
        mostrarExito(`${actividad.nombre} removida`);
    }
    
    actualizarActividadesSeleccionadas();
}

function actualizarActividadesSeleccionadas() {
    const activityCards = document.querySelectorAll('.activity-card');
    activityCards.forEach(card => {
        const actividadId = parseInt(card.getAttribute('data-id'));
        const isSelected = actividadesSeleccionadas.some(a => a.id === actividadId);
        
        card.classList.toggle('selected', isSelected);
        const checkbox = card.querySelector('.activity-checkbox');
        checkbox?.classList.toggle('checked', isSelected);
    });
}

function configurarBotonAgregarActividad() {
    const btnAgregar = document.getElementById('btn-agregar-actividad');
    if (!btnAgregar) return;
    
    btnAgregar.addEventListener('click', mostrarModalNuevaActividad);
}

function mostrarModalNuevaActividad() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Agregar Nueva Actividad</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="nueva-actividad-form">
                    <div class="form-group">
                        <label for="actividad-nombre">Nombre de la Actividad *</label>
                        <input type="text" id="actividad-nombre" required placeholder="Ej: Tour en Kayak">
                    </div>
                    
                    <div class="form-group">
                        <label for="actividad-descripcion">Descripción</label>
                        <textarea id="actividad-descripcion" rows="3" placeholder="Describe la actividad..."></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="actividad-tipo">Tipo</label>
                            <select id="actividad-tipo">
                                <option value="tour">Tour</option>
                                <option value="yoga">Yoga</option>
                                <option value="massage">Masaje</option>
                                <option value="pool">Piscina</option>
                                <option value="bike">Bicicleta</option>
                                <option value="hiking">Senderismo</option>
                                <option value="golf">Golf</option>
                                <option value="spa">Spa</option>
                                <option value="cooking">Cocina</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="actividad-precio">Precio ($)</label>
                            <div class="price-input">
                                <input type="number" id="actividad-precio" min="0" step="0.01" value="0">
                                <span>USD</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="actividad-duracion">Duración</label>
                            <input type="text" id="actividad-duracion" placeholder="Ej: 2 horas">
                        </div>
                        
                        <div class="form-group">
                            <label for="actividad-icono">Icono</label>
                            <select id="actividad-icono">
                                <option value="fa-ship">Kayak</option>
                                <option value="fa-spa">Yoga</option>
                                <option value="fa-hands">Masaje</option>
                                <option value="fa-swimming-pool">Piscina</option>
                                <option value="fa-bicycle">Bicicleta</option>
                                <option value="fa-hiking">Senderismo</option>
                                <option value="fa-golf-ball">Golf</option>
                                <option value="fa-hot-tub">Spa</option>
                                <option value="fa-utensils">Cocina</option>
                                <option value="fa-camera">Fotografía</option>
                                <option value="fa-wine-glass">Catas</option>
                                <option value="fa-horse">Cabalgata</option>
                                <option value="fa-fish">Pesca</option>
                                <option value="fa-campground">Camping</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="actividad-incluida">
                            <span>Esta actividad está incluida sin costo adicional</span>
                        </label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary close-modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-plus"></i>
                            Agregar Actividad
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal
    const closeModal = () => modal.remove();
    modal.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Enviar formulario
    const form = modal.querySelector('#nueva-actividad-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nuevaActividad = {
            id: Date.now(), // ID único
            nombre: document.getElementById('actividad-nombre').value.trim(),
            descripcion: document.getElementById('actividad-descripcion').value.trim(),
            tipo: document.getElementById('actividad-tipo').value,
            precio: parseFloat(document.getElementById('actividad-precio').value) || 0,
            duracion: document.getElementById('actividad-duracion').value.trim(),
            icono: document.getElementById('actividad-icono').value,
            incluido: document.getElementById('actividad-incluida').checked
        };
        
        if (!nuevaActividad.nombre) {
            mostrarError('El nombre de la actividad es requerido');
            return;
        }
        
        // Agregar a actividades disponibles
        actividadesDisponibles.push(nuevaActividad);
        
        // Recargar grid
        cargarActividadesEnGrid();
        
        mostrarExito('Actividad agregada exitosamente');
        closeModal();
    });
}

// ACTUALIZAR FUNCIÓN guardarCambios

function guardarCambios() {
    const datos = {
        id: obtenerDatosHabitacion().id,
        title: document.getElementById('edit-room-name').value,
        price: document.getElementById('edit-room-price').value,
        guests: document.getElementById('edit-max-adults').value,
        beds: document.getElementById('edit-bed-count').value,
        bathrooms: document.getElementById('edit-bathroom-count').value,
        type: document.getElementById('edit-room-type').value,
        status: document.querySelector('input[name="room-status"]:checked').value,
        images: imagenesActuales,
        actividades: actividadesSeleccionadas // Agregar actividades
    };

    console.log('Guardando habitación con actividades:', datos);
    mostrarExito('Habitación guardada exitosamente');

    setTimeout(() => {
        window.location.href = 'indexAnfitrion.html';
    }, 1500);
}

// ACTUALIZAR FUNCIÓN cargarDatosEnFormulario

function cargarDatosEnFormulario(room) {
    document.getElementById('edit-room-name').value = room.title;
    document.getElementById('edit-room-price').value = room.price;
    document.getElementById('edit-max-adults').value = room.guests;
    document.getElementById('edit-bed-count').value = room.beds;
    document.getElementById('edit-bathroom-count').value = room.bathrooms;

    const statusRadio = document.querySelector(
        `input[name="room-status"][value="${room.status}"]`
    );
    statusRadio && (statusRadio.checked = true);

    cargarImagenes(room.images);
    
    // Cargar actividades si existen
    if (room.actividades && Array.isArray(room.actividades)) {
        actividadesSeleccionadas = room.actividades;
        actualizarActividadesSeleccionadas();
    }
}

// ACTUALIZAR INIT

document.addEventListener('DOMContentLoaded', () => {
    // Detectar modo (crear/editar)
    detectarModo();
    
    // Cargar datos si estamos en modo edición
    const room = obtenerDatosHabitacion();
    if (room.accion && room.accion !== 'crear') {
        cargarDatosEnFormulario(room);
    }
    
    // Inicializar componentes
    configurarSubidaImagenes();
    configurarValidacionFormulario();
    configurarBotones();
    configurarContadorCaracteres();
    inicializarActividades(); // Nuevo: inicializar actividades
    
    // Cargar imágenes iniciales
    cargarImagenes(imagenesActuales);
    
    // Controlar visibilidad inicial
    controlarVisibilidadElementos();
});