// const tiposArray = ["Esqueleto","Zombie","Vampiro","Fantasma","Bruja","Hombre lobo"];
// localStorage.setItem("tipos", JSON.stringify(tiposArray));
// localStorage.removeItem("monstruos");

const $cboTipo = document.getElementById("cboTipo");
const $rdbGroup = document.getElementsByName("defensa");
const $spinner = document.getElementById("spinnerGif");
const $tablaMonstruos = document.getElementById("tablaMonstruos");
const $errorMsgIngresos = document.getElementById("errorMsgIngresos");
const $errorMsgEdicion = document.getElementById("errorMsgEdicion");
const $btnGuardar = document.getElementById("guardar");
const $btnCancelarEdicion = document.getElementById("cancelarEdicion");
const $btnEliminar = document.getElementById("Eliminar");

const $btnGuardarText = document.createTextNode("Guardar");
const $btnActualizarText = document.createTextNode("Actualizar");

const $formulario = document.forms[0];

let editando = false;

let monstruos = JSON.parse(localStorage.getItem("monstruos") == null)
? []
: JSON.parse(localStorage.getItem("monstruos"));

let tipos = JSON.parse(localStorage.getItem("tipos"));

$btnGuardar.appendChild($btnGuardarText);

tipos.forEach((tipo) => {
  const $select = document.createElement("option");
  const $cboTipoText = document.createTextNode(tipo);
  
  $select.setAttribute("value", tipo);
  $select.setAttribute("text", tipo);
  $select.appendChild($cboTipoText);
  $cboTipo.appendChild($select);
});

if (monstruos.length == 0) {
  localStorage.setItem("ultimoId", 1);
  $spinner.classList.add("hide");
} else {
  setTimeout(() => {
    monstruos.forEach((monstruo) => {
      addRow(monstruo);
    });
    $spinner.classList.add("hide");
  }, 2000);
  $spinner.classList.remove("hide");
}

$formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  let nuevoMonstruo = undefined;
  let defensa = getDefensa();
  let ultimoId = parseInt(localStorage.getItem("ultimoId"));

  if (
    $formulario.txtNombre.value != "" &&
    $formulario.txtAlias.value != "" &&
    defensa != undefined
  ) {
    $errorMsgIngresos.classList.add("hide");

    monstruos.forEach((monstruo) => {
      if ($formulario.txtNombre.value == monstruo.nombre) {
        nuevoMonstruo = monstruo;
        if(editando){
          nuevoMonstruo.nombre = $formulario.txtNombre.value;
          nuevoMonstruo.alias = $formulario.txtAlias.value;
          nuevoMonstruo.tipo = $formulario.Tipo.value;
          nuevoMonstruo.miedo = $formulario.rangeMiedo.value;
          nuevoMonstruo.defensa = defensa;
        }else{
          $errorMsgEdicion.classList.remove("hide");
        }
      }
    });

    if (nuevoMonstruo == undefined) {
      nuevoMonstruo = new Monstruo(
        localStorage.getItem("ultimoId"),
        $formulario.txtNombre.value,
        $formulario.Tipo.value,
        $formulario.txtAlias.value,
        $formulario.rangeMiedo.value,
        defensa
      );

      monstruos.push(nuevoMonstruo);
      setTimeout(() => {
        addRow(nuevoMonstruo);
        $spinner.classList.add("hide");
      }, 2000);

      $spinner.classList.remove("hide");
      localStorage.setItem("ultimoId", ultimoId + 1);
    }
    localStorage.setItem("monstruos", JSON.stringify(monstruos));
    $formulario.reset();
  } else {
    $errorMsgIngresos.classList.remove("hide");
  }
});

function eliminarMonstruo() {
  monstruos.forEach((monstruo, index) => {
    if (
      $formulario.txtNombre.value == monstruo.nombre
    ) {
      setTimeout(() => {
        $tablaMonstruos.deleteRow(index+1);
        $spinner.classList.add("hide");
      }, 2000);
      $spinner.classList.remove("hide");
      monstruos.splice(index, 1);
      $formulario.txtNombre.value = "";
      $formulario.txtAlias.value = "";
      $formulario.rangeMiedo.value = 50;
    }
  });
  localStorage.setItem("monstruos", JSON.stringify(monstruos));
  $formulario.txtNombre.toggleAttribute("disabled");
  $btnCancelarEdicion.classList.add("hide");
  $btnEliminar.toggleAttribute("disabled");;
}

function addRow(monstruo) {
  const $tr = document.createElement("tr");

  const $tdNombre = document.createElement("td");
  const $tdAlias = document.createElement("td");
  const $tdDefensa = document.createElement("td");
  const $tdMiedo = document.createElement("td");
  const $tdTipo = document.createElement("td");

  const $txtNombre = document.createTextNode(monstruo.nombre);
  const $txtAlias = document.createTextNode(monstruo.alias);
  const $txtdefensa = document.createTextNode(monstruo.defensa);
  const $txtMiedo = document.createTextNode(monstruo.miedo);
  const $txtTipo = document.createTextNode(monstruo.tipo);

  $tablaMonstruos.appendChild($tr);
  $tr.append($tdNombre, $tdAlias, $tdDefensa, $tdMiedo, $tdTipo);

  $tdNombre.appendChild($txtNombre);
  $tdAlias.appendChild($txtAlias);
  $tdDefensa.appendChild($txtdefensa);
  $tdMiedo.appendChild($txtMiedo);
  $tdTipo.appendChild($txtTipo);

  $tr.addEventListener("click", (e) => seleccionarMonstruo(e.currentTarget));
}

function getDefensa() {
  let defensa;
  $rdbGroup.forEach((element) => {
    if (element.checked) {
      defensa = element.value;
    }
  });
  return defensa;
}

$formulario.addEventListener("reset", (e) => {
  $btnCancelarEdicion.classList.add("hide");
  if ($btnGuardar.contains($btnActualizarText)) {
    $btnGuardar.removeChild($btnActualizarText);
  }
  $btnGuardar.appendChild($btnGuardarText);

  if ($formulario.txtNombre.hasAttribute("disabled")) {
    $formulario.txtNombre.toggleAttribute("disabled");
  }
  if (!$btnEliminar.hasAttribute("disabled")) {
    $btnEliminar.toggleAttribute("disabled");
  }

  editando = false;

  $errorMsgIngresos.classList.add("hide");
});

function seleccionarMonstruo(e) {
  const celdas = e.querySelectorAll("td");

  $formulario.txtNombre.value = celdas[0].textContent;
  $formulario.txtAlias.value = celdas[1].textContent;
  $formulario.defensa.value = celdas[2].textContent;
  $formulario.rangeMiedo.value = celdas[3].textContent;
  $formulario.Tipo.value = celdas[4].textContent;

  editando = true;

  if ($btnGuardar.contains($btnGuardarText)) {
    $btnGuardar.removeChild($btnGuardarText);
  }
  $btnGuardar.appendChild($btnActualizarText);
  $btnCancelarEdicion.classList.remove("hide");

  if (!$formulario.txtNombre.hasAttribute("disabled")) {
    $formulario.txtNombre.toggleAttribute("disabled");
  }
  $btnEliminar.toggleAttribute("disabled");
  
  $errorMsgIngresos.classList.add("hide");
  $errorMsgEdicion.classList.add("hide");
}