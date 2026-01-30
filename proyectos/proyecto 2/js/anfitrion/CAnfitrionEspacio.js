document.addEventListener('DOMContentLoaded', () => {

    const options = document.querySelectorAll('.option-card');
    const btnContinuar = document.querySelector('.btn-primary');
    const btnVolver = document.getElementById('btnVolver');
    const selectionCounter = document.getElementById('selectionCounter');
    const counterText = selectionCounter.querySelector('span');
    const form = document.getElementById('espacio-form');

    let tiposSeleccionados = [];

    // Obtener estado desde localStorage/sessionStorage
    const obtenerEstado = () => {
        const data = localStorage.getItem('estadoAnfitrion') || sessionStorage.getItem('estadoAnfitrion');
        if (!data) return {
            anfitrion: { ubicacion: null, tiposEspacio: [] },
            pasosCompletados: { ubicacion: false, espacio: false },
            ultimaActualizacion: null
        };
        const estado = JSON.parse(data);
        estado.anfitrion ||= { ubicacion: null, tiposEspacio: [] };
        estado.anfitrion.tiposEspacio ||= [];
        estado.pasosCompletados ||= { ubicacion: false, espacio: false };
        return estado;
    };

    const guardarEstado = (estado) => {
        localStorage.setItem('estadoAnfitrion', JSON.stringify(estado));
        sessionStorage.setItem('estadoAnfitrion', JSON.stringify(estado));
    };

    // Actualizar interfaz y contador
    const actualizarInterfaz = () => {
        options.forEach(card => card.classList.toggle('selected', tiposSeleccionados.includes(card.dataset.value)));
        const count = tiposSeleccionados.length;
        counterText.textContent = `${count} opcion${count !== 1 ? 'es' : ''} seleccionada${count !== 1 ? 's' : ''}`;
        form.classList.toggle('has-selection', count > 0);
    };

    // Manejo de selección múltiple
    options.forEach(card => {
        card.setAttribute('tabindex', '0');

        const toggleSeleccion = () => {
            const valor = card.dataset.value;
            if (tiposSeleccionados.includes(valor)) {
                tiposSeleccionados = tiposSeleccionados.filter(v => v !== valor);
            } else {
                tiposSeleccionados.push(valor);
                card.style.animation = 'none';
                setTimeout(() => card.style.animation = 'pulseSelected 0.5s ease', 10);
            }
            actualizarInterfaz();
        };

        card.addEventListener('click', toggleSeleccion);
        card.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleSeleccion()));
    });

    // Botón volver
    btnVolver?.addEventListener('click', () => {
        //const estado = obtenerEstado();
        //estado.anfitrion ||= {};
        //estado.anfitrion.tiposEspacio = tiposSeleccionados;
        //guardarEstado(estado);
        window.location.href = 'CAnfitrionUbicacion.html';
    });

    // Continuar
    btnContinuar?.addEventListener('click', () => {
        if (!tiposSeleccionados.length) return mostrarError('Seleccione al menos una opcion');

        const estado = obtenerEstado();
        estado.anfitrion ||= {};
        estado.anfitrion.tiposEspacio = tiposSeleccionados;
        estado.pasosCompletados ||= {};
        estado.pasosCompletados.espacio = true;
        estado.ultimaActualizacion = new Date().toISOString();
        guardarEstado(estado);

        mostrarExito('Tipos de espacio guardados. Redirigiendo...');
        setTimeout(() => window.location.href = 'CAnfitrionUltimo.html', 1500);
    });

    btnContinuar.addEventListener('click', e => (e.preventDefault(), continuarProceso()));
    form.addEventListener('submit', e => (e.preventDefault(), continuarProceso()));

    // Mensajes
    const mostrarMensaje = (mensaje, tipo = 'error', tiempo = 3000) => {
        const div = document.createElement('div');
        div.className = tipo === 'error' ? 'mensaje-error' : 'mensaje-exito';
        div.innerHTML = `<i class="fas ${tipo === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i><span>${mensaje}</span>`;
        document.body.appendChild(div);
        setTimeout(() => {
            div.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => div.remove(), 300);
        }, tiempo);
    };

    const mostrarError = msg => mostrarMensaje(msg, 'error', 5000);
    const mostrarExito = msg => mostrarMensaje(msg, 'exito', 3000);

    cargarSeleccion();
    console.log('Pagina de espacio cargada. Estado actual:', obtenerEstado());
});
