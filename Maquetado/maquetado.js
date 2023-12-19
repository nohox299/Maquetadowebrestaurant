async function getProducts() {
    console.log('getProducts')
    try {
        const response = await fetch('http://18.119.172.205:3030/api/productos');
        const data = await response.json();
        listBannerProducts(data)
        listAllProducts(data)
        console.log(data)
        return data;
    } catch (error) {
        console.error('Error al obtener y listar productos:', error);
    }
}

// async function getPromotionalProducts() {
//     console.log('getPromotionalProducts')
//     try {
//         const response = await fetch('http://18.119.172.205:3030/api/productosenpromocion');
//         const data = await response.json();
//         console.log(data)
//         return data;
//     } catch (error) {
//         console.error('Error al obtener y listar productos:', error);
//     }
// }

// http://18.119.172.205:3030/api/usuarios
// http://18.119.172.205:3030/api/productos
// http://18.119.172.205:3030/api/productosenpromocion
// http://18.119.172.205:3030/api/compras
// http://18.119.172.205:3030/api/detalledecompra

async function listBannerProducts(productos) {
    const productosContainer = document.getElementById('bannerproductosContainer');
    const template = document.getElementById('template-product');

    productosContainer.innerHTML = '';
    
    const primerosCincoProductos = productos.slice(0, 5);

    primerosCincoProductos.forEach(producto => {
        const clone = document.importNode(template.content, true);

        clone.querySelector('.producto-nombre').textContent = producto.nombre;

        productosContainer.appendChild(clone);
    });
}

async function listAllProducts(productos) {
    const productosContainer = document.getElementById('productosContainer');
    const template = document.getElementById('template-product-list');  
    
    productosContainer.innerHTML = '';

    productos.forEach(producto => {
        const clone = document.importNode(template.content, true);

        clone.querySelector('.producto-nombre').textContent = producto.nombre;
        clone.querySelector('.producto-precio').textContent = `Precio: $${producto.precio}`;

        const detallesProducto = clone.querySelector('.detalles-producto');
        const verDetallesBtn = clone.querySelector('.ver-detalles');
        const cerrarPopupBtn = clone.querySelector('.cerrar-popup');
        const agregarCarritoBtns = clone.querySelectorAll('.agregar-carrito');
        const eliminarCarritoBtn = clone.querySelector('.eliminar-carrito');


        verDetallesBtn.addEventListener('click', () => {
            detallesProducto.style.display = 'block';
            detallesProducto.querySelector('.detalle-titulo').textContent = producto.nombre;
            detallesProducto.querySelector('.detalle-descripcion').textContent = `Descripción: ${producto.descripcion}`;
            detallesProducto.querySelector('.detalle-precio').textContent = `Precio: $${producto.precio}`;
            detallesProducto.querySelector('.detalle-categoria').textContent = `Categoría: ${producto.categoria}`;
            detallesProducto.querySelector('.detalle-fabricante').textContent = `Fabricante: ${producto.fabricante}`;
            detallesProducto.querySelector('.detalle-existencia').textContent = `Existencia: ${producto.cantidadenexistencia}`;
            detallesProducto.querySelector('.detalle-unidad').textContent = `Unidad: ${producto.unidaddemedidad}`;
        });

        cerrarPopupBtn.addEventListener('click', () => {
            detallesProducto.style.display = 'none';
        });

        agregarCarritoBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                alert(`Se añadió al carrito: ${producto.nombre}`);
                agregarAlCarrito(producto);
            });
        });
        eliminarCarritoBtn.addEventListener('click', () => {
            alert(`Se eliminó del carrito: ${producto.nombre}`);
            eliminarDelCarrito(producto);
        });

        productosContainer.appendChild(clone);
    });
}

function actualizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productosCarritoContainer = document.getElementById('productosCarritoContainer');
    const precioTotalSpan = document.getElementById('precioTotal');
    const templateCarrito = document.getElementById('template-carrito-item');

    productosCarritoContainer.innerHTML = '';
    let precioTotal = 0;

    carrito.forEach(producto => {
        const clone = document.importNode(templateCarrito.content, true);

        clone.querySelector('.producto-nombre').textContent = producto.nombre;
        clone.querySelector('.producto-precio').textContent = `Precio: $${producto.precio}`;

        const detallesProducto = clone.querySelector('.detalles-producto');
        const verDetallesBtn = clone.querySelector('.ver-detalles');
        const cerrarPopupBtn = clone.querySelector('.cerrar-popup');
        const eliminarCarritoBtn = clone.querySelector('.eliminar-carrito');

        verDetallesBtn.addEventListener('click', () => {
            detallesProducto.style.display = 'block';
            detallesProducto.querySelector('.detalle-titulo').textContent = producto.nombre;
            detallesProducto.querySelector('.detalle-descripcion').textContent = `Descripción: ${producto.descripcion}`;
            detallesProducto.querySelector('.detalle-precio').textContent = `Precio: $${producto.precio}`;
            detallesProducto.querySelector('.detalle-categoria').textContent = `Categoría: ${producto.categoria}`;
            detallesProducto.querySelector('.detalle-fabricante').textContent = `Fabricante: ${producto.fabricante}`;
            detallesProducto.querySelector('.detalle-existencia').textContent = `Existencia: ${producto.cantidadenexistencia}`;
            detallesProducto.querySelector('.detalle-unidad').textContent = `Unidad: ${producto.unidaddemedidad}`;
        });

        cerrarPopupBtn.addEventListener('click', () => {
            detallesProducto.style.display = 'none';
        });

        eliminarCarritoBtn.addEventListener('click', () => {
            alert(`Se eliminó del carrito: ${producto.nombre}`);
            eliminarDelCarrito(producto);
            actualizarCarrito(); 
        });


        productosCarritoContainer.appendChild(clone);

        precioTotal += producto.precio;
    });

    precioTotalSpan.textContent = precioTotal.toFixed(2);
    toggleCarritoVisibility();
}

document.addEventListener('DOMContentLoaded', function () {
    const comprarBtn = document.getElementById('comprarBtn');
    comprarBtn.addEventListener('click', realizarCompra);
});

function realizarCompra() {
    alert('¡Gracias por su compra!');
    localStorage.removeItem('carrito');
    actualizarCarrito();
}

function toggleCarritoVisibility() {
    const carritoContainer = document.getElementById('carritoContainer');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length > 0) {
        carritoContainer.style.display = 'block';
    } else {
        carritoContainer.style.display = 'none';
    }
}

function agregarAlCarrito(producto) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carrito.push(producto);

    localStorage.setItem('carrito', JSON.stringify(carrito));

    actualizarCarrito();
}

function eliminarDelCarrito(producto) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const index = carrito.findIndex(item => item.nombre === producto.nombre);

    if (index !== -1) {
        carrito.splice(index, 1);

        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
        toggleCarritoVisibility();
    }
}




getProducts()
actualizarCarrito()
toggleCarritoVisibility()
// getPromotionalProducts()

