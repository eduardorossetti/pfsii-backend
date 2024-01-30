import Cargo from "../models/Cargo.js";

export default class CargoCTRL {
  gravar(req, res) {
    res.type("application/json");
    if (req.method === "POST" && req.is("application/json")) {
      const { nome, descricao, departamento } = req.body;

      if (nome && descricao && departamento) {
        const cargo = new Cargo(null, nome, descricao, departamento);

        cargo
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
          "Método não permitido ou Cargo no formato JSON não fornecido! Consulte a documentação da API.",
      });
    }
  }

  atualizar(req, res) {
    res.type("application/json");
    if (req.method === "PUT" && req.is("application/json")) {
      const { codigo, nome, descricao, departamento } = req.body;

      if (codigo && nome && descricao && departamento) {
        const cargo = new Cargo(codigo, nome, descricao, departamento);
        cargo
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
          "Método não permitido ou Cargo no formato JSON não fornecido! Consulte a documentação da API.",
      });
    }
  }

  excluir(req, res) {
    const codigo = req.params.codigo;
    const cargo = new Cargo(codigo);

    cargo
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
      const cargo = new Cargo();
      cargo
        .consultar()
        .then((cargos) => {
          res.status(200).json(cargos);
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

