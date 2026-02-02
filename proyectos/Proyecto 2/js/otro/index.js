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

const API_BASE = "http://localhost:3001";

async function apiFetch(path, options = {}) {
  const resp = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const data = await resp.json().catch(() => ({}));
  if (!resp.ok || data.ok === false) {
    throw new Error(data.error || `Error HTTP ${resp.status}`);
  }
  return data;
}

function renderAlojamientos(items = []) {
  const grid = document.querySelector(".properties-grid");
  if (!grid) return;

  if (!items.length) {
    grid.innerHTML = `<p class="loading">No hay alojamientos para mostrar.</p>`;
    return;
  }

  grid.innerHTML = items.map(p => `
    <article class="property-card" data-id="${p.idHotel}">
      <div class="property-image">
        <img 
          src="${p.urlFoto || 'https://via.placeholder.com/400x300?text=Sin+foto'}"
          alt="${p.hotel}"
          loading="lazy"
        />
        <button class="wishlist-btn" data-id="${p.idHotel}">
          <i class="far fa-heart"></i>
        </button>
      </div>

      <div class="property-info">
        <div class="property-header">
          <h3 class="property-title">${p.hotel}</h3>
          <div class="property-rating">
            <i class="fas fa-star"></i>
            <span>${Number(p.rating || 4.7).toFixed(1)}</span>
          </div>
        </div>

        <div class="property-details">
          <span class="detail">${p.ubicacion}</span>
        </div>

        <div class="property-amenities">
          <span class="amenity">${p.tipoCama || 'Cama'}</span>
          <span class="amenity">${p.tipoHabitacion || 'Habitación'}</span>
        </div>

        <div class="property-price">
          <span class="price">₡${Number(p.precioMin || 0).toLocaleString("es-CR")}</span>
          <span class="period"> / noche</span>
        </div>
      </div>
    </article>
  `).join("");
}


async function cargarAlojamientos(destino = "") {
  const q = destino ? `?destino=${encodeURIComponent(destino)}` : "";
  const data = await apiFetch(`/api/alojamientos${q}`);
  renderAlojamientos(data.items);
}


document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de inicio cargada');
    
    // Función para agregar/remover de favoritos
    function setupWishlistButtons() {
        document.addEventListener("click", (e) => {
            const btn = e.target.closest(".wishlist-btn");
            if (!btn) return;

            e.stopPropagation();

            const icon = btn.querySelector("i");
            if (!icon) return;

            if (icon.classList.contains("far")) {
            icon.classList.remove("far");
            icon.classList.add("fas");
            icon.style.color = "#ff385c";

            btn.style.transform = "scale(1.3)";
            setTimeout(() => (btn.style.transform = "scale(1)"), 200);

            console.log("Agregado a favoritos");
            } else {
            icon.classList.remove("fas");
            icon.classList.add("far");
            icon.style.color = "";

            console.log("Removido de favoritos");
            }
        });
    }

    
    function setupPropertyCards() {
        document.addEventListener("click", (e) => {
            const card = e.target.closest(".property-card");
            if (!card) return;

            // si le dio al corazón, no navegar
            if (e.target.closest(".wishlist-btn")) return;

            const id = card.dataset.id;
            window.location.href = `detalles.html?id=${encodeURIComponent(id)}`;
        });
    }

    
    // Función para el buscador
    function setupSearch() {
        const searchBtn = document.querySelector('.btn-search');
        if (!searchBtn) return;

        searchBtn.addEventListener('click', async () => {
            const whereInput = document.querySelector('.filter-text');
            const whereText = whereInput ? whereInput.textContent.trim() : '';

            if (!whereText || whereText === 'Buscar destinos') {
            mostrarError('Por favor selecciona un destino primero');
            return;
            }

            try {
            await cargarAlojamientos(whereText);
            mostrarExito(`Resultados para: ${whereText}`);
            } catch (e) {
            mostrarError(e.message);
            }
        });
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

         cargarAlojamientos().catch(e => mostrarError(e.message));
    }
    
    init();
});