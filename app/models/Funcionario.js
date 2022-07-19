const mongoose = require("mongoose");
const { Schema } = mongoose;

const funcionarioSchema = Schema({
  nome: { type: String, required: true },
  idade: { type: String, required: true },
  empresa: { type: Schema.Types.ObjectId, ref: "Empresa" },
  função: { type: String, required: true },
});

module.exports = mongoose.model("Funcionario", funcionarioSchema);
