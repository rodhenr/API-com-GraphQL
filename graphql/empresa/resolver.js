import { UserInputError } from "apollo-server-core";
import Empresa from "../../app/models/Empresa.js";

const empresaResolver = {
  Query: {
    empresas: async () => await Empresa.find().populate("colaboradores"),
    empresa: async (_, { id }) =>
      await Empresa.findById(id).populate("colaboradores"),
  },

  Mutation: {
    createEmpresa: async (_, { data }) => await Empresa.create(data),
    updateEmpresa: async (_, { id, data }) =>
      await Empresa.findOneAndUpdate({ _id: id }, data, { new: true }).populate(
        "colaboradores"
      ),
    deleteEmpresa: async (_, { id }) => {
      const empresa = await Empresa.findById(id);

      if (empresa) {
        if (empresa?.colaboradores?.length > 0) {
          throw new UserInputError(
            "Empresa possui funcionários cadastrados, remova-os primeiro."
          );
        } else {
          await Empresa.findByIdAndDelete(id);
          return true;
        }
      } else {
        throw new UserInputError("ID inválido");
      }
    },
  },
};

export default empresaResolver;
