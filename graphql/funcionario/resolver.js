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
      if (data.empresa !== "") {
        // Procura a empresa passada para o funcionário
        const empresa = await Empresa.findOne({
          nome: { $regex: `.*${data.empresa}*.` },
        });

        if (empresa) {
          // Se a empresa já existe
          const newFuncionario = await Funcionario.create({
            nome: data.nome,
            idade: data.idade,
            cargo: data.cargo,
            empresa: empresa._id,
          });

          empresa.colaboradores.push(newFuncionario._id);
          await empresa.save();

          return newFuncionario;
        } else {
          // Se a empresa não existe
          const newEmpresa = await Empresa.create({
            nome: data.empresa,
            colaboradores: [],
          });

          const newFuncionario = await Funcionario.create({
            nome: data.nome,
            idade: data.idade,
            cargo: data.cargo,
            empresa: newEmpresa._id,
          });

          newEmpresa.colaboradores.push(newFuncionario._id);
          newEmpresa.save();

          return newFuncionario;
        }
      } else {
        // Se não passar uma empresa
        const newFuncionario = await Funcionario.create({
          nome: data.nome,
          idade: data.idade,
          cargo: data.cargo,
          empresa: "",
        });

        return newFuncionario;
      }
    },
    updateFuncionario: async (_, { id, data }) => {
      if (data?.empresa) {
        const funcionario = await Funcionario.findById(id);

        if (funcionario) {
          const funcionarioAtualizado = await Funcionario.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
          ).populate("empresa");

          // Remove empresa antiga
          await Empresa.findOneAndUpdate(
            { _id: funcionario.empresa },
            {
              $pull: {
                colaboradores: id,
              },
            }
          );

          // Adiciona funcionario na nova empresa
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
      const funcionario = await Funcionario.findByIdAndDelete(id);

      if (funcionario) {
        await Empresa.findOneAndUpdate(
          { _id: funcionario.empresa },
          {
            $pullAll: {
              colaboradores: [id],
            },
          }
        );

        return true;
      } else {
        return false;
      }
    },
  },
};

export default funcionarioResolver;
