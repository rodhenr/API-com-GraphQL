import Empresa from "../../app/models/Empresa.js";

const empresaResolver = {
  Query: {
    empresas: async () => await Empresa.find(),
    empresa: async (_, { id }) => await Empresa.findById(id),
  },

  Mutation: {
    createEmpresa: async (_, { data }) => await Empresa.create(data),
    updateEmpresa: async (_, { id, data }) =>
      await Empresa.findOneAndUpdate(id, data, { new: true }),
    deleteEmpresa: async (_, { id }) => !!(await Empresa.findByIdAndDelete(id)),
  },
};

export default empresaResolver;
