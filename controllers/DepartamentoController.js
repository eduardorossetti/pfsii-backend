import Departamento from "../models/Departamento.js";

export default class DepartamentoCTRL {
  gravar(req, res) {
    res.type("application/json");
    if (req.method === "POST" && req.is("application/json")) {
      const { nome, descricao } = req.body;

      if (nome && descricao) {
        const departamento = new Departamento(null, nome, descricao);

        departamento
          .gravar()
          .then((lastInsertedId) => {
            res.status(200).json({
              status: true,
              message: "Dados gravados com sucesso!",
              id: lastInsertedId,
            });
          })
          .catch((erro) => {
            res.status(500).json({
              status: false,
              message: erro.message,
            });
          });
      } else {
        res.status(400).json({
          status: false,
          message: "Dados insuficientes! Consulte a documentação da API.",
        });
      }
    } else {
      res.status(400).json({
        status: false,
        message:
          "Método não permitido ou Departamento no formato JSON não fornecido! Consulte a documentação da API.",
      });
    }
  }

  atualizar(req, res) {
    res.type("application/json");
    if (req.method === "PUT" && req.is("application/json")) {
      const { codigo, nome, descricao } = req.body;

      if (codigo && nome && descricao) {
        const departamento = new Departamento(codigo, nome, descricao);
        departamento
          .atualizar()
          .then(() => {
            res.status(200).json({
              status: true,
              message: "Dados atualizados com sucesso!",
            });
          })
          .catch((erro) => {
            res.status(500).json({
              status: false,
              message: erro.message,
            });
          });
      } else {
        res.status(400).json({
          status: false,
          message: "Dados insuficientes! Consulte a documentação da API.",
        });
      }
    } else {
      res.status(400).json({
        status: false,
        message:
          "Método não permitido ou Departamento no formato JSON não fornecido! Consulte a documentação da API.",
      });
    }
  }

  excluir(req, res) {
    const codigo = req.params.codigo;
    const departamento = new Departamento(codigo);

    departamento
      .excluir()
      .then(() => {
        res.status(200).json({
          status: true,
          message: "Dados excluídos com sucesso!",
        });
      })
      .catch((erro) => {
        res.status(500).json({
          status: false,
          message: erro.message,
        });
      });
  }

  consultar(req, res) {
    res.type("application/json");
    if (req.method === "GET") {
      const departamento = new Departamento();
      departamento
        .consultar()
        .then((departamentos) => {
          res.status(200).json(departamentos);
        })
        .catch((erro) => {
          res.status(500).json({
            status: false,
            message: erro.message,
          });
        });
    } else {
      res.status(400).json({
        status: false,
        message: "Método não permitido! Consulte a documentação da API.",
      });
    }
  }
}
