import Funcionario from "../../app/models/Funcionario.js";
import Empresa from "../../app/models/Empresa.js";

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
          console.log(newFuncionario.empresa);

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

          empresa.colaboradores.push(newFuncionario._id);
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
    updateFuncionario: async (_, { id, data }) =>
      await Funcionario.findOneAndUpdate(id, data, { new: true }),
    deleteFuncionario: async (_, { id }) =>
      !!(await Funcionario.findByIdAndDelete(id)),
  },
};

export default funcionarioResolver;
