export default class PessoaInfo {
  #codigo;
  #email;
  #endereco;
  #bairro;
  #cidade;
  #cep;
  #uf;
  #telefone;

  constructor(codigo, email, endereco, bairro, cidade, cep, uf, telefone) {
    this.#codigo = codigo;
    this.#telefone = telefone;
    this.#email = email;
    this.#endereco = endereco;
    this.#bairro = bairro;
    this.#cidade = cidade;
    this.#cep = cep;
    this.#uf = uf;
  }

  get codigo() {
    return this.#codigo;
  }

  get telefone() {
    return this.#telefone;
  }

  set telefone(telefone) {
    this.#telefone = telefone;
  }

  get email() {
    return this.#email;
  }

  set email(email) {
    this.#email = email;
  }

  get endereco() {
    return this.#endereco;
  }

  set endereco(endereco) {
    this.#endereco = endereco;
  }

  get bairro() {
    return this.#bairro;
  }

  set bairro(bairro) {
    this.#bairro = bairro;
  }

  get cidade() {
    return this.#cidade;
  }

  set cidade(cidade) {
    this.#cidade = cidade;
  }

  get cep() {
    return this.#cep;
  }

  set cep(cep) {
    this.#cep = cep;
  }

  get uf() {
    return this.#uf;
  }

  set uf(uf) {
    this.#uf = uf;
  }

  toJSON() {
    return {
      codigo: this.#codigo,
      email: this.#email,
      endereco: this.#endereco,
      bairro: this.#bairro,
      cidade: this.#cidade,
      cep: this.#cep,
      uf: this.#uf,
      telefone: this.#telefone,
    };
  }
}
