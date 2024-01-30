import Cargo from "../models/Cargo.js";
import Departamento from "../models/Departamento.js";
import Funcionario from "../models/Funcionario.js";
import conectar from "./Conexao.js";

export default class CargoBD {
  constructor() {}

  async gravar(cargo) {
    if (cargo instanceof Cargo) {
      const conexao = await conectar();
      let conn = null;
      let lastInsertedId = null;

      try {
        conn = await conexao.getConnection();
        await conn.beginTransaction();

        const [response] = await conn.query(
          "INSERT INTO cargo(nome,descricao,departamento_codigo) VALUES (?,?,?)",
          [cargo.nome, cargo.descricao, cargo.departamento.codigo]
        );

        await conn.commit();

        lastInsertedId = response.insertId;
      } catch (error) {
        if (conn) await conn.rollback();
        throw error;
      } finally {
        if (conn) conn.release();
        return lastInsertedId;
      }
    }
  }

  async alterar(cargo) {
    if (cargo instanceof Cargo) {
      const conexao = await conectar();
      let conn = null;

      try {
        conn = await conexao.getConnection();
        await conn.beginTransaction();

        await conn.query(
          "UPDATE cargo SET nome=?, descricao=?, departamento_codigo=? WHERE codigo=?",
          [cargo.nome, cargo.descricao, cargo.departamento.codigo, cargo.codigo]
        );

        await conn.commit();
      } catch (error) {
        if (conn) await conn.rollback();
        throw error;
      } finally {
        if (conn) conn.release();
      }
    }
  }

  async excluir(cargo) {
    if (cargo instanceof Cargo) {
      const conexao = await conectar();
      let conn = null;

      try {
        conn = await conexao.getConnection();
        await conn.beginTransaction();

        await conn.query("DELETE FROM cargo WHERE codigo=?", cargo.codigo);
        await conn.commit();
      } catch (error) {
        if (conn) await conn.rollback();
        throw error;
      } finally {
        if (conn) conn.release();
      }
    }
  }

  async consultar() {
    const conexao = await conectar();

    const sql = `SELECT
        c.codigo AS codigo_cargo,
        c.nome AS nome_cargo,
        c.descricao AS descricao_cargo,
        d.codigo AS codigo_departamento,
        d.nome AS nome_departamento,
        d.descricao AS descricao_departamento
        FROM cargo c
        INNER JOIN departamento d
        ON c.departamento_codigo = d.codigo
        ORDER BY c.nome`;

    const [rows] = await conexao.query(sql);

    const cargos = [];

    for (const row of rows) {
      const departamento =  new Departamento(
        row["codigo_departamento"],
        row["nome_departamento"],
        row["descricao_departamento"]
      );
      
      const cargo = new Cargo(
        row["codigo_cargo"],
        row["nome_cargo"],
        row["descricao_cargo"],
        departamento
      );

      cargos.push(cargo);
    }
    return cargos;
  }

  async consultarProfessores() {
    const conexao = await conectar();

    const sql = `SELECT 
                    c.*,
                    CONCAT('[',
                            GROUP_CONCAT(DISTINCT JSON_OBJECT('codigo', f.codigo, 'nome', f.nome)),
                            ']') AS funcionarios
                FROM
                    cargo c
                        LEFT JOIN
                    atribuicao a ON c.codigo = a.cargo_codigo
                        LEFT JOIN
                    funcionario f ON a.funcionario_codigo = f.codigo
                WHERE f.codigo IS NOT NULL
                GROUP BY c.codigo
                ORDER BY c.nome`;

    const [rows] = await conexao.query(sql);

    const cargos = [];
    for (const row of rows) {
      const funcionarios = [];

      for (const item of JSON.parse(row["funcionarios"])) {
        const funcionario = new Funcionario(item["codigo"], item["nome"]);

        funcionarios.push(funcionario);
      }

      const cargo = new Cargo(
        row["codigo"],
        row["nome"],
        row["descricao"],
        row["departamento_codigo"],
        funcionarios
      );

      cargos.push(cargo);
    }
    return cargos;
  }
}
