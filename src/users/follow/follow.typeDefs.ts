export const typeDefs = `

type Mutation {
    following(id: Int!): SuccessResponse
    unfollowing(id: Int!): SuccessResponse
}
`;
