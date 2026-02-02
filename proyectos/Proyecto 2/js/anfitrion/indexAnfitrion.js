// ===== FUNCIONES UTILITARIAS =====
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

// ===== FUNCIÓN PARA REDIRIGIR A CRUDhabitacion.html =====
function redirigirACRUDHabitacion(accion, datosHabitacion = {}) {
    let url = 'CRUDhabitacion.html';
    
    // Agregar parámetros de acción y datos
    const params = new URLSearchParams();
    params.append('accion', accion);
    
    // Agregar todos los datos de la habitación
    Object.keys(datosHabitacion).forEach(key => {
        if (datosHabitacion[key] !== undefined && datosHabitacion[key] !== null) {
            params.append(key, datosHabitacion[key]);
        }
    });
    
    // Codificar los parámetros
    url += '?' + params.toString();
    
    // Redirigir a la nueva página
    window.location.href = url;
    
    // Mostrar mensaje de confirmación
    const mensajes = {
        'crear': 'Creando nueva habitación...',
        'editar': `Editando habitación: ${datosHabitacion.nombre || ''}`,
        'eliminar': `Eliminando habitación: ${datosHabitacion.nombre || ''}`,
        'ver': `Viendo detalles de: ${datosHabitacion.nombre || ''}`
    };
    
    mostrarExito(mensajes[accion] || `Redirigiendo a gestión de habitación...`);
}

// ===== FUNCIÓN PARA OBTENER DATOS DE LOS BOTONES =====
function obtenerDatosHabitacion(boton) {
    const datos = {
        id: boton.getAttribute('data-habitacion-id'),
        nombre: boton.getAttribute('data-habitacion-nombre'),
        precio: boton.getAttribute('data-habitacion-precio'),
        capacidad: boton.getAttribute('data-habitacion-capacidad'),
        camas: boton.getAttribute('data-habitacion-camas'),
        banos: boton.getAttribute('data-habitacion-banos'),
        fotos: boton.getAttribute('data-habitacion-fotos'),
        estado: boton.getAttribute('data-habitacion-estado')
    };
    
    // Limpiar datos (eliminar null/undefined)
    Object.keys(datos).forEach(key => {
        if (datos[key] === null || datos[key] === undefined) {
            delete datos[key];
        }
    });
    
    return datos;
}

// ===== INICIALIZACIÓN DE CARRUSELES =====
function inicializarCarruseles() {
    // 1. Carrusel principal destacado
    const featuredSwiper = new Swiper('.featured-swiper', {
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        effect: 'fade',
        fadeEffect: { crossFade: true }
    });

    // 2. Carruseles de imágenes en tarjetas de habitaciones
    document.querySelectorAll('.room-images-swiper').forEach((swiperEl) => {
        new Swiper(swiperEl, {
            loop: true,
            pagination: { el: '.swiper-pagination', clickable: true, dynamicBullets: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            slidesPerView: 1,
            spaceBetween: 0,
            breakpoints: { 768: { allowTouchMove: false } }
        });
    });

    // 3. Carrusel para previsualización de imágenes subidas
    const uploadSwiper = new Swiper('.upload-preview-swiper', {
        slidesPerView: 3,
        spaceBetween: 10,
        pagination: { el: '.swiper-pagination', clickable: true },
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 5 },
            480: { slidesPerView: 2, spaceBetween: 8 },
            768: { slidesPerView: 3, spaceBetween: 10 }
        }
    });

    return { featuredSwiper, uploadSwiper };
}

// ===== GESTIÓN DE SUBIDA DE IMÁGENES =====
function configurarSubidaImagenes() {
    const imageUpload = document.getElementById('image-upload');
    const uploadPreview = document.querySelector('.upload-preview-swiper .swiper-wrapper');

    if (!imageUpload || !uploadPreview) return;

    let uploadedImages = [];

    imageUpload.addEventListener('change', function (e) {
        const files = Array.from(e.target.files).slice(0, 10);
        
        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageData = {
                    id: Date.now() + index,
                    src: e.target.result,
                    file: file,
                    name: file.name
                };
                
                uploadedImages.push(imageData);
                actualizarPrevisualizacion();
            };
            reader.readAsDataURL(file);
        });
    });

    function actualizarPrevisualizacion() {
        uploadPreview.innerHTML = '';

        uploadedImages.forEach((imageData, index) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.setAttribute('data-id', imageData.id);
            slide.innerHTML = `
                <div class="image-preview-container">
                    <img src="${imageData.src}" alt="${imageData.name}">
                    <div class="image-overlay">
                        <span class="image-name">${imageData.name}</span>
                        <button class="remove-image" data-id="${imageData.id}" title="Eliminar imagen">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            uploadPreview.appendChild(slide);
        });

        if (window.uploadSwiper) {
            window.uploadSwiper.update();
            
            if (uploadedImages.length === 0) {
                const placeholder = document.createElement('div');
                placeholder.className = 'swiper-slide empty-slide';
                placeholder.innerHTML = `
                    <div class="upload-placeholder">
                        <i class="fas fa-image"></i>
                        <p>No hay imágenes subidas</p>
                    </div>
                `;
                uploadPreview.appendChild(placeholder);
                window.uploadSwiper.update();
            }
        }

        agregarEventosEliminar();
    }

    function agregarEventosEliminar() {
        document.querySelectorAll('.remove-image').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const imageId = parseInt(this.getAttribute('data-id'));
                
                if (confirm('¿Estás seguro de eliminar esta imagen?')) {
                    uploadedImages = uploadedImages.filter(img => img.id !== imageId);
                    
                    const slide = this.closest('.swiper-slide');
                    slide.style.animation = 'fadeOut 0.3s ease-out';
                    
                    setTimeout(() => {
                        slide.remove();
                        actualizarPrevisualizacion();
                        mostrarExito('Imagen eliminada correctamente');
                        actualizarInputFile();
                    }, 300);
                }
            });
        });
    }

    function actualizarInputFile() {
        imageUpload.value = '';
        console.log('Imágenes actualizadas:', uploadedImages.length);
    }

    if (uploadedImages.length === 0) {
        actualizarPrevisualizacion();
    }
}

// ===== NAVEGACIÓN POR SECCIONES =====
function configurarNavegacion() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const scrollTopBtn = document.querySelector('.scroll-to-top');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    actualizarMenuActivo(targetId);
                }
            }
        });
    });

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        let currentSection = '';

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop && 
                scrollPosition < section.offsetTop + section.clientHeight) {
                currentSection = '#' + section.id;
            }
        });

        if (currentSection) actualizarMenuActivo(currentSection);
        
        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
        }
    });

    function actualizarMenuActivo(targetId) {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === targetId);
        });
    }

    if (scrollTopBtn) {
        const btnScroll = scrollTopBtn.querySelector('.btn-scroll-top');
        btnScroll.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            actualizarMenuActivo('#dashboard');
        });
    }
}

// ===== GESTIÓN DE BOTONES Y ACCIONES =====
function configurarAcciones() {
    // Botón de logout
    document.querySelector('.btn-logout')?.addEventListener('click', () => {
        if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
            mostrarExito('Sesión cerrada correctamente');
            setTimeout(() => window.location.href = '../../index.html', 1500);
        }
    });

    // Botón de notificaciones
    document.querySelector('.btn-notification')?.addEventListener('click', () => {
        mostrarExito('Tienes 3 notificaciones nuevas');
    });

    // Botón para crear nueva habitación desde menú
    document.getElementById('btn-crear-habitacion')?.addEventListener('click', function(e) {
        e.preventDefault();
        redirigirACRUDHabitacion('crear');
    });

    // Botón grande para crear nueva habitación
    document.getElementById('btn-crear-nueva-habitacion')?.addEventListener('click', function() {
        redirigirACRUDHabitacion('crear');
    });

    // Acciones en tarjetas de habitación (EDITAR, ELIMINAR, VER)
    document.querySelectorAll('.room-card .btn-action').forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const accion = this.getAttribute('data-accion') || 
                          (this.classList.contains('edit') ? 'editar' : 
                           this.classList.contains('delete') ? 'eliminar' : 'ver');
            
            const datosHabitacion = obtenerDatosHabitacion(this);
            
            switch(accion) {
                case 'editar':
                    redirigirACRUDHabitacion('editar', datosHabitacion);
                    break;
                    
                case 'eliminar':
                    if (confirm(`¿Estás seguro de eliminar la habitación "${datosHabitacion.nombre}"?`)) {
                        redirigirACRUDHabitacion('eliminar', datosHabitacion);
                    }
                    break;
                    
                case 'ver':
                    redirigirACRUDHabitacion('ver', datosHabitacion);
                    break;
                    
                default:
                    redirigirACRUDHabitacion('editar', datosHabitacion);
            }
        });
    });

    // Clic en toda la tarjeta de habitación (para ver detalles)
    document.querySelectorAll('.room-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Solo si no se hizo clic en un botón específico
            if (!e.target.closest('.btn-action')) {
                const botonEditar = card.querySelector('.btn-action.edit');
                if (botonEditar) {
                    const datosHabitacion = obtenerDatosHabitacion(botonEditar);
                    redirigirACRUDHabitacion('ver', datosHabitacion);
                }
            }
        });
    });

    // Botones en tabla de habitaciones ocupadas
    document.querySelectorAll('.rooms-table .btn-action').forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const guestName = row.cells[1].textContent;
            mostrarExito(this.querySelector('.fa-eye') ? 
                `Viendo detalles de reserva de ${guestName}` : 
                `Editando reserva de ${guestName}`);
        });
    });

    // Botón principal de actividades
    document.getElementById('btn-actividades')?.addEventListener('click', mostrarModalActividades);
}

// ===== FORMULARIO AGREGAR HABITACIÓN =====
function configurarFormularioHabitacion() {
    const form = document.querySelector('.add-room-form');
    if (!form) return;

    // Checkboxes de tipo
    document.querySelectorAll('.type-option input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const label = this.parentElement;
            if (this.checked) {
                label.style.cssText = `
                    border-color: var(--primary-color);
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                    box-shadow: var(--shadow-light);
                `;
            } else {
                label.style.cssText = '';
            }
        });
    });

    // Envío del formulario
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const roomId = document.getElementById('room-id').value;

        if (!roomId.trim()) {
            mostrarError('Por favor ingresa un ID o nombre para la habitación');
            return;
        }

        mostrarExito('¡Habitación agregada exitosamente!');
        this.reset();
    });

    // Botón cancelar
    form.querySelector('.btn-secondary')?.addEventListener('click', () => {
        if (confirm('¿Deseas cancelar la creación de la habitación?')) {
            form.reset();
            mostrarExito('Formulario cancelado');
        }
    });
}

// ===== MODAL DE ACTIVIDADES =====
function mostrarModalActividades() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Agregar Nueva Actividad</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="activity-form">
                    <div class="form-group">
                        <label for="activity-name">Nombre de la Actividad</label>
                        <input type="text" id="activity-name" placeholder="Ej: Tour en Kayak" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="activity-description">Descripción</label>
                        <textarea id="activity-description" rows="3" placeholder="Describe la actividad..."></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="activity-type">Tipo</label>
                            <select id="activity-type">
                                <option value="deporte">Deporte</option>
                                <option value="relajacion">Relajación</option>
                                <option value="gastronomia">Gastronomía</option>
                                <option value="cultural">Cultural</option>
                                <option value="aventura">Aventura</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="activity-price">Precio</label>
                            <div class="price-input">
                                <input type="number" id="activity-price" placeholder="0" min="0">
                                <span>Por persona</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="activity-start">Horario Inicio</label>
                            <input type="time" id="activity-start">
                        </div>
                        
                        <div class="form-group">
                            <label for="activity-end">Horario Fin</label>
                            <input type="time" id="activity-end">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Incluido en estadía</label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="activity-included">
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

    const closeModal = () => modal.remove();
    
    modal.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    modal.querySelector('#activity-form').addEventListener('submit', function (e) {
        e.preventDefault();
        mostrarExito('Actividad agregada exitosamente');
        closeModal();
    });
}

async function cargarHabitaciones() {
  const idHotel = Number(localStorage.getItem("idHotel"));
  if (!idHotel) {
    mostrarError("No hay idHotel en sesión. Iniciá sesión otra vez.");
    return;
  }

  const r = await fetch(`/api/anfitrion/habitaciones?idHotel=${idHotel}`);
  const j = await r.json();

  if (!r.ok || !j.ok) {
    mostrarError(j.error || "No se pudieron cargar habitaciones");
    return;
  }

  renderHabitaciones(j.data);   // <- crea el HTML de cards
  configurarAcciones();         // <- vuelve a pegar listeners (botones)
  inicializarCarruseles();      // <- si tus cards usan swiper
}

function renderHabitaciones(lista) {
  const cont = document.querySelector(".rooms-grid"); // poné el selector real de tu HTML
  if (!cont) return;

  cont.innerHTML = lista.map(h => `
    <article class="room-card">
      <div class="room-image">
        <img src="${h.urlFoto || 'https://via.placeholder.com/400x300?text=Sin+foto'}" alt="${h.tipoHabitacion}">
      </div>

      <div class="room-info">
        <h3>${h.tipoHabitacion} - ${h.numero}</h3>
        <p>₡${Number(h.precio || 0).toLocaleString("es-CR")} / noche</p>
        <p>Estado: ${h.estado}</p>

        <div class="room-actions">
          <button class="btn-action edit"
            data-accion="editar"
            data-habitacion-id="${h.idHabitacion}"
            data-habitacion-nombre="${h.tipoHabitacion}"
            data-habitacion-precio="${h.precio}"
            data-habitacion-estado="${h.estado}"
          >
            Editar
          </button>

          <button class="btn-action delete"
            data-accion="eliminar"
            data-habitacion-id="${h.idHabitacion}"
            data-habitacion-nombre="${h.tipoHabitacion}"
          >
            Eliminar
          </button>

          <button class="btn-action view"
            data-accion="ver"
            data-habitacion-id="${h.idHabitacion}"
            data-habitacion-nombre="${h.tipoHabitacion}"
            data-habitacion-precio="${h.precio}"
            data-habitacion-estado="${h.estado}"
          >
            Ver
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  cargarHabitaciones();
});


// ===== INICIALIZACIÓN PRINCIPAL =====
document.addEventListener('DOMContentLoaded', function () {
    console.log('Dashboard de anfitrión cargado');

    // Agregar estilos CSS para animaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Inicializar todos los componentes
    inicializarCarruseles();
    configurarSubidaImagenes();
    configurarNavegacion();
    configurarAcciones();
    configurarFormularioHabitacion();

    // Establecer año actual si hay elementos que lo necesiten
    document.querySelectorAll('.current-year').forEach(span => {
        span.textContent = new Date().getFullYear();
    });
});