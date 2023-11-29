const $cardsDiv = document.getElementById("cardsDiv");
const $spinner = document.getElementById("spinnerGif");

const URLmonstruos = "http://localhost:3000/monstruos";

window.onload = () =>{
  getMonstruos();
}

function getMonstruos() {
  $spinner.classList.remove("hide");
  axios
    .get(URLmonstruos)
    .then(({ data }) => {
      let monstruos = data;
      if (monstruos.length > 0) {
        monstruos.forEach((monstruo) => {
          agregarMonstruo(monstruo);
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

function agregarMonstruo(monstruo) {
  const $divCards = document.createElement("div");
  
  const $cardsNombre = document.createElement("p");
  const $cardsAlias = document.createElement("p");
  const $cardsDefensa = document.createElement("p");
  const $cardsMiedo = document.createElement("p");
  const $cardsTipo = document.createElement("p");
  const $cardsMaterias = document.createElement("p");

  const $txtNombre = document.createTextNode("Nombre: " + monstruo.nombre);
  const $txtAlias = document.createTextNode("Alias: " + monstruo.alias);
  const $txtdefensa = document.createTextNode("Defensa: " + monstruo.defensa);
  const $txtMiedo = document.createTextNode("Miedo: " + monstruo.miedo);
  const $txtTipo = document.createTextNode("Tipo: " + monstruo.tipo);
  const $txtMaterias = document.createTextNode("materias: " + monstruo.materias);


  $divCards.classList.add("Cards");
  $cardsDiv.appendChild($divCards);

  $divCards.append($cardsNombre ,$cardsAlias ,$cardsDefensa ,$cardsMiedo ,$cardsTipo, $cardsMaterias);

  $cardsNombre.appendChild($txtNombre);
  $cardsAlias.appendChild($txtAlias);
  $cardsDefensa.appendChild($txtdefensa);
  $cardsMiedo.appendChild($txtMiedo);
  $cardsTipo.appendChild($txtTipo);
  $cardsMaterias.appendChild($txtMaterias);
}
