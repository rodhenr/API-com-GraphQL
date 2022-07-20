import { gql } from "apollo-server-express";

const empresaSchema = gql`
    type Empresa {
        _id: ID!
        nome: String!
        colaboradores: [Funcionario]!
    }

    type Query {
        empresas: [Empresa]!
        empresa(id: ID!): Empresa!
        getFuncionarios(empresa: String!): [Funcionario]
    }

    input EmpresaInput {
        nome: String!
        colaboradores: [ID]!
    }

    type Mutation {
        createEmpresa(data: EmpresaInput): Empresa!
        updateEmpresa(id: ID, data: EmpresaInput): Empresa!
        deleteEmpresa(id: ID!): Boolean
    }
`;

export default empresaSchema;