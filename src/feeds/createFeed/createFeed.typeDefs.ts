export const typeDefs = `
type Mutation {
    createFeed(userId: Int! body: String!): SuccessResponse
}
`;
