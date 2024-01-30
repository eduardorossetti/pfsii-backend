import { Router } from "express";
import DepartamentoCTRL from "../controllers/DepartamentoController.js";

const rotaDepartamento = new Router();
const departamentoCTRL = new DepartamentoCTRL();

rotaDepartamento
  .post("/", departamentoCTRL.gravar)
  .put("/", departamentoCTRL.atualizar)
  .delete("/:codigo", departamentoCTRL.excluir)
  .get("/", departamentoCTRL.consultar)

export default rotaDepartamento;
