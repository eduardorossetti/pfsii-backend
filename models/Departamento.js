import DepartamentoBD from "../repositories/DepartamentoDAO.js";

export default class Departamento {
  #codigo;
  #nome;
  #descricao;
  #funcionarios;

  constructor(codigo, nome, descricao, funcionarios) {
    this.#codigo = codigo;
    this.#nome = nome;
    this.#descricao = descricao;
    this.#funcionarios = funcionarios;
  }

  get codigo() {
    return this.#codigo;
  }

  get nome() {
    return this.#nome;
  }

  set nome(novoNome) {
    this.#nome = novoNome;
  }

  get descricao() {
    return this.#descricao;
  }

  set descricao(novoDescricao) {
    this.#descricao = novoDescricao;
  }

  get funcionarios() {
    return this.#funcionarios;
  }

  set funcionarios(funcionarios) {
    this.#funcionarios = funcionarios;
  }

  toJSON() {
    return {
      codigo: this.#codigo,
      nome: this.#nome,
      descricao: this.#descricao,
      funcionarios: this.#funcionarios,
    };
  }

  async gravar() {
    const departamentoBD = new DepartamentoBD();
    const lastInsertedId = await departamentoBD.gravar(this);
    return lastInsertedId;
  }

  async atualizar() {
    const departamentoBD = new DepartamentoBD();
    await departamentoBD.alterar(this);
  }

  async excluir() {
    const departamentoBD = new DepartamentoBD();
    await departamentoBD.excluir(this);
  }

  async consultar() {
    const departamentoBD = new DepartamentoBD();
    const departamentos = await departamentoBD.consultar();
    return departamentos;
  }
}
