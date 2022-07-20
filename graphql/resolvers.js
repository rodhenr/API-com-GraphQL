import { mergeResolvers } from "@graphql-tools/merge";
import empresaResolver from "./empresa/resolver.js";
import funcionarioResolver from "./funcionario/resolver.js";

const resolverArray = [empresaResolver, funcionarioResolver];
const resolvers = mergeResolvers(resolverArray);

export default resolvers;
