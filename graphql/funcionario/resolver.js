import Funcionario from "../../app/models/Funcionario.js";
import Empresa from "../../app/models/Empresa.js";
import { UserInputError } from "apollo-server-core";

const funcionarioResolver = {
  Query: {
    funcionarios: async () => await Funcionario.find().populate("empresa"),
    funcionario: async (_, { id }) =>
      await Funcionario.findById(id).populate("empresa"),
  },

  Mutation: {
    createFuncionario: async (_, { data }) => {
      const empresa = await Empresa.findById(data.empresa);

      // Se a empresa existir
      if (empresa) {
        // Cria um novo funcionário
        const funcionario = await Funcionario.create(data);

        // Inclui o funcionário na empresa
        await Empresa.findOneAndUpdate(
          { _id: data.empresa },
          {
            $push: {
              colaboradores: funcionario._id,
            },
          }
        );

        return funcionario.populate("empresa");
      } else {
        throw new UserInputError("Empresa ID inválido");
      }
    },
    updateFuncionario: async (_, { id, data }) => {
      if (data?.empresa) {
        const funcionario = await Funcionario.findById(id);

        // Se o ID for válido
        if (funcionario) {
          // Atualiza o funcionário
          const funcionarioAtualizado = await Funcionario.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
          );

          // Remove funcionário da empresa antiga
          await Empresa.findOneAndUpdate(
            { _id: funcionario.empresa },
            {
              $pull: {
                colaboradores: id,
              },
            }
          );

          // Adiciona funcionario na empresa nova
          await Empresa.findOneAndUpdate(
            { _id: data.empresa },
            {
              $push: {
                colaboradores: funcionario._id,
              },
            }
          );

          return funcionarioAtualizado.populate("empresa");
        }
      } else {
        const funcionario = await Funcionario.findOneAndUpdate(
          { _id: id },
          data,
          {
            new: true,
          }
        );

        return funcionario.populate("empresa");
      }
    },
    deleteFuncionario: async (_, { id }) => {
      try {
        await Funcionario.findByIdAndDelete(id);
        return true;
      } catch (err) {
        throw new UserInputError("ID Inválido");
      }
    },
  },
};

export default funcionarioResolver;
