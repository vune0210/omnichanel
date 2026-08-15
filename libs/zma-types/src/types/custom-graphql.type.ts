import { GraphQLScalarType } from 'graphql';

export const GraphQLJSON = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral: (ast) => (ast.kind === 'StringValue' ? JSON.parse(ast.value) : null),
});
