import { Router } from "express";
import CargoCTRL from "../controllers/CargoController.js";

const rotaCargo = new Router();
const cargoCtrl = new CargoCTRL();

rotaCargo
  .post("/", cargoCtrl.gravar)
  .put("/", cargoCtrl.atualizar)
  .delete("/:codigo", cargoCtrl.excluir)
  .get("/", cargoCtrl.consultar)

export default rotaCargo;
