import express from "express";
import rotaFuncionario from "./routes/FuncionarioRoutes.js";
import rotaCargo from "./routes/CargoRoutes.js";
import cors from "cors";
import rotaDepartamento from "./routes/DepartamentoRoutes.js";
import rotaTelefone from "./routes/TelefoneRoutes.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use(express.urlencoded({ extended: false }));

app.use("/funcionarios", rotaFuncionario);
app.use("/cargos", rotaCargo);
app.use("/departamentos", rotaDepartamento);
app.use("/telefones", rotaTelefone);

const door = 4010;
const hostname = "0.0.0.0";

app.listen(door, hostname, () => {
  console.log(`Server listening on http://${hostname}:${door}`);
});