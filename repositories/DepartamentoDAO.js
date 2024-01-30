import Departamento from "../models/Departamento.js";
import conectar from "./Conexao.js";

export default class DepartamentoBD {
  constructor() {}

  async gravar(departamento) {
    if (departamento instanceof Departamento) {
      const conexao = await conectar();
      let conn = null;
      let lastInsertedId = null;

      try {
        conn = await conexao.getConnection();
        await conn.beginTransaction();

        const [response] = await conn.query(
          "INSERT INTO departamento(nome,descricao) VALUES (?,?)",
          [departamento.nome, departamento.descricao]
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

  async alterar(departamento) {
    if (departamento instanceof Departamento) {
      const conexao = await conectar();
      let conn = null;

      try {
        conn = await conexao.getConnection();
        await conn.beginTransaction();

        await conn.query(
          "UPDATE departamento SET nome=?, descricao=? WHERE codigo=?",
          [departamento.nome, departamento.descricao, departamento.codigo]
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

  async excluir(departamento) {
    if (departamento instanceof Departamento) {
      const conexao = await conectar();
      let conn = null;

      try {
        conn = await conexao.getConnection();
        await conn.beginTransaction();

        await conn.query("DELETE FROM departamento WHERE codigo=?", departamento.codigo);
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

    const sql = `SELECT * FROM departamento ORDER BY departamento.nome`;

    const [rows] = await conexao.query(sql);

    const cargos = [];
    for (const row of rows) {
      const departamento = new Departamento(row["codigo"], row["nome"], row["descricao"]);

      cargos.push(departamento);
    }
    return cargos;
  }
}
