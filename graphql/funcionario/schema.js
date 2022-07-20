import { gql } from "apollo-server-express";

const funcionarioSchema = gql`
  type Funcionario {
    _id: ID!
    nome: String!
    idade: Int!
    empresa: Empresa
    cargo: String!
  }

  type Query {
    funcionarios: [Funcionario]!
    funcionario(id: ID!): Funcionario!
  }

  input FuncionarioInput {
    nome: String!
    idade: Int!
    empresa: String!
    cargo: String!
  }

  input FuncionarioUpdate {
    nome: String
    idade: Int
    empresa: ID
    cargo: String
  }

  type Mutation {
    createFuncionario(data: FuncionarioInput): Funcionario!
    updateFuncionario(id: ID, data: FuncionarioUpdate): Funcionario!
    deleteFuncionario(id: ID!): Boolean
  }
`;

export default funcionarioSchema;
