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

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de inicio cargada');
    
    // Función para agregar/remover de favoritos
    function setupWishlistButtons() {
        const wishlistButtons = document.querySelectorAll('.wishlist-btn');
        
        wishlistButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const icon = this.querySelector('i');
                
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = '#ff385c';
                    
                    this.style.transform = 'scale(1.3)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 200);
                    
                    console.log('Agregado a favoritos');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '';
                    
                    console.log('Removido de favoritos');
                }
            });
        });
    }
    
    function setupPropertyCards() {
        const propertyCards = document.querySelectorAll('.property-card');
        
        propertyCards.forEach(card => {
            card.addEventListener('click', function() {
                const propertyTitle = this.querySelector('.property-title').textContent;
                console.log(`Ver detalles de: ${propertyTitle}`);
                
                // Aquí normalmente redirigirías a la página de detalles
                // window.location.href = `detalles.html?id=${propertyId}`;
                
                // Por ahora solo mostramos un mensaje
                alert(`Redirigiendo a detalles de: ${propertyTitle}`);
            });
        });
    }
    
    // Función para el buscador
    function setupSearch() {
        const searchBtn = document.querySelector('.btn-search');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                const whereInput = document.querySelector('.filter-text');
                const whereText = whereInput ? whereInput.textContent : '';
                
                if (whereText === 'Buscar destinos') {
                    mostrarError('Por favor selecciona un destino primero');
                    return;
                }
                
                console.log(`Buscando alojamientos en: ${whereText}`);
                alert(`Buscando alojamientos en: ${whereText}`);
            });
        }
    }
    
    // Función para los filtros
    function setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterType = this.querySelector('span:first-child').textContent;
                console.log(`Abrir selector de: ${filterType}`);
                
                // Aquí normalmente abrirías un modal o dropdown
                switch(filterType) {
                    case 'Dónde':
                        alert('Se abriría el selector de ubicaciones');
                        break;
                    case 'Llegada':
                        alert('Se abriría el calendario de llegada');
                        break;
                    case 'Salida':
                        alert('Se abriría el calendario de salida');
                        break;
                    case 'Quiénes':
                        alert('Se abriría el selector de huéspedes');
                        break;
                }
            });
        });
    }
    
    function setupScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        const sections = document.querySelectorAll('.destinations-section, .inspiration-section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(section);
        });
    }
    
    function init() {
        setupWishlistButtons();
        setupPropertyCards();
        setupSearch();
        setupFilters();
        setupScrollAnimations();
        
        const yearSpan = document.querySelector('.current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }
    
    init();
});