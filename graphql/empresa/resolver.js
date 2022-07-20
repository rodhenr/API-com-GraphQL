import Empresa from "../../app/models/Empresa.js";
import Funcionario from "../../app/models/Funcionario.js";

const empresaResolver = {
  Query: {
    empresas: async () => await Empresa.find().populate("colaboradores"),
    empresa: async (_, { id }) =>
      await Empresa.findById(id).populate("colaboradores"),
    getFuncionarios: async (_, { empresa }) =>
      await Funcionario.find({ empresa }),
  },

  Mutation: {
    createEmpresa: async (_, { data }) => await Empresa.create(data),
    updateEmpresa: async (_, { id, data }) =>
      await Empresa.findOneAndUpdate({ _id: id }, data, { new: true }),
    deleteEmpresa: async (_, { id }) => !!(await Empresa.findByIdAndDelete(id)),
  },
};

export default empresaResolver;
