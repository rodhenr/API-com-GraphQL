import Funcionario from "../../app/models/Funcionario.js";
import Empresa from "../../app/models/Empresa.js";
import { UserInputError } from "apollo-server-core";
import conn from "../../connection.js";

const funcionarioResolver = {
  Query: {
    funcionarios: async () => await Funcionario.find().populate("empresa"),
    funcionario: async (_, { id }) =>
      await Funcionario.findById(id).populate("empresa"),
  },

  Mutation: {
    createFuncionario: async (_, { data }) => {
      const empresa = await Empresa.findById(data.empresa);
      if (!empresa) return new UserInputError("Empresa ID inválido");

      const session = await conn.startSession();

      try {
        session.startTransaction();

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

        await session.commitTransaction();
        return funcionario.populate("empresa");
      } catch (err) {
        await session.abortTransaction();
      }

      session.endSession();
    },
    updateFuncionario: async (_, { id, data }) => {
      const funcionario = await Funcionario.findById(id);
      if (!funcionario) return new UserInputError("Usuário ID inválido");

      const session = await conn.startSession();

      if (data?.empresa) {
        try {
          session.startTransaction();

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

          await session.commitTransaction();
          return funcionarioAtualizado.populate("empresa");
        } catch (err) {
          await session.abortTransaction();
        }
      } else {
        try {
          session.startTransaction();

          const funcionarioUpdate = await Funcionario.findOneAndUpdate(
            { _id: id },
            data,
            {
              new: true,
            }
          );

          await session.commitTransaction();
          return funcionarioUpdate.populate("empresa");
        } catch (err) {
          await session.abortTransaction();
        }
      }
      session.endSession();
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
