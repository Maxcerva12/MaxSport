window.addEventListener("DOMContentLoaded", function () {
  const agregarAlCarritoBtn = document.getElementById("agregarAlCarrito");
  agregarAlCarritoBtn.addEventListener("click", agregarAlCarrito);

  document.addEventListener("click", function (event) {
    const images = document.querySelectorAll(".item-list-button-img .img1");

    // Verificar si el clic no fue en una imagen
    if (!event.target.closest(".item-list-button-img")) {
      // Restablecer el filtro en todas las imágenes
      images.forEach((img) => {
        img.style.filter = "contrast(0.5)";
      });
    } else {
      // Quitar el filtro de la imagen clicada
      images.forEach((img) => {
        img.style.filter = img === event.target ? "none" : "contrast(0.5)";
      });
    }
  });

  // Logica del boton
  // Seleccionamos todos los botones
  var botones = document.querySelectorAll(".item-list-button");
  const containerAddtoCart = document.querySelector(".ocultador");

  botones.forEach(function (boton) {
    boton.addEventListener("click", function () {
      var isSelected = boton.classList.contains("selected");
      if (isSelected) {
        boton.classList.remove("selected");
        containerAddtoCart.classList.remove("visible"); // Ocultar el contenedor
      } else {
        // Si no está seleccionado, primero deseleccionamos todos los botones
        botones.forEach(function (b) {
          b.classList.remove("selected");
        });
        boton.classList.add("selected");
        containerAddtoCart.classList.add("visible"); // Mostrar el contenedor con animación
      // Obtener la posición actual del contenedor
      const containerRect = containerAddtoCart.getBoundingClientRect();
      const containerTop = containerRect.top + window.pageYOffset;

      // Hacer scroll suavemente hasta la posición del contenedor
      window.scrollTo({
        top: containerTop,
        behavior: "smooth"
      });
      }
    });
  });

  // Cantidad de producto
  document.getElementById("incrementar").addEventListener("click", function () {
    document.getElementById("cantidad").stepUp();
  });

  document
    .getElementById("desincrementar")
    .addEventListener("click", function () {
      document.getElementById("cantidad").stepDown();
    });

  function agregarAlCarrito() {
    const nombre = document.getElementById("productName").textContent;
    const precio = document.getElementById("Seccion-Precio").textContent;
    const cantidad = document.getElementById("cantidad").value;
    const imagen = document.getElementById("productImage").src;
    // const Existencia = document.getElementById("numero_existencia").textContent;
    const tallaSeleccionada = document.querySelector(
      ".item-list-button.selected"
    )?.textContent;

    // Obtener el número de existencia actual
    const existenciaActual = parseInt(
      document.getElementById("numero_existencia").textContent
    );

    // Restar la cantidad agregada al carrito de la existencia actual
    const nuevaExistencia = existenciaActual - cantidad;

    // Actualizar el elemento HTML que muestra el número de existencia
    document.getElementById("numero_existencia").textContent = nuevaExistencia;

    const producto = {
      nombre: nombre,
      precio: precio,
      cantidad: cantidad,
      imagen: imagen,
      // Existencia: Existencia,
      talla: tallaSeleccionada || "No seleccionada",
      Existencia: nuevaExistencia,
    };

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Actualizar el contador del carrito
    actualizarContadorCarrito();

    // Disminuir la cantidad existente
    // const existenciaActual = parseInt(Existencia);
    // const nuevaExistencia = existenciaActual - parseInt(cantidad);
    // document.getElementById("numero_existencia").textContent = nuevaExistencia;
  }

  actualizarContadorCarrito();
});

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contadorCarrito = document.querySelector(".navbar-shopping-cart div");
  contadorCarrito.textContent = carrito.length;
}
