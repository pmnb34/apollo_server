export const typeDefs = `

type Mutation {
    like(id: Int!): SuccessResponse
    unlike(id: Int!): SuccessResponse
}
`;
