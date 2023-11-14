class Monstruo extends Personaje {

  constructor(id, nombre, tipo, alias, miedo, defensa) {
    super(id, nombre, tipo);
    this.alias = alias;
    this.miedo = miedo;
    this.defensa = defensa;
  }

}
