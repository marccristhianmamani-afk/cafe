// 1. SIMULACIÓN DE ENDPOINTS (MOCK API)
// Esto imita a los microservicios de Spring Boot y Django
const apiEndpoints = {
    getMenu: async () => {
        return new Promise(resolve => {
            setTimeout(() => { // Simulamos 0.5s de latencia de red
                resolve([
                    { id: 1, nombre: "Espresso Doble", desc: "El clásico para despertar.", precio: 6.50 },
                    { id: 2, nombre: "Capuccino Vainilla", desc: "Espresso, leche cremosa y vainilla.", precio: 9.00 },
                    { id: 3, nombre: "Croissant Francés", desc: "Horneado esta mañana.", precio: 5.50 },
                    { id: 4, nombre: "Sándwich Chicharrón", desc: "Tradición arequipeña en pan artesanal.", precio: 14.00 }
                ]);
            }, 500);
        });
    }
};

// 2. ESTADO GLOBAL (Simulando Redux / Context API)
let carrito = [];

// 3. ENRUTADOR DINÁMICO (Simulando React Router)
const router = async () => {
    const path = window.location.hash || '#inicio'; // Endpoint del frontend
    const root = document.getElementById('app-root');
    root.innerHTML = '<div style="text-align:center; margin-top:3rem;"><h3>Cargando sistema de Radio Café... 📻☕</h3></div>';

    if (path === '#inicio') {
        root.innerHTML = `
            <section class="hero">
                <h1>Sintoniza con <span>Radio Café</span></h1>
                <p>El mejor ambiente y café de especialidad en Arequipa.</p>
                <a href="#menu" class="btn-primary">Ver Menú Digital</a>
            </section>
        `;
    } 
    else if (path === '#menu') {
        const productos = await apiEndpoints.getMenu(); // Llamada al endpoint
        let html = '<h2>Menú Digital</h2><div class="menu-grid">';
        productos.forEach(p => {
            html += `
                <div class="card">
                    <h3>${p.nombre}</h3>
                    <p style="color:#666; font-size:0.9rem;">${p.desc}</p>
                    <span class="price">S/ ${p.precio.toFixed(2)}</span>
                    <button class="btn-primary" onclick="agregarAlCarrito(${p.id}, '${p.nombre}', ${p.precio})">Agregar 🛒</button>
                </div>
            `;
        });
        html += '</div>';
        root.innerHTML = html;
    } 
    else if (path === '#carrito') {
        if (carrito.length === 0) {
            root.innerHTML = '<div class="alert">Tu carrito está vacío. ¡Anímate a pedir algo! ☕</div>';
            return;
        }
        let total = carrito.reduce((sum, item) => sum + item.precio, 0);
        let html = '<h2>Tu Pedido</h2><ul style="list-style:none; padding:0;">';
        carrito.forEach((item, index) => {
            html += `<li style="background:white; margin-bottom:10px; padding:15px; border-radius:8px; display:flex; justify-content:space-between;">
                        <span>${item.nombre}</span>
                        <strong>S/ ${item.precio.toFixed(2)}</strong>
                     </li>`;
        });
        html += `</ul><h3 style="text-align:right">Total a pagar: S/ ${total.toFixed(2)}</h3>
                 <button class="btn-primary" style="width:100%" onclick="enviarPedido()">Confirmar Pedido con Django/Stripe 🚀</button>`;
        root.innerHTML = html;
    }
};

// 4. FUNCIONES DE LÓGICA DE NEGOCIO
window.agregarAlCarrito = (id, nombre, precio) => {
    carrito.push({ id, nombre, precio });
    document.getElementById('cart-count').innerText = carrito.length;
    alert(`¡${nombre} añadido al carrito!`);
};

window.enviarPedido = () => {
    alert("¡Pedido enviado a cocina! (Aquí conectaremos el microservicio de Django y Stripe)");
    carrito = [];
    document.getElementById('cart-count').innerText = 0;
    window.location.hash = '#inicio';
};

// Escuchar cambios en la URL para cambiar de pantalla sin recargar
window.addEventListener('hashchange', router);
window.addEventListener('load', router);