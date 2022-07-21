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
  }
  input EmpresaInput {
    nome: String!
    colaboradores: [ID]!
  }
  input EmpresaUpdate {
    nome: String!
  }
  type Mutation {
    createEmpresa(data: EmpresaInput): Empresa!
    updateEmpresa(id: ID, data: EmpresaUpdate): Empresa!
    deleteEmpresa(id: ID!): Boolean
  }
`;

export default empresaSchema;
