import Funcionario from "../models/Funcionario.js";
import PessoaInfo from "../models/Pessoa.js";
import Cargo from "../models/Cargo.js";
import conectar from "./Conexao.js";
import Departamento from "../models/Departamento.js";
import Atribuicao from "../models/Atribuicao.js";
import Telefone from "../models/Telefone.js";

export default class FuncionarioBD {
  constructor() { }

  async gravar(funcionario) {
    if (funcionario instanceof Funcionario) {
      const conexao = await conectar();
      let conn = null;
      let lastInsertedId = { pessoaId: "", funcionarioId: "" };
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);

      try {
        conn = await conexao.getConnection();
        await conn.beginTransaction();

        const [responsePessoa] = await conn.query(
          `INSERT INTO pessoa_info (email, endereco,
            bairro, cidade, cep, uf) VALUES (?,?,?,?,?,?)`,
          [
            funcionario.info.email,
            funcionario.info.endereco,
            funcionario.info.bairro,
            funcionario.info.cidade,
            funcionario.info.cep,
            funcionario.info.uf,
          ]
        );

        lastInsertedId.pessoaId = responsePessoa.insertId;

        const [responseFuncionario] = await conn.query(
          `INSERT INTO funcionario (nome, cpf, data_nascimento,
            status, nome_usuario, senha_usuario, pessoa_info_codigo)
            VALUES (?,?,?,?,?,?,?)`,
          [
            funcionario.nome,
            funcionario.cpf,
            funcionario.dataNascimento,
            funcionario.status,
            funcionario.nomeUsuario,
            funcionario.senhaUsuario,
            responsePessoa.insertId,
          ]
        );

        for (const atribuicao of funcionario.atribuicoes) {
          await conn.query(
            `INSERT INTO atribuicao (funcionario_codigo, cargo_codigo, data_atribuicao) VALUES (?, ?, ?)`,
            [responseFuncionario.insertId, atribuicao.codigo, formattedDate]
          );
        }

        await conn.commit();

        lastInsertedId.funcionarioId = responseFuncionario.insertId;
      } catch (error) {
        if (conn) await conn.rollback();
        throw error;
      } finally {
        if (conn) conn.release();
        return lastInsertedId;
      }
    }
  }

  async atualizar(funcionario) {
    if (funcionario instanceof Funcionario) {
      const conexao = await conectar();
      let conn = null;
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);

      try {
        conn = await conexao.getConnection();
        await conn.beginTransaction();

        await conn.query(
          `UPDATE pessoa_info SET email=?, endereco=?, bairro=?, cidade=?,
          cep=?, uf=? WHERE codigo=?`,
          [
            funcionario.info.email,
            funcionario.info.endereco,
            funcionario.info.bairro,
            funcionario.info.cidade,
            funcionario.info.cep,
            funcionario.info.uf,
            funcionario.info.codigo,
          ]
        );
        await conn.query(
          `UPDATE funcionario SET nome=?, cpf=?, data_nascimento=?, status=?, nome_usuario=?, senha_usuario=? WHERE codigo=?`,
          [
            funcionario.nome,
            funcionario.cpf,
            funcionario.dataNascimento,
            funcionario.status,
            funcionario.nomeUsuario,
            funcionario.senhaUsuario,
            funcionario.codigo,
          ]
        );

        await conn.query(
          `DELETE FROM atribuicao WHERE funcionario_codigo=?`,
          funcionario.codigo
        );

        for (const atribuicao of funcionario.atribuicoes) {
          await conn.query(
            `INSERT INTO atribuicao (funcionario_codigo, cargo_codigo, data_atribuicao) VALUES (?, ?, ?)`,
            [funcionario.codigo, atribuicao.codigo, formattedDate]
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

  async excluir(info) {
    if (info instanceof PessoaInfo) {
      const conexao = await conectar();
      let conn = null;

      try {
        conn = await conexao.getConnection();
        await conn.beginTransaction();

        const [response] = await conn.query(
          "SELECT codigo FROM funcionario WHERE pessoa_info_codigo=?",
          info.codigo
        );

        await conn.query("DELETE FROM atribuicao WHERE funcionario_codigo=?", [
          response[0].codigo,
        ]);

        await conn.query(
          "DELETE FROM funcionario WHERE pessoa_info_codigo=?",
          info.codigo
        );

        await conn.query("DELETE FROM pessoa_info WHERE codigo=?", info.codigo);

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
                  f.codigo 'codigo_funcionario',
                  f.nome,
                  f.cpf,
                  f.data_nascimento,
                  f.status,
                  f.nome_usuario,
                  f.senha_usuario,
                  i.codigo 'pessoa_info_codigo',
                  i.email,
                  i.endereco,
                  i.bairro,
                  i.cidade,
                  i.cep,
                  i.uf,
                  CONCAT('[',
                          GROUP_CONCAT(DISTINCT JSON_OBJECT('codigo', c.codigo, 'nome', c.nome)),
                          ']') AS atribuicoes
                FROM
                pessoa_info i
                        JOIN     
                    funcionario f ON i.codigo = f.pessoa_info_codigo
                        JOIN
                    atribuicao a ON f.codigo = a.funcionario_codigo
                        JOIN
                    cargo c ON a.cargo_codigo = c.codigo
                GROUP BY f.codigo
                ORDER BY f.nome`;

    // CONCAT('[',
    // GROUP_CONCAT(DISTINCT JSON_OBJECT('codigo', t.codigo, 'numero', t.numero)),
    // ']') AS telefones
    // LEFT JOIN
    // telefone t ON i.codigo = t.pessoa_info_codigo

    const [rows] = await conexao.query(sql);
    const funcionarios = [];

    for (const row of rows) {
      const telefone = new Telefone(null, null, row["pessoa_info_codigo"]);
      const telefones = await telefone.consultarPorPessoa();
      const atribuicoes = [];

      for (const item of JSON.parse(row["atribuicoes"])) {
        const cargo = new Cargo(item["codigo"], item["nome"]);
        atribuicoes.push(cargo);
      }

      const info = new PessoaInfo(
        row["pessoa_info_codigo"],
        row["email"],
        row["endereco"],
        row["bairro"],
        row["cidade"],
        row["cep"],
        row["uf"],
        telefones
      );

      const funcionario = new Funcionario(
        row["codigo_funcionario"],
        row["nome"],
        row["cpf"],
        row["data_nascimento"],
        row["status"],
        row["nome_usuario"],
        row["senha_usuario"],
        info,
        atribuicoes
      );
      funcionarios.push(funcionario);
    }
    return funcionarios;
  }

  async obterFuncionario(codigo) {
    const conexao = await conectar();

    const sql = `SELECT 
                f.codigo 'codigo_funcionario',
                f.nome,
                f.cpf,
                f.data_nascimento,
                f.status,
                f.nome_usuario,
                f.senha_usuario,
                i.codigo 'pessoa_info_codigo',
                i.email,
                i.endereco,
                i.bairro,
                i.cidade,
                i.cep,
                i.uf,
                CONCAT('[',
                        GROUP_CONCAT(DISTINCT JSON_OBJECT('codigo', c.codigo, 'nome', c.nome)),
                        ']') AS atribuicoes
                FROM
                pessoa_info i
                        JOIN     
                    funcionario f ON i.codigo = f.pessoa_info_codigo
                        LEFT JOIN
                    atribuicao a ON f.codigo = a.funcionario_codigo
                        LEFT JOIN
                    cargo c ON a.cargo_codigo = c.codigo
                WHERE f.codigo = ?
                GROUP BY f.codigo
                ORDER BY f.nome`;

    const [rows] = await conexao.query(sql, [codigo]);

    if (rows.length === 0) {
      return null; // Retorna nulo se o funcionário não for encontrado.
    }

    const row = rows[0];
    const atribuicoes = [];

    for (const item of JSON.parse(row["atribuicoes"])) {
      const cargo = new Cargo(item["codigo"], item["nome"]);
      atribuicoes.push(cargo);
    }

    const info = new PessoaInfo(
      row["pessoa_info_codigo"],
      row["telefone"],
      row["email"],
      row["endereco"],
      row["bairro"],
      row["cidade"],
      row["cep"],
      row["uf"]
    );

    const funcionario = new Funcionario(
      row["codigo_funcionario"],
      row["nome"],
      row["cpf"],
      row["data_nascimento"],
      row["status"],
      row["nome_usuario"],
      row["senha_usuario"],
      info,
      atribuicoes
    );

    return funcionario;
  }

  async obterAtribuicoes(funcionario) {
    const conexao = await conectar();

    // Obter os dados do funcionário
    funcionario = await this.obterFuncionario(funcionario.codigo);

    const sql = `SELECT 
                  a.funcionario_codigo as funcionario_codigo,
                  a.cargo_codigo as codigo_cargo,
                  a.data_atribuicao,
                  c.nome as nome_cargo,
                  c.descricao as descricao_cargo,
                  d.codigo as codigo_departamento,
                  d.nome as nome_departamento,
                  d.descricao as descricao_departamento
                FROM atribuicao a 
                JOIN cargo c ON a.cargo_codigo = c.codigo
                JOIN departamento d ON c.departamento_codigo = d.codigo
                WHERE a.funcionario_codigo = ?`;

    const [atribuicoes] = await conexao.query(sql, [funcionario.codigo]);

    const atribuidos = atribuicoes.map((row) => {
      const departamento = new Departamento(
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

      return new Atribuicao(
        row["funcionario_codigo"],
        row["data_atribuicao"],
        cargo,
      );
    });

    funcionario.atribuicoes = atribuidos;

    return funcionario;
  }

}
