import Funcionario from "../../app/models/Funcionario.js";

const funcionarioResolver = {
  Query: {
    funcionarios: async () => await Funcionario.find(),
    funcionario: async (_, { id }) => await Funcionario.findById(id),
  },

  Mutation: {
    createFuncionario: async (_, { data }) => await Funcionario.create(data),
    updateFuncionario: async (_, { id, data }) =>
      await Funcionario.findOneAndUpdate(id, data, { new: true }),
    deleteFuncionario: async (_, { id }) =>
      !!(await Funcionario.findByIdAndDelete(id)),
  },
};

export default funcionarioResolver;
