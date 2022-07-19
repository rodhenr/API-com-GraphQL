const mongoose = require("mongoose");
const { Schema } = mongoose;

const empresaSchema = Schema({
  nome: { type: String, required: true },
  funcionarios: { type: Schema.Types.ObjectId, ref: "Funcionario" },
});

module.exports = mongoose.model("Empresa", empresaSchema);
