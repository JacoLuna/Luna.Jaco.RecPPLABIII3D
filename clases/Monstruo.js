class Monstruo extends Personaje {

  constructor(nombre, alias, tipo, miedo, defensa, materias) {
    super(nombre, tipo);
    this.alias = alias;
    this.miedo = miedo;
    this.defensa = defensa;
    this.materias = materias;
  }

}
