import Funcionario from "../../app/models/Funcionario.js";
import Empresa from "../../app/models/Empresa.js";
import mongoose from "mongoose";

const funcionarioResolver = {
  Query: {
    funcionarios: async () => await Funcionario.find().populate("empresa"),
    funcionario: async (_, { id }) =>
      await Funcionario.findById(id).populate("empresa"),
  },

  Mutation: {
    createFuncionario: async (_, { data }) => {
      const empresa = await Empresa.findById(data.empresa);

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
      }

      return null;
    },
    updateFuncionario: async (_, { id, data }) => {
      if (data?.empresa) {
        const funcionario = await Funcionario.findById(id);

        if (funcionario) {
          // Atualiza o funcionário
          const funcionarioAtualizado = await Funcionario.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
          ).populate("empresa");

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

          return funcionarioAtualizado;
        }
      } else {
        const funcionario = await Funcionario.findOneAndUpdate(
          { _id: id },
          data,
          {
            new: true,
          }
        ).populate("empresa");

        return funcionario;
      }
    },
    deleteFuncionario: async (_, { id }) => {
      const funcionario = await Funcionario.findById(id);

      if (funcionario) {
        await Funcionario.findByIdAndDelete(id);
        return true;
      } else {
        throw new UserInputError("ID inválido");
      }
    },
  },
};

export default funcionarioResolver;
