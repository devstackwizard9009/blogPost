const { postTypeDefs, postResolvers } = require("../modules/posts/post.graphql");

const baseTypeDefs = `#graphql
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const mergeResolvers = (...resolverMaps) => {
  const merged = {};

  for (const resolverMap of resolverMaps) {
    for (const typeName of Object.keys(resolverMap)) {
      merged[typeName] = { ...(merged[typeName] || {}), ...resolverMap[typeName] };
    }
  }

  return merged;
};

const typeDefs = [baseTypeDefs, postTypeDefs];
const resolvers = mergeResolvers(postResolvers);

module.exports = { typeDefs, resolvers };
