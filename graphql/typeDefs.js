import { mergeTypeDefs } from "@graphql-tools/merge";
import empresaSchema from "./empresa/schema.js";
import funcionarioSchema from "./funcionario/schema.js";

const types = [empresaSchema, funcionarioSchema];
const typeDefs = mergeTypeDefs(types);


export default typeDefs;