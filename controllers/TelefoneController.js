import Telefone from "../models/Telefone.js";

export default class TelefoneCTRL {
  gravar(req, res) {
    res.type("application/json");
    if (req.method === "POST" && req.is("application/json")) {
      const { numeros, pessoaId } = req.body;

      if (numeros && pessoaId) {
        const telefone = new Telefone(null, numeros, pessoaId);

        telefone
          .gravar()
          .then(() => {
            res.status(200).json({
              status: true,
              message: "Dados gravados com sucesso!",
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
          "Método não permitido ou Telefone no formato JSON não fornecido! Consulte a documentação da API.",
      });
    }
  }

  atualizar(req, res) {
    res.type("application/json");
    if (req.method === "PUT" && req.is("application/json")) {
      console.log(req.body);
      
      const { numeros, pessoaId } = req.body;

      if (numeros && pessoaId) {
        const telefone = new Telefone(null, numeros, pessoaId);
        telefone
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
          "Método não permitido ou Telefone no formato JSON não fornecido! Consulte a documentação da API.",
      });
    }
  }

  excluir(req, res) {
    const codigo = req.params.pessoaId;
    const telefone = new Telefone(null, null, codigo);

    telefone
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
      const telefone = new Telefone();
      telefone
        .consultar()
        .then((telefones) => {
          res.status(200).json(telefones);
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

  consultarPorPessoa(req, res) {
    res.type("application/json");
    if (req.method === "GET") {
      const pessoaId = req.params.pessoaId;

      if (pessoaId) {
        const telefone = new Telefone(null, null, pessoaId);

        telefone
          .consultarPorPessoa()
          .then((fone) => {
            res.status(200).json(fone);
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
}
