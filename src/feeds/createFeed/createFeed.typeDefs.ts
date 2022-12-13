export const typeDefs = `
type Mutation {
    """
    피드 작성
    """
    createFeed(userId: Int! body: String!): SuccessResponse
}
`;
