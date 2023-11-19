const tiposArray = [
  "Esqueleto",
  "Zombie",
  "Vampiro",
  "Fantasma",
  "Bruja",
  "Hombre lobo",
];
const filtrosArray = [
  "Defensa",
  "tipo",
  "materias"
];
localStorage.setItem("tipos", JSON.stringify(tiposArray));
localStorage.setItem("filtros", JSON.stringify(filtrosArray));

const $cboTipo = document.getElementById("cboTipo");
const $cboFiltro = document.getElementById("cboFiltro");
const $rdbGroup = document.getElementsByName("defensa");
const $chkGroup = document.getElementsByName("Materia");
const $spinner = document.querySelector("#spinnerGif");
const $tablaMonstruos = document.getElementById("tablaMonstruos");
const $errorMsgIngresos = document.getElementById("errorMsgIngresos");
const $errorMsgEdicion = document.getElementById("errorMsgEdicion");
const $btnGuardar = document.getElementById("guardar");
const $btnCancelarEdicion = document.getElementById("cancelarEdicion");
const $btnEliminar = document.getElementById("Eliminar");
const $mensajePopUp = document.getElementById("mensajePopUp");
const $PopUp = document.getElementById("popUp");

const $btnGuardarText = document.createTextNode("Guardar");
const $btnActualizarText = document.createTextNode("Actualizar");
const $popUpText = document.createTextNode("");

const $formulario = document.forms[0];
const URLmonstruos = "http://localhost:3000/monstruos";
const URLid = "http://localhost:3000/id";

let editando = false;
let ultimoId;
let monstruos;
let idSeleccionado;

$mensajePopUp.appendChild($popUpText);
$btnGuardar.appendChild($btnGuardarText);

tiposArray.forEach((tipo) => {
  const $select = document.createElement("option");
  const $cboTipoText = document.createTextNode(tipo);

  $select.setAttribute("value", tipo);
  $select.setAttribute("text", tipo);
  $select.appendChild($cboTipoText);
  $cboTipo.appendChild($select);
});
filtrosArray.forEach((filtro) => {
  const $select = document.createElement("option");
  const $cboFiltroText = document.createTextNode(filtro);

  $select.setAttribute("value", filtro);
  $select.setAttribute("text", filtro);
  $select.appendChild($cboFiltroText);
  $cboFiltro.appendChild($select);
});
window.onload = () => {
  getMonstruos();
};

function getMonstruos() {
  $spinner.classList.remove("hide");
  axios
    .get(URLmonstruos)
    .then(({ data }) => {
      monstruos = data;
      console.log(monstruos);
      if (monstruos.length > 0) {
        monstruos.forEach((monstruo) => {
          addRow(monstruo);
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      $spinner.classList.add("hide");
    });
}
function postMonstruo() {
  let defensa = getDefensa();
  let materias = getMaterias();
  let repetido = false;
  let nuevoMonstruo = new Monstruo(
    $formulario.txtNombre.value,
    $formulario.txtAlias.value,
    $formulario.Tipo.value,
    $formulario.rangeMiedo.value,
    defensa,
    materias
  );
  monstruos.forEach((monstruo) => {
    if (
      monstruo.nombre == nuevoMonstruo.nombre &&
      monstruo.alias == nuevoMonstruo.alias &&
      monstruo.defensa == nuevoMonstruo.defensa &&
      monstruo.miedo == nuevoMonstruo.miedo &&
      monstruo.tipo == nuevoMonstruo.tipo
    ) {
      repetido = true;
    }
  });

  if (!repetido) {
    $spinner.classList.remove("hide");
    axios
      .post(URLmonstruos, nuevoMonstruo)
      .then((data) => {
        addRow(nuevoMonstruo);
        $PopUp.open = true;
        $popUpText.textContent = "Monstruo Guardado";
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        $spinner.classList.add("hide");
      });
  } else {
    $errorMsgEdicion.classList.remove("hide");
  }
}
function delMonstruo() {
  let rowNumber;

  $formulario.txtNombre.toggleAttribute("disabled");
  $btnCancelarEdicion.classList.add("hide");
  $btnGuardar.removeChild($btnActualizarText);
  $btnGuardar.appendChild($btnGuardarText);
  $btnEliminar.toggleAttribute("disabled");
  $spinner.classList.remove("hide");

  monstruos.forEach((monstruo, index) => {
    if (monstruo.id == idSeleccionado) {
      rowNumber = index + 1;
    }
  });
  axios
    .delete(URLmonstruos + "/" + idSeleccionado)
    .then(({ data }) => {
      $tablaMonstruos.deleteRow(rowNumber);
      monstruos.splice(rowNumber, 1);

      $formulario.txtNombre.value = "";
      $formulario.txtAlias.value = "";
      $formulario.rangeMiedo.value = 50;

      $PopUp.open = true;
      $popUpText.textContent = "Monstruo Eliminado";
    })
    .catch((err) => {
      console.log(err.message);
    })
    .finally(() => {
      $spinner.classList.add("hide");
    });
}
function putMonstruo() {
  let defensa = getDefensa();
  let materias = getMaterias();
  let rowNumber;

  monstruos.forEach((monstruo, index) => {
    if (monstruo.id == idSeleccionado) {
      rowNumber = index + 1;
    }
  });

  let monstruoUpdated = new Monstruo(
    $formulario.txtNombre.value,
    $formulario.txtAlias.value,
    $formulario.Tipo.value,
    $formulario.rangeMiedo.value,
    defensa,
    materias
  );

  $spinner.classList.remove("hide");
  axios
    .put(URLmonstruos + "/" + idSeleccionado, monstruoUpdated, Monstruo)
    .then(({ data }, res) => {
      addRow(monstruoUpdated, rowNumber);
    })
    .catch((err) => {
      console.log(err.message);
    })
    .finally(() => {
      $spinner.classList.add("hide");
    });
}

function addRow(monstruo, row = 0) {
  const $tr = document.createElement("tr");

  const $tdNombre = document.createElement("td");
  const $tdAlias = document.createElement("td");
  const $tdDefensa = document.createElement("td");
  const $tdMiedo = document.createElement("td");
  const $tdTipo = document.createElement("td");
  const $tdMaterias = document.createElement("td");

  const $txtNombre = document.createTextNode(monstruo.nombre);
  const $txtAlias = document.createTextNode(monstruo.alias);
  const $txtdefensa = document.createTextNode(monstruo.defensa);
  const $txtMiedo = document.createTextNode(monstruo.miedo);
  const $txtTipo = document.createTextNode(monstruo.tipo);
  const $txtMaterias = document.createTextNode(monstruo.materias);

  if(row == 0){
    $tablaMonstruos.appendChild($tr);
  }else{
    $tablaMonstruos.insertRow(row, $tr);
  }
  $tr.append($tdNombre, $tdAlias, $tdDefensa, $tdMiedo, $tdTipo, $tdMaterias);

  $tdNombre.appendChild($txtNombre);
  $tdAlias.appendChild($txtAlias);
  $tdDefensa.appendChild($txtdefensa);
  $tdMiedo.appendChild($txtMiedo);
  $tdTipo.appendChild($txtTipo);
  $tdMaterias.appendChild($txtMaterias);

  $tr.addEventListener("click", (e) => seleccionarMonstruo(e.currentTarget));
}
function seleccionarMonstruo(e) {
  const celdas = e.querySelectorAll("td");
  let materias = celdas[5].textContent.split(",");

  editando = true;

  $formulario.txtNombre.value = celdas[0].textContent;
  $formulario.txtAlias.value = celdas[1].textContent;
  $formulario.defensa.value = celdas[2].textContent;
  $formulario.rangeMiedo.value = celdas[3].textContent;
  $formulario.Tipo.value = celdas[4].textContent;

  $formulario.Materia.forEach((materia) => {
    materia.checked = false;
  });
  materias.forEach((materia, index) => {
    if (materia.value == materias[index].value) {
      $formulario.Materia[index].checked = true;
    }
  });

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

  monstruos.forEach((monstruo) => {
    if (monstruo.nombre == celdas[0].textContent &&
      monstruo.alias == celdas[1].textContent &&
      monstruo.defensa == celdas[2].textContent &&
      monstruo.miedo == celdas[3].textContent &&
      monstruo.tipo == celdas[4].textContent
    ) {
      idSeleccionado = monstruo.id;
    }
  });
}

function getMaterias() {
  let materia = [];
  $chkGroup.forEach((element) => {
    if (element.checked) {
      materia.push(element.value);
    }
  });
  return materia;
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

$formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  let defensa = getDefensa();
  let materias = getMaterias();

  if (
    $formulario.txtNombre.value != "" &&
    $formulario.txtAlias.value != "" &&
    defensa != undefined &&
    materias.length > 0
  ) {
    $errorMsgIngresos.classList.add("hide");

    if (editando) {
      putMonstruo(idSeleccionado);
    } else {
      postMonstruo();
    }
    if($errorMsgEdicion.classList.contains("hide")){
      $formulario.reset();
    }
  } else {
    $errorMsgIngresos.classList.remove("hide");
  }
});
$formulario.addEventListener("reset", () => {
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
  $formulario.Materia.forEach((materia) => {
    materia.checked = false;
  });

  editando = false;
  $errorMsgIngresos.classList.add("hide");
});

function cerrarPopUp() {
  $PopUp.open = false;
}

// const myModal = document.getElementById('myModal')
// const myInput = document.getElementById('myInput')

// myModal.addEventListener('shown.bs.modal', () => {
//   myInput.focus()
// })