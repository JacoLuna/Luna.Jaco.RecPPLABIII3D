const tiposArray = [
  "Todos",
  "Esqueleto",
  "Zombie",
  "Vampiro",
  "Fantasma",
  "Bruja",
  "Hombre lobo",
];
localStorage.setItem("tipos", JSON.stringify(tiposArray));

const $cboTipo = document.getElementById("cboTipo");
const $cboFiltro = document.querySelector("#cboFiltro");
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
const $tbody = document.getElementById("tbody");
const $readOnlyText = document.getElementById("promedioMiedo");

const $btnGuardarText = document.createTextNode("Guardar");
const $btnActualizarText = document.createTextNode("Actualizar");
const $popUpText = document.createTextNode("");

const $formulario = document.forms[0];
const URLmonstruos = "http://localhost:3000/monstruos";

let editando = false;
let ultimoId;
let monstruos;
let idSeleccionado;

$mensajePopUp.appendChild($popUpText);
$btnGuardar.appendChild($btnGuardarText);

tiposArray.forEach((tipo, index) => {
  const $tipoOpcion = document.createElement("option");
  const $filtroOpcion = document.createElement("option");
  const $cboTipoText = document.createTextNode(tipo);

  if(index > 0){
    $tipoOpcion.setAttribute("value", tipo);
    $tipoOpcion.setAttribute("text", tipo);
    $tipoOpcion.appendChild($cboTipoText);
    $cboTipo.appendChild($tipoOpcion);
  }

  $filtroOpcion.setAttribute("value", tipo);
  $filtroOpcion.setAttribute("text", tipo);
  $filtroOpcion.appendChild($cboTipoText);
  $cboFiltro.appendChild($filtroOpcion);
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
      if (monstruos.length > 0) {
        monstruos.forEach((monstruo) => {
          addRow(monstruo);
        });
        calcularPromedioMiedo(monstruos);
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
    $tbody.appendChild($tr);
  }else{
    $tbody.insertRow(row, $tr);
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

function filtrar(){
  let monstruosFiltrados = monstruos
  
  while ($tbody.firstChild) {
    $tbody.removeChild($tbody.firstChild);
  }

  if($cboFiltro.value != "Todos"){
    monstruosFiltrados = monstruos.filter(function(monstruo){
      return monstruo.tipo == $cboFiltro.value;
    });
  }else{
    monstruosFiltrados = monstruos;
  }
  monstruosFiltrados.forEach( (monstruo) => {
    addRow(monstruo);
  });
  calcularPromedioMiedo(monstruosFiltrados);
  
  let columnas = document.querySelectorAll(".filtroCkh");
  columnas.forEach((col, index) => {
    col.checked = true;
    chkColumna(index, col);
  });
}

function chkColumna(colNum, obj){
  let col = getColumn(colNum);
  
  if(col != null){
    if(obj.checked){
      col.forEach( (columna) => {
        columna.classList.remove("hide");
      });
    }else{
      col.forEach( (columna) => {
        columna.classList.add("hide");
      });
    }
  }
}

function getColumn(col) {
  var n = $tablaMonstruos.rows.length;
  var i, s = null, tr, td;
  let cells = [];
  if (col < 0) {
      return null;
  }

  for (i = 0; i < n; i++) {
      tr = $tablaMonstruos.rows[i];
      if (tr.cells.length > col) {
          td = tr.cells[col];
          cells.push(td);
      }
  }
  return cells;
}

function calcularPromedioMiedo(monstruos){
  let sumatoriaMiedo = 0;
  if(monstruos.length > 1){
    sumatoriaMiedo = monstruos.reduce( (acum, actual, index) => {
      let sumatoria;
      if(index == 1){
        sumatoria = Number(acum.miedo) + Number(actual.miedo);
      }else{
        sumatoria = acum + Number(actual.miedo);
      }
      return sumatoria;
    });
  }else{
    if(monstruos.length == 1){
      sumatoriaMiedo = monstruos[0].miedo;
    }
  }
  let prom;
  if(monstruos.length > 0){
    prom = sumatoriaMiedo / ($tablaMonstruos.rows.length-1);
  }else{
    prom = 0;
  }
  $readOnlyText.value = prom;
}