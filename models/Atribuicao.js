export default class Atribuicao {
  #codigoFuncionario;
  #cargoAtribuido;
  #dataAtribuicao;
  constructor(codigoFuncinario, dataAtribuicao, cargoAtribuido) {
    this.#codigoFuncionario = codigoFuncinario;
    this.#cargoAtribuido = cargoAtribuido;
    this.#dataAtribuicao = dataAtribuicao;
  }

  get codigoFuncionario() {
    return this.#codigoFuncionario;
  }
  set codigoFuncionario(codigoFuncionario) {
    this.#codigoFuncionario = codigoFuncionario;
  }
  get cargoAtribuido() {
    return this.#cargoAtribuido;
  }
  set cargoAtribuido(cargoAtribuido) {
    this.#cargoAtribuido = cargoAtribuido;
  }
  
  get dataAtribuicao() {
    return this.#dataAtribuicao;
  }
  set dataAtribuicao(dataAtribuicao) {
    this.#dataAtribuicao = dataAtribuicao;
  }
  toJSON() {
    return {
      codigoFuncionario: this.#codigoFuncionario,
      cargoAtribuido: this.#cargoAtribuido,
      dataAtribuicao: this.#dataAtribuicao
    };
  }
}
