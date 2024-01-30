import { Router } from "express";
import FuncionarioCTRL from "../controllers/FuncionarioController.js";

const rotaFuncionario = new Router();
const funcionarioCtrl = new FuncionarioCTRL();

rotaFuncionario
  .post("/", funcionarioCtrl.gravar)
  .put("/", funcionarioCtrl.atualizar)
  .delete("/:codigo", funcionarioCtrl.excluir)
  .get("/", funcionarioCtrl.consultar)
  .get("/:codigo", funcionarioCtrl.obterFuncionario)
  .get("/:codigo/atribuicao", funcionarioCtrl.obterAtribuicoes);

export default rotaFuncionario;
