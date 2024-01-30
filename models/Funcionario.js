import FuncionarioBD from "../repositories/FuncionarioDAO.js";

export default class Funcionario {
  #codigo;
  #nome;
  #cpf;
  #dataNascimento;
  #status;
  #nomeUsuario;
  #senhaUsuario;
  #info;
  #atribuicoes;

  constructor(
    codigo,
    nome,
    cpf,
    dataNascimento,
    status,
    nomeUsuario,
    senhaUsuario,
    info,
    atribuicoes
  ) {
    this.#codigo = codigo;
    this.#nome = nome;
    this.#cpf = cpf;
    this.#dataNascimento = dataNascimento;
    this.#status = status;
    this.#nomeUsuario = nomeUsuario;
    this.#senhaUsuario = senhaUsuario;
    this.#info = info;
    this.#atribuicoes = atribuicoes;
  }

  get codigo() {
    return this.#codigo;
  }

  get nome() {
    return this.#nome;
  }

  set nome(nome) {
    this.#nome = nome;
  }

  get cpf() {
    return this.#cpf;
  }
  set cpf(cpf) {
    this.#cpf = cpf;
  }

  get dataNascimento() {
    return this.#dataNascimento;
  }

  set dataNascimento(dataNascimento) {
    this.#dataNascimento = dataNascimento;
  }

  get status() {
    return this.#status;
  }

  set status(status) {
    this.#status = status;
  }

  get nomeUsuario() {
    return this.#nomeUsuario;
  }

  set nomeUsuario(nomeUsuario) {
    this.#nomeUsuario = nomeUsuario;
  }

  get senhaUsuario() {
    return this.#senhaUsuario;
  }

  set senhaUsuario(senhaUsuario) {
    this.#senhaUsuario = senhaUsuario;
  }

  get info() {
    return this.#info;
  }

  set info(info) {
    this.#info = info;
  }

  get atribuicoes() {
    return this.#atribuicoes;
  }

  set atribuicoes(atribuicoes) {
    this.#atribuicoes = atribuicoes;
  }

  toJSON() {
    return {
      codigo: this.#codigo,
      nome: this.#nome,
      cpf: this.#cpf,
      dataNascimento: this.#dataNascimento,
      status: this.#status,
      nomeUsuario: this.#nomeUsuario,
      senhaUsuario: this.#senhaUsuario,
      info: this.#info,
      atribuicoes: this.#atribuicoes,
    };
  }

  async gravar() {
    const funcionarioBD = new FuncionarioBD();
    const lastInsertedId = await funcionarioBD.gravar(this);
    return lastInsertedId;
  }

  async atualizar() {
    const funcionarioBD = new FuncionarioBD();
    await funcionarioBD.atualizar(this);
  }

  async excluir(info) {
    const funcionarioBD = new FuncionarioBD();
    await funcionarioBD.excluir(info);
  }

  async consultar() {
    const funcionarioBD = new FuncionarioBD();
    const funcionarios = await funcionarioBD.consultar();
    return funcionarios;
  }

  async obterFuncionario(codigo) {
    const funcionarioBD = new FuncionarioBD();
    const funcionarios = await funcionarioBD.obterFuncionario(codigo);
    return funcionarios;
  }

  async obterAtribuicoes() {
    const funcionarioBD = new FuncionarioBD();
    const atribuicoes = await funcionarioBD.obterAtribuicoes(this);
    return atribuicoes;
  }
}
