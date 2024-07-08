function renderizarCarrito() {
  cargarCarrito();
  actualizarContadorCarrito();
  actualizarTotales();
}

function cargarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";

  carrito.forEach((producto) => {
    const row = document.createElement("tr");
    const precioFloat = parseFloat(producto.precio.replace(/[$,]/g, ""));
    const subtotal = precioFloat * parseInt(producto.cantidad);
    const subtotalFormateado = subtotal.toLocaleString("es-MX", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });

    const codigoProducto = generarCodigoProducto();
    row.innerHTML = `
      <td class="item-details">
        <img src="${producto.imagen}" alt="${producto.nombre}" />
        <section>
          <h3 class="name_product_cart">${producto.nombre}</h3>
          <div class="Container_Codig">
            <p class="title_CODIGO">CODIGO#</p>
            <span class="Codigo_product">${codigoProducto}</span>
          </div>
          <div class="Container-Talla">
            <p class="title_Talla">Talla: </p>
            <span class="Numero_Talla">${producto.talla}</span>
          </div>
        </section>
      </td>
      <td class="Precio">${producto.precio}</td>
      <td class="Container_cantidad-cart">
        <div class="quantity-control">
          <button class="minus-btn">-</button>
          <input type="number" value="${producto.cantidad}" min="1" data-cantidad-anterior="${producto.cantidad}" />
          <button class="plus-btn">+</button>
        </div>
        <div class="cotainer_Existencia">
          <p class="P_existencias">EXISTENCIAS:</p>
          <span class="number_existencia">${producto.Existencia}</span>
        </div>
      </td>
      <td class="subtotal-del-pedido">$ ${subtotalFormateado}</td>
      <td class="Td_eliminador"> </td>
    `;
    const eliminarBtn = document.createElement("button");
    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.classList.add("eliminar-btn");
    eliminarBtn.addEventListener("click", eliminarProducto);
    row.querySelector(".Td_eliminador").appendChild(eliminarBtn);
    tableBody.appendChild(row);
  });

  const plusButtons = document.querySelectorAll(".plus-btn");
  const minusButtons = document.querySelectorAll(".minus-btn");

  plusButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const input = button.parentElement.querySelector("input");
      input.value = parseInt(input.value) + 1;
      actualizarSubtotal(input.parentElement.parentElement.parentElement);
    });
  });

  minusButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const input = button.parentElement.querySelector("input");
      if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        actualizarSubtotal(input.parentElement.parentElement.parentElement);
      }
    });
  });

  actualizarTotales();
}

function generarCodigoProducto() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeros = "0123456789";
  let codigo = "";

  // Generar 3 letras aleatorias
  for (let i = 0; i < 3; i++) {
    codigo += letras.charAt(Math.floor(Math.random() * letras.length));
  }

  // Generar 6 números aleatorios
  for (let i = 0; i < 6; i++) {
    codigo += numeros.charAt(Math.floor(Math.random() * numeros.length));
  }

  return codigo;
}

function actualizarSubtotal(row) {
  const precioElement = row.querySelector(".Precio");
  const cantidadElement = row.querySelector("input");
  const precioFloat = parseFloat(
    precioElement.textContent.replace(/[$,]/g, "")
  );
  const subtotal = precioFloat * parseInt(cantidadElement.value);
  const subtotalFormateado = `$ ${subtotal.toLocaleString("es-MX", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })}`;
  row.querySelector(".subtotal-del-pedido").textContent = subtotalFormateado;

  // Obtener la existencia actual del producto
  const existenciaActual = parseInt(
    row.querySelector(".number_existencia").textContent
  );

  // Obtener la cantidad anterior del producto
  const cantidadAnterior = parseInt(
    row.querySelector("input").getAttribute("data-cantidad-anterior")
  );

  // Calcular la nueva existencia
  const nuevaCantidad = parseInt(cantidadElement.value);
  const diferenciaEnCantidad = nuevaCantidad - cantidadAnterior;
  const nuevaExistencia = existenciaActual - diferenciaEnCantidad;

  // Actualizar el número de existencia en el carrito
  row.querySelector(".number_existencia").textContent = nuevaExistencia;

  // Guardar la nueva cantidad como cantidad anterior
  cantidadElement.setAttribute("data-cantidad-anterior", nuevaCantidad);

  actualizarTotales();
}

function eliminarProducto(event) {
  const row = event.target.parentElement.parentElement;
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const index = carrito.findIndex(
    (producto) =>
      producto.nombre === row.querySelector(".name_product_cart").textContent
  );
  if (index !== -1) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    row.remove();
    renderizarCarrito(); // Actualizar el contenido del carrito sin recargar la página
  }
}

function actualizarTotales() {
  const filas = document.querySelectorAll("tbody tr");
  let subtotal = 0;
  filas.forEach((fila) => {
    const precioElement = fila.querySelector(".Precio");
    const cantidadElement = fila.querySelector("input");
    const precioFloat = parseFloat(
      precioElement.textContent.replace(/[$,]/g, "")
    );
    const cantidad = parseInt(cantidadElement.value);
    const subtotalFila = precioFloat * cantidad;
    subtotal += subtotalFila;
  });

  const subtotalFormateado = subtotal.toLocaleString("es-MX", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  const impuestos = subtotal * 0.19; // Asumiendo un impuesto del 19%
  const impuestosFormateados = impuestos.toLocaleString("es-MX", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  const envio = 8;
  const envioFormateado = envio.toLocaleString("es-MX", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  const total = subtotal + impuestos + envio;
  const totalFormateado = total.toLocaleString("es-MX", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  document.getElementById("subtotal").textContent = `$ ${subtotalFormateado}`;
  document.getElementById("taxes").textContent = `$ ${impuestosFormateados}`;
  document.getElementById("shipping").textContent = `$ ${envioFormateado}`;
  document.getElementById("total").textContent = `$ ${totalFormateado}`;
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contadorCarrito = document.querySelector(".navbar-shopping-cart div");
  contadorCarrito.textContent = carrito.length;
}

window.addEventListener("DOMContentLoaded", function () {
  actualizarContadorCarrito();
  renderizarCarrito(); // Actualizar el contenido del carrito sin recargar la página
});

function obtenerTasaCambio() {
  // Aquí debes implementar la lógica para obtener la tasa de cambio actual desde la API o servicio que elijas
  // Por ejemplo, si usas Exchange Rates API:
  // fetch('https://api.exchangeratesapi.io/latest?base=COP')
  //   .then(response => response.json())
  //   .then(data => {
  //     const tasaCambio = data.rates.USD; // Asumiendo que quieres convertir a USD
  //     return tasaCambio;
  //   })
  //   .catch(error => {
  //     console.error('Error al obtener la tasa de cambio:', error);
  //     return 1; // Devuelve 1 como tasa de cambio por defecto en caso de error
  //   });

  // Para este ejemplo, usaremos una tasa de cambio fija
  const tasaCambio = 1; // 1 USD = 4000 COP
  return tasaCambio;
}

paypal
  .Buttons({
    createOrder: function (data, actions) {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

      if (carrito.length === 0) {
        // No hay productos en el carrito, no se crea la orden
        alert(
          "No hay productos en el carrito. Agrega algunos artículos antes de realizar el pago."
        );
        return; // Salir de la función sin crear la orden
      }
      const total = document
        .getElementById("total")
        .textContent.replace(/[$, ]/g, "");
      const totalFloat = parseFloat(total);
      const tasaCambio = obtenerTasaCambio();
      const totalConvertido = (totalFloat * tasaCambio).toFixed(2); // Redondear a dos decimales

      return actions.order.create({
        purchase_units: [
          {
            amount: {
              currency_code: "MXN",
              value: totalConvertido,
            },
          },
        ],
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        alert("Transacción completada por " + details.payer.name.given_name);
      });
    },
  })
  .render("#paypal-button-container");
window.addEventListener("load", cargarCarrito);
