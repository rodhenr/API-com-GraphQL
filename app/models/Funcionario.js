import mongoose from "mongoose";
const { Schema } = mongoose;

const funcionarioSchema = Schema({
  nome: { type: String, required: true },
  idade: { type: Number, required: true },
  empresa: { type: Schema.Types.ObjectId, ref: "Empresa" },
  cargo: { type: String, required: true },
});

const modelFuncionario = mongoose.model("Funcionario", funcionarioSchema);

export default modelFuncionario;
