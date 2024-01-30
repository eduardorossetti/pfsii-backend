import TelefoneBD from "../repositories/TelefoneDAO.js";

class Telefone {
  #codigo;
  #numero;
  #pessoaId;

  constructor(codigo, numero, pessoaId) {
    this.#codigo = codigo;
    this.#numero = numero;
    this.#pessoaId = pessoaId;
  }

  get codigo() {
    return this.#codigo;
  }

  get numero() {
    return this.#numero;
  }

  set numero(numero) {
    this.#numero = numero;
  }

  get pessoaId() {
    return this.#pessoaId;
  }

  set pessoaId(pessoaId) {
    this.#pessoaId = pessoaId;
  }

  toJSON() {
    return {
      codigo: this.#codigo,
      numero: this.#numero,
      pessoaId: this.#pessoaId,
    };
  }

  async gravar() {
    const telefoneBD = new TelefoneBD();
    await telefoneBD.gravar(this);
  }

  async atualizar() {
    const telefoneBD = new TelefoneBD();
    await telefoneBD.atualizar(this);
  }

  async excluir() {
    const telefoneBD = new TelefoneBD();
    await telefoneBD.excluir(this);
  }

  async consultar() {
    const telefoneBD = new TelefoneBD();
    const telefones = await telefoneBD.consultar();
    return telefones;
  }

  async consultarPorPessoa() {
    const telefoneBD = new TelefoneBD();
    const telefone = await telefoneBD.consultarPorPessoa(this);
    return telefone;
  }
}

export default Telefone;