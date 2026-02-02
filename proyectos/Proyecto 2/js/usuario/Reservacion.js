// ===== DATOS DE EJEMPLO =====
const habitacionesDisponibles = [
    {
        id: 1,
        nombre: "Casa frente al mar con piscina privada",
        descripcion: "Hermosa casa con vista panorámica al mar y piscina privada. Perfecta para una escapada romántica.",
        precio: 120,
        capacidad: 3,
        camas: 2,
        banos: 1,
        imagenes: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32"],
        servicios: ["Wifi", "TV", "Aire acondicionado", "Cocina equipada", "Piscina privada", "Estacionamiento"],
        estado: "disponible",
        ubicacion: "Manzanillo",
        calificacion: 4.8
    },
    {
        id: 2,
        nombre: "Departamento moderno con vista al océano",
        descripcion: "Apartamento completamente amueblado con balcón y vista espectacular al océano Pacífico.",
        precio: 95,
        capacidad: 4,
        camas: 3,
        banos: 1.5,
        imagenes: ["https://images.unsplash.com/photo-1549294413-26f195200c16"],
        servicios: ["Wifi", "TV por cable", "A/C", "Cocina", "Lavadora", "Secadora"],
        estado: "disponible",
        ubicacion: "Manzanillo",
        calificacion: 4.9
    },
    {
        id: 3,
        nombre: "Cabaña ecológica en la selva tropical",
        descripcion: "Cabaña sostenible rodeada de naturaleza, ideal para desconectar y conectar con la naturaleza.",
        precio: 75,
        capacidad: 2,
        camas: 1,
        banos: 1,
        imagenes: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"],
        servicios: ["Wifi básico", "Desayuno incluido", "Terraza", "Hamaca", "Tour guiado"],
        estado: "ocupada",
        ubicacion: "Manzanillo",
        calificacion: 4.7
    },
    {
        id: 4,
        nombre: "Villa de lujo con jacuzzi y vista panorámica",
        descripcion: "Exclusiva villa con todas las comodidades, jacuzzi privado y servicio de conserjería.",
        precio: 320,
        capacidad: 8,
        camas: 6,
        banos: 3,
        imagenes: ["https://images.unsplash.com/photo-1580582932707-520aed937b7b"],
        servicios: ["Wifi fibra óptica", "TV 4K", "Jacuzzi", "Chef disponible", "Limpieza diaria", "Piscina"],
        estado: "disponible",
        ubicacion: "Cocles",
        calificacion: 5.0
    }
];

const reservasHistorial = [
    {
        id: "RES-2024001",
        habitacion: "Suite Ejecutiva",
        checkIn: "2024-11-15",
        checkOut: "2024-11-18",
        estado: "confirmada",
        total: 540,
        huesped: "Juan Pérez",
        email: "juan@email.com",
        telefono: "+506 8888 8888"
    },
    {
        id: "RES-2024002",
        habitacion: "Habitación Deluxe",
        checkIn: "2024-11-10",
        checkOut: "2024-11-12",
        estado: "completada",
        total: 240,
        huesped: "María González",
        email: "maria@email.com",
        telefono: "+506 7777 7777"
    }
];

let reservaActual = null;
let facturaActual = null;
let habitacionSeleccionada = null;

// ===== FUNCIONES UTILITARIAS =====
function mostrarMensaje(mensaje, tipo = 'exito', tiempo = 3000) {
    const div = document.createElement('div');
    div.className = `mensaje mensaje-${tipo}`;
    div.innerHTML = `
        <i class="fas ${tipo === 'exito' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${mensaje}</span>
    `;
    document.body.appendChild(div);

    setTimeout(() => {
        div.style.animation = 'slideInRight 0.3s ease-out reverse forwards';
        setTimeout(() => div.remove(), 300);
    }, tiempo);
}

function formatearMoneda(monto) {
    return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC'
    }).format(monto);
}

function calcularDias(checkIn, checkOut) {
    const inicio = new Date(checkIn);
    const fin = new Date(checkOut);
    const diferencia = fin.getTime() - inicio.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-CR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ===== PROCESAR DATOS DE LA PÁGINA PRINCIPAL =====
function procesarParametrosURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('reservar')) {
        const habitacionId = parseInt(urlParams.get('id'));
        const habitacion = habitacionesDisponibles.find(h => h.id === habitacionId);
        
        if (habitacion) {
            // Mostrar información de la habitación seleccionada
            document.getElementById('titulo-reserva').textContent = `Reservar: ${habitacion.nombre}`;
            document.getElementById('descripcion-reserva').textContent = habitacion.descripcion;
            
            // Rellenar datos automáticamente si están en la URL
            if (urlParams.has('nombre')) {
                document.getElementById('nombre').value = urlParams.get('nombre');
            }
            if (urlParams.has('email')) {
                document.getElementById('email').value = urlParams.get('email');
            }
            
            // Seleccionar automáticamente la habitación
            setTimeout(() => {
                seleccionarHabitacionDesdeURL(habitacion);
            }, 500);
        }
    }
}

function seleccionarHabitacionDesdeURL(habitacion) {
    habitacionSeleccionada = habitacion;
    mostrarHabitacionSeleccionada();
    
    // Mostrar mensaje
    mostrarMensaje(`Habitación "${habitacion.nombre}" cargada desde la página principal`, 'exito');
}

function mostrarHabitacionSeleccionada() {
    if (!habitacionSeleccionada) return;
    
    const container = document.getElementById('room-selected-container');
    container.style.display = 'block';
    
    // Actualizar información
    document.getElementById('selected-room-img').src = habitacionSeleccionada.imagenes[0] + '?w=400&h=300&fit=crop';
    document.getElementById('selected-room-name').textContent = habitacionSeleccionada.nombre;
    document.getElementById('selected-room-desc').textContent = habitacionSeleccionada.descripcion;
    document.getElementById('selected-room-capacity').textContent = `${habitacionSeleccionada.capacidad} huéspedes`;
    document.getElementById('selected-room-beds').textContent = `${habitacionSeleccionada.camas} ${habitacionSeleccionada.camas > 1 ? 'camas' : 'cama'}`;
    document.getElementById('selected-room-baths').textContent = `${habitacionSeleccionada.banos} ${habitacionSeleccionada.banos > 1 ? 'baños' : 'baño'}`;
    document.getElementById('selected-room-price-night').textContent = formatearMoneda(habitacionSeleccionada.precio);
    
    // Actualizar servicios
    const serviciosContainer = document.getElementById('selected-room-services');
    serviciosContainer.innerHTML = '';
    habitacionSeleccionada.servicios.forEach(servicio => {
        const badge = document.createElement('span');
        badge.className = 'service-badge';
        badge.textContent = servicio;
        serviciosContainer.appendChild(badge);
    });
    
    // Calcular precio total si hay fechas seleccionadas
    const checkIn = document.getElementById('fecha-entrada').value;
    const checkOut = document.getElementById('fecha-salida').value;
    
    if (checkIn && checkOut) {
        const dias = calcularDias(checkIn, checkOut);
        const total = habitacionSeleccionada.precio * dias;
        document.getElementById('selected-room-price-total').textContent = formatearMoneda(total);
    }
}

// ===== GESTIÓN DE PESTAÑAS =====
function configurarPestanas() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Actualizar botones activos
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Mostrar contenido activo
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
            
            // Cargar datos según la pestaña
            if (tabId === 'reservar') {
                cargarHabitacionesDisponibles();
            } else if (tabId === 'mis-reservas') {
                cargarHistorialReservas();
            }
        });
    });
}

// ===== CARGAR HABITACIONES DISPONIBLES =====
function cargarHabitacionesDisponibles() {
    const contenedor = document.getElementById('habitaciones-disponibles');
    contenedor.innerHTML = '';

    const filtro = document.getElementById('tipo-habitacion')?.value;
    let habitaciones = habitacionesDisponibles;

    if (filtro && filtro !== 'todas') {
        habitaciones = habitaciones.filter(h => 
            h.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
            h.descripcion.toLowerCase().includes(filtro.toLowerCase())
        );
    }

    habitaciones.forEach(habitacion => {
        const card = document.createElement('div');
        card.className = 'room-card';
        card.innerHTML = `
            <div class="room-image">
                <img src="${habitacion.imagenes[0]}?w=400&h=250&fit=crop" alt="${habitacion.nombre}">
                <span class="room-status ${habitacion.estado}">
                    ${habitacion.estado === 'disponible' ? 'Disponible' : 'Ocupada'}
                </span>
            </div>
            <div class="room-info">
                <h3 class="room-title">${habitacion.nombre}</h3>
                <div class="room-details">
                    <span class="detail">
                        <i class="fas fa-users"></i>
                        ${habitacion.capacidad} huéspedes
                    </span>
                    <span class="detail">
                        <i class="fas fa-bed"></i>
                        ${habitacion.camas} ${habitacion.camas > 1 ? 'camas' : 'cama'}
                    </span>
                    <span class="detail">
                        <i class="fas fa-bath"></i>
                        ${habitacion.banos} ${habitacion.banos > 1 ? 'baños' : 'baño'}
                    </span>
                    <span class="detail">
                        <i class="fas fa-map-marker-alt"></i>
                        ${habitacion.ubicacion}
                    </span>
                </div>
                <div class="room-services-badges">
                    ${habitacion.servicios.slice(0, 3).map(servicio => 
                        `<span class="service-tag">${servicio}</span>`
                    ).join('')}
                    ${habitacion.servicios.length > 3 ? 
                        `<span class="service-tag">+${habitacion.servicios.length - 3} más</span>` : ''
                    }
                </div>
                <div class="room-price">
                    <span class="price">${formatearMoneda(habitacion.precio)}</span>
                    <span class="period"> / noche</span>
                </div>
                <div class="room-actions">
                    <button class="btn btn-secondary btn-sm btn-detalles" data-id="${habitacion.id}">
                        <i class="fas fa-info-circle"></i> Detalles
                    </button>
                    <button class="btn btn-primary btn-sm btn-seleccionar" data-id="${habitacion.id}"
                            ${habitacion.estado !== 'disponible' ? 'disabled' : ''}>
                        <i class="fas fa-calendar-plus"></i> Seleccionar
                    </button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });

    // Agregar eventos a los botones
    document.querySelectorAll('.btn-seleccionar').forEach(button => {
        button.addEventListener('click', function() {
            const habitacionId = parseInt(this.getAttribute('data-id'));
            const habitacion = habitacionesDisponibles.find(h => h.id === habitacionId);
            if (habitacion) {
                habitacionSeleccionada = habitacion;
                mostrarHabitacionSeleccionada();
                mostrarMensaje('Habitación seleccionada', 'exito');
            }
        });
    });

    document.querySelectorAll('.btn-detalles').forEach(button => {
        button.addEventListener('click', function() {
            const habitacionId = parseInt(this.getAttribute('data-id'));
            mostrarDetallesHabitacion(habitacionId);
        });
    });
}

// ===== MOSTRAR DETALLES DE HABITACIÓN =====
function mostrarDetallesHabitacion(id) {
    const habitacion = habitacionesDisponibles.find(h => h.id === id);
    if (!habitacion) return;

    document.getElementById('modalDetallesTitulo').textContent = habitacion.nombre;
    
    const contenido = document.getElementById('modalDetallesContenido');
    contenido.innerHTML = `
        <div class="detalles-grid">
            <div class="detalle-imagen">
                <img src="${habitacion.imagenes[0]}?w=600&h=400&fit=crop" alt="${habitacion.nombre}">
            </div>
            <div class="detalles-info">
                <p><strong>Descripción:</strong> ${habitacion.descripcion}</p>
                <div class="detalles-especificaciones">
                    <h4>Especificaciones:</h4>
                    <ul>
                        <li><i class="fas fa-users"></i> Capacidad: ${habitacion.capacidad} huéspedes</li>
                        <li><i class="fas fa-bed"></i> Camas: ${habitacion.camas}</li>
                        <li><i class="fas fa-bath"></i> Baños: ${habitacion.banos}</li>
                        <li><i class="fas fa-map-marker-alt"></i> Ubicación: ${habitacion.ubicacion}</li>
                        <li><i class="fas fa-star"></i> Calificación: ${habitacion.calificacion}/5</li>
                    </ul>
                </div>
                <div class="detalles-servicios">
                    <h4>Servicios incluidos:</h4>
                    <div class="servicios-lista">
                        ${habitacion.servicios.map(servicio => 
                            `<span class="servicio-item"><i class="fas fa-check"></i> ${servicio}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="detalles-precio">
                    <h4>Precio:</h4>
                    <div class="precio-display">
                        <span class="precio-noche">${formatearMoneda(habitacion.precio)} por noche</span>
                        <span class="estado-habitacion ${habitacion.estado}">${habitacion.estado === 'disponible' ? 'Disponible' : 'No disponible'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modalDetalles').classList.add('active');
}

// ===== SELECCIONAR HABITACIÓN =====
function configurarSeleccionHabitacion() {
    document.getElementById('fecha-entrada').addEventListener('change', actualizarResumen);
    document.getElementById('fecha-salida').addEventListener('change', actualizarResumen);
    document.getElementById('huespedes').addEventListener('change', actualizarResumen);
    
    document.getElementById('tipo-habitacion').addEventListener('change', cargarHabitacionesDisponibles);
}

function actualizarResumen() {
    if (!habitacionSeleccionada) {
        mostrarMensaje('Por favor selecciona una habitación primero', 'error');
        return;
    }

    const checkIn = document.getElementById('fecha-entrada').value;
    const checkOut = document.getElementById('fecha-salida').value;
    const huespedes = document.getElementById('huespedes').value;

    if (!checkIn || !checkOut) {
        mostrarMensaje('Por favor selecciona las fechas de entrada y salida', 'error');
        return;
    }

    const dias = calcularDias(checkIn, checkOut);
    if (dias <= 0) {
        mostrarMensaje('La fecha de salida debe ser posterior a la fecha de entrada', 'error');
        return;
    }

    if (parseInt(huespedes) > habitacionSeleccionada.capacidad) {
        mostrarMensaje(`Esta habitación solo tiene capacidad para ${habitacionSeleccionada.capacidad} huéspedes`, 'error');
        return;
    }

    const subtotal = habitacionSeleccionada.precio * dias;
    const iva = subtotal * 0.13; // 13% IVA Costa Rica
    const total = subtotal + iva;

    reservaActual = {
        habitacion: habitacionSeleccionada.nombre,
        precioNoche: habitacionSeleccionada.precio,
        checkIn: checkIn,
        checkOut: checkOut,
        dias: dias,
        huespedes: huespedes,
        subtotal: subtotal,
        iva: iva,
        total: total
    };

    // Actualizar resumen
    document.getElementById('res-habitacion').textContent = habitacionSeleccionada.nombre;
    document.getElementById('res-checkin').textContent = formatearFecha(checkIn);
    document.getElementById('res-checkout').textContent = formatearFecha(checkOut);
    document.getElementById('res-duracion').textContent = `${dias} ${dias > 1 ? 'noches' : 'noche'}`;
    document.getElementById('res-huespedes').textContent = `${huespedes} ${parseInt(huespedes) > 1 ? 'huéspedes' : 'huésped'}`;
    document.getElementById('res-precio-noche').textContent = formatearMoneda(habitacionSeleccionada.precio);
    document.getElementById('res-subtotal').textContent = formatearMoneda(subtotal);
    document.getElementById('res-iva').textContent = formatearMoneda(iva);
    document.getElementById('res-total').textContent = formatearMoneda(total);

    // Actualizar precio total en habitación seleccionada
    document.getElementById('selected-room-price-total').textContent = formatearMoneda(total);

    // Mostrar resumen
    document.getElementById('resumen-reserva').style.display = 'block';
}

// ===== CONFIRMAR RESERVA =====
function configurarConfirmacionReserva() {
    document.getElementById('confirmar-reserva').addEventListener('click', function() {
        if (!reservaActual) {
            mostrarMensaje('Por favor selecciona una habitación primero', 'error');
            return;
        }

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const documento = document.getElementById('documento').value;

        if (!nombre || !email || !telefono || !documento) {
            mostrarMensaje('Por favor completa todos los datos personales', 'error');
            return;
        }

        // Mostrar modal de confirmación
        document.getElementById('modalTitulo').textContent = 'Confirmar Reserva';
        document.getElementById('modalMensaje').textContent = 
            `¿Confirmas la reserva de "${reservaActual.habitacion}" por ${reservaActual.dias} noches por un total de ${formatearMoneda(reservaActual.total)}?`;
        
        document.getElementById('modalConfirmacion').classList.add('active');
        
        // Configurar acción de confirmación
        document.getElementById('confirmarModal').onclick = function() {
            // Generar número de reserva
            const reservaId = 'RES-' + Date.now().toString().slice(-6);
            
            // Agregar al historial
            reservasHistorial.unshift({
                id: reservaId,
                habitacion: reservaActual.habitacion,
                checkIn: reservaActual.checkIn,
                checkOut: reservaActual.checkOut,
                estado: 'confirmada',
                total: reservaActual.total,
                huesped: nombre,
                email: email,
                telefono: telefono,
                documento: documento
            });

            // Actualizar historial en localStorage
            guardarReservaEnStorage({
                id: reservaId,
                ...reservaActual,
                nombre: nombre,
                email: email,
                telefono: telefono,
                documento: documento,
                fechaReserva: new Date().toISOString()
            });

            // Mostrar confirmación
            mostrarMensaje(`¡Reserva ${reservaId} confirmada exitosamente!`, 'exito');
            
            // Limpiar formulario
            limpiarReserva();
            
            // Cerrar modal
            document.getElementById('modalConfirmacion').classList.remove('active');
            
            // Cambiar a pestaña de mis reservas
            document.querySelector('[data-tab="mis-reservas"]').click();
            
            // Enviar confirmación por email (simulado)
            enviarConfirmacionEmail(nombre, email, reservaId);
        };
    });
}

// ===== GUARDAR RESERVA EN STORAGE =====
function guardarReservaEnStorage(reserva) {
    let reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
    reservas.unshift(reserva);
    localStorage.setItem('misReservas', JSON.stringify(reservas));
}

// ===== ENVIAR CONFIRMACIÓN EMAIL (SIMULADO) =====
function enviarConfirmacionEmail(nombre, email, reservaId) {
    console.log(`Email enviado a ${email}:`);
    console.log(`Estimado/a ${nombre},`);
    console.log(`Su reserva ${reservaId} ha sido confirmada exitosamente.`);
    console.log(`Total: ${formatearMoneda(reservaActual.total)}`);
    console.log('Gracias por su reserva.');
}

// ===== LIMPIAR RESERVA =====
function limpiarReserva() {
    reservaActual = null;
    habitacionSeleccionada = null;
    document.getElementById('resumen-reserva').style.display = 'none';
    document.getElementById('room-selected-container').style.display = 'none';
    mostrarMensaje('Reserva limpiada', 'exito');
}

document.getElementById('limpiar-reserva').addEventListener('click', limpiarReserva);

// ===== BUSCAR RESERVA PARA FACTURAR =====
function configurarBusquedaReserva() {
    document.getElementById('buscar-reserva').addEventListener('click', function() {
        const numReserva = document.getElementById('num-reserva').value;
        const docHuesped = document.getElementById('doc-huesped').value;

        // Buscar en localStorage primero
        let reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
        let reserva = reservas.find(r => 
            r.id === numReserva || r.documento === docHuesped
        );

        // Si no se encuentra en localStorage, buscar en datos de ejemplo
        if (!reserva) {
            reserva = reservasHistorial.find(r => 
                r.id === numReserva || r.huesped.includes(docHuesped)
            );
        }

        if (reserva) {
            facturaActual = {
                ...reserva,
                subtotal: reserva.total / 1.13,
                iva: reserva.total * 0.13 / 1.13
            };

            // Actualizar detalles
            document.getElementById('fact-reserva').textContent = reserva.id;
            document.getElementById('fact-huesped').textContent = reserva.huesped || reserva.nombre;
            document.getElementById('fact-habitacion').textContent = reserva.habitacion;
            document.getElementById('fact-checkin').textContent = formatearFecha(reserva.checkIn);
            document.getElementById('fact-checkout').textContent = formatearFecha(reserva.checkOut);
            document.getElementById('fact-noches').textContent = calcularDias(reserva.checkIn, reserva.checkOut);
            document.getElementById('fact-subtotal').textContent = formatearMoneda(facturaActual.subtotal);
            document.getElementById('fact-iva').textContent = formatearMoneda(facturaActual.iva);
            document.getElementById('fact-total').textContent = formatearMoneda(reserva.total);

            // Actualizar datos de facturación si están disponibles
            if (reserva.documento) {
                document.getElementById('identificacion').value = reserva.documento;
            }
            if (reserva.email) {
                document.getElementById('email-factura').value = reserva.email;
            }
            if (reserva.telefono) {
                document.getElementById('telefono-factura').value = reserva.telefono;
            }

            // Mostrar sección
            document.getElementById('detalles-facturacion').style.display = 'block';
            mostrarMensaje('Reserva encontrada', 'exito');
        } else {
            mostrarMensaje('No se encontró la reserva', 'error');
        }
    });
}

// ===== GENERAR FACTURA =====
function configurarGenerarFactura() {
    document.getElementById('generar-factura').addEventListener('click', function() {
        if (!facturaActual) {
            mostrarMensaje('No hay una reserva seleccionada', 'error');
            return;
        }

        // Generar factura en PDF (simulado)
        mostrarMensaje(`Factura generada para ${facturaActual.id}`, 'exito');
        
        // Simular descarga
        const link = document.createElement('a');
        link.href = '#';
        link.download = `Factura-${facturaActual.id}.pdf`;
        link.click();
        
        // Enviar factura por email (simulado)
        const email = document.getElementById('email-factura').value;
        if (email) {
            console.log(`Factura enviada a: ${email}`);
        }
    });
}

// ===== PAGAR FACTURA =====
function configurarPagoFactura() {
    document.getElementById('pagar-factura').addEventListener('click', function() {
        if (!facturaActual) {
            mostrarMensaje('No hay una factura para pagar', 'error');
            return;
        }

        // Mostrar modal de pago
        document.getElementById('modalTotalPago').textContent = formatearMoneda(facturaActual.total);
        document.getElementById('modalPago').classList.add('active');
    });
}

// ===== CARGAR HISTORIAL DE RESERVAS =====
function cargarHistorialReservas() {
    const tbody = document.getElementById('historial-reservas');
    tbody.innerHTML = '';

    // Cargar reservas de localStorage
    let reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
    
    // Combinar con datos de ejemplo
    reservas = [...reservas, ...reservasHistorial.filter(r => 
        !reservas.some(lr => lr.id === r.id)
    )];

    if (reservas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="no-reservas">
                    <i class="fas fa-calendar-times"></i>
                    <p>No tienes reservas aún</p>
                </td>
            </tr>
        `;
        return;
    }

    reservas.forEach(reserva => {
        const fila = document.createElement('tr');

        let estadoColor = '';
        let estadoIcon = '';
        switch(reserva.estado) {
            case 'confirmada':
                estadoColor = 'var(--primary-color)';
                estadoIcon = 'fa-clock';
                break;
            case 'completada':
                estadoColor = 'var(--secondary-color)';
                estadoIcon = 'fa-check-circle';
                break;
            case 'cancelada':
                estadoColor = 'var(--danger-color)';
                estadoIcon = 'fa-times-circle';
                break;
        }

        fila.innerHTML = `
            <td><strong>${reserva.id}</strong></td>
            <td>${reserva.habitacion}</td>
            <td>${formatearFecha(reserva.checkIn)}</td>
            <td>${formatearFecha(reserva.checkOut)}</td>
            <td>
                <span class="estado-reserva" style="color: ${estadoColor}">
                    <i class="fas ${estadoIcon}"></i>
                    ${reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                </span>
            </td>
            <td><strong>${formatearMoneda(reserva.total)}</strong></td>
            <td>
                <div class="acciones-reserva">
                    <button class="btn btn-sm btn-detalle-reserva" data-id="${reserva.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-facturar-reserva" data-id="${reserva.id}">
                        <i class="fas fa-file-invoice"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(fila);
    });

    // Agregar eventos a los botones
    document.querySelectorAll('.btn-detalle-reserva').forEach(btn => {
        btn.addEventListener('click', function() {
            const reservaId = this.getAttribute('data-id');
            mostrarDetallesReserva(reservaId);
        });
    });

    document.querySelectorAll('.btn-facturar-reserva').forEach(btn => {
        btn.addEventListener('click', function() {
            const reservaId = this.getAttribute('data-id');
            facturarReserva(reservaId);
        });
    });
}

// ===== MOSTRAR DETALLES DE RESERVA =====
function mostrarDetallesReserva(reservaId) {
    let reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
    let reserva = reservas.find(r => r.id === reservaId);
    
    if (!reserva) {
        reserva = reservasHistorial.find(r => r.id === reservaId);
    }
    
    if (!reserva) return;

    document.getElementById('modalDetallesTitulo').textContent = `Detalles: ${reservaId}`;
    
    const contenido = document.getElementById('modalDetallesContenido');
    contenido.innerHTML = `
        <div class="detalles-reserva">
            <div class="detalle-item">
                <strong>Habitación:</strong> ${reserva.habitacion}
            </div>
            <div class="detalle-item">
                <strong>Check-in:</strong> ${formatearFecha(reserva.checkIn)}
            </div>
            <div class="detalle-item">
                <strong>Check-out:</strong> ${formatearFecha(reserva.checkOut)}
            </div>
            <div class="detalle-item">
                <strong>Duración:</strong> ${calcularDias(reserva.checkIn, reserva.checkOut)} noches
            </div>
            <div class="detalle-item">
                <strong>Huésped:</strong> ${reserva.huesped || reserva.nombre}
            </div>
            ${reserva.email ? `<div class="detalle-item"><strong>Email:</strong> ${reserva.email}</div>` : ''}
            ${reserva.telefono ? `<div class="detalle-item"><strong>Teléfono:</strong> ${reserva.telefono}</div>` : ''}
            ${reserva.documento ? `<div class="detalle-item"><strong>Documento:</strong> ${reserva.documento}</div>` : ''}
            <div class="detalle-item">
                <strong>Estado:</strong> 
                <span class="estado-badge ${reserva.estado}">${reserva.estado}</span>
            </div>
            <div class="detalle-item total-detalle">
                <strong>Total:</strong> ${formatearMoneda(reserva.total)}
            </div>
            ${reserva.fechaReserva ? 
                `<div class="detalle-item">
                    <strong>Fecha de reserva:</strong> ${formatearFecha(reserva.fechaReserva)}
                </div>` : ''
            }
        </div>
    `;
    
    document.getElementById('modalDetalles').classList.add('active');
}

// ===== FACTURAR RESERVA DESDE HISTORIAL =====
function facturarReserva(reservaId) {
    // Cambiar a pestaña de facturación
    document.querySelector('[data-tab="facturar"]').click();
    
    // Buscar la reserva
    let reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
    let reserva = reservas.find(r => r.id === reservaId);
    
    if (!reserva) {
        reserva = reservasHistorial.find(r => r.id === reservaId);
    }
    
    if (reserva) {
        // Rellenar campo de búsqueda
        document.getElementById('num-reserva').value = reservaId;
        
        // Simular clic en buscar
        setTimeout(() => {
            document.getElementById('buscar-reserva').click();
        }, 500);
    }
}

// ===== ACTUALIZAR HISTORIAL =====
document.getElementById('actualizar-reservas').addEventListener('click', function() {
    cargarHistorialReservas();
    mostrarMensaje('Historial actualizado', 'exito');
});

// ===== MODALES =====
function configurarModales() {
    // Modal de confirmación
    document.getElementById('cancelarModal').addEventListener('click', function() {
        document.getElementById('modalConfirmacion').classList.remove('active');
    });

    // Modal de pago
    document.getElementById('cancelarPago').addEventListener('click', function() {
        document.getElementById('modalPago').classList.remove('active');
    });

    document.getElementById('procesarPago').addEventListener('click', function() {
        // Validar datos de tarjeta
        const numeroTarjeta = document.getElementById('numero-tarjeta').value;
        const fechaExpiracion = document.getElementById('fecha-expiracion').value;
        const cvv = document.getElementById('cvv-tarjeta').value;
        const nombreTarjeta = document.getElementById('nombre-tarjeta').value;

        if (!numeroTarjeta || !fechaExpiracion || !cvv || !nombreTarjeta) {
            mostrarMensaje('Por favor completa todos los datos de la tarjeta', 'error');
            return;
        }

        // Simular procesamiento de pago
        mostrarMensaje('Procesando pago...', 'exito');
        
        setTimeout(() => {
            document.getElementById('modalPago').classList.remove('active');
            mostrarMensaje('Pago procesado exitosamente', 'exito');
            
            if (facturaActual) {
                facturaActual.estado = 'pagada';
                document.getElementById('estado-factura').innerHTML = 
                    '<i class="fas fa-check-circle"></i> Pagada';
                document.getElementById('estado-factura').style.color = 'var(--secondary-color)';
                
                // Actualizar en localStorage
                let reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
                const index = reservas.findIndex(r => r.id === facturaActual.id);
                if (index !== -1) {
                    reservas[index].estado = 'pagada';
                    localStorage.setItem('misReservas', JSON.stringify(reservas));
                }
            }
        }, 2000);
    });

    // Modal detalles
    document.getElementById('cerrarDetalles').addEventListener('click', function() {
        document.getElementById('modalDetalles').classList.remove('active');
    });

    // Cerrar modales al hacer clic fuera
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

// ===== VALIDACIONES DE FECHAS =====
function configurarValidacionesFechas() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-entrada').min = hoy;
    
    document.getElementById('fecha-entrada').addEventListener('change', function() {
        const checkIn = this.value;
        document.getElementById('fecha-salida').min = checkIn;
        
        if (document.getElementById('fecha-salida').value && 
            document.getElementById('fecha-salida').value < checkIn) {
            document.getElementById('fecha-salida').value = '';
        }
        
        if (habitacionSeleccionada) {
            actualizarResumen();
        }
    });
}

// ===== INICIALIZACIÓN =====
function inicializarSistema() {
    console.log('Sistema de reservas cargado');
    
    // Procesar parámetros de la URL primero
    procesarParametrosURL();
    
    // Configurar todos los componentes
    configurarPestanas();
    configurarSeleccionHabitacion();
    configurarConfirmacionReserva();
    configurarBusquedaReserva();
    configurarGenerarFactura();
    configurarPagoFactura();
    configurarModales();
    configurarValidacionesFechas();
    
    // Cargar datos iniciales
    cargarHabitacionesDisponibles();
    cargarHistorialReservas();
    
    // Establecer fecha mínima para check-in
    const hoy = new Date().toISOString().split('T')[0];
    const fechaInput = document.getElementById('fecha-entrada');
    if (!fechaInput.value) {
        fechaInput.value = hoy;
        fechaInput.min = hoy;
    }
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        mostrarMensaje('Bienvenido al sistema de reservas y facturación', 'exito');
    }, 1000);
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarSistema);