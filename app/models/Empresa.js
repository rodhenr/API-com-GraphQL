import mongoose from "mongoose";
const { Schema } = mongoose;

const empresaSchema = Schema({
  nome: { type: String, required: true, unique: true },
  colaboradores: [{ type: Schema.Types.ObjectId, ref: "Funcionario" }],
});

const modelEmpresa = mongoose.model("Empresa", empresaSchema);

export default modelEmpresa;
