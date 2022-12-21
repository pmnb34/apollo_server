export const typeDefs = `

type Mutation {
    """
    피드 Like
    """
    like(id: String!): SuccessResponse
    """
    피드 unLike
    """
    unlike(id: String!): SuccessResponse
}
`;
