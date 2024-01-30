import conectar from "./Conexao.js";
import Telefone from "../models/Telefone.js";

export default class TelefoneBD {
  constructor() { }

  async gravar(telefone) {
    if (telefone instanceof Telefone) {
      const conexao = await conectar();
      let conn = null;

      try {
        conn = await conexao.getConnection();
        await conn.beginTransaction();

        for (const n in telefone.numero) {
          await conn.query(
            "INSERT INTO telefone(numero, pessoa_info_codigo) VALUES (?, ?)",
            [telefone.numero[n], telefone.pessoaId]
          );
        }

        await conn.commit();

      } catch (error) {
        if (conn) await conn.rollback();
        throw error;
      } finally {
        if (conn) conn.release();
      }
    }
  }

  async atualizar(telefone) {
    if (telefone instanceof Telefone) {
      const conexao = await conectar();
      let conn = null;

      try {
        conn = await conexao.getConnection();
        await conn.beginTransaction();

        await conn.query(
          "DELETE FROM telefone WHERE pessoa_info_codigo=?",
          [telefone.pessoaId]
        );

        if (telefone.numero.length >= 1) {
          for (const n in telefone.numero) {
            await conn.query(
              "INSERT INTO telefone(numero, pessoa_info_codigo) VALUES (?, ?)",
              [telefone.numero[n], telefone.pessoaId]
            );
          }
        }

        await conn.commit();

      } catch (error) {
        if (conn) await conn.rollback();
        throw error;
      } finally {
        if (conn) conn.release();
      }
    }
  }

  async excluir(telefone) {
    if (telefone instanceof Telefone) {
      const conexao = await conectar();
      const sql = `DELETE FROM telefone WHERE pessoa_info_codigo = ?`;
      await conexao.query(sql, [telefone.pessoaId]);
    }
  }

  async consultar() {
    const conexao = await conectar();

    const sql = `SELECT t.numero FROM telefone t`;

    const [rows] = await conexao.query(sql);

    const telefones = [];

    for (const row of rows) {
      telefones.push(row["numero"]);
    }

    return telefones;
  }

  async consultarPorPessoa(telefone) {
    if (telefone instanceof Telefone) {
      const conexao = await conectar();

      const sql = `SELECT t.numero FROM telefone t WHERE pessoa_info_codigo = ?`;

      const [rows] = await conexao.query(sql, telefone.pessoaId);

      const telefones = [];

      for (const row of rows) {
        telefones.push(row["numero"]);
      }

      return telefones;
    }
  }
}
