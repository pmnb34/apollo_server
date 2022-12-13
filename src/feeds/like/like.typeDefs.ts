export const typeDefs = `

type Mutation {
    """
    피드 Like
    """
    like(id: Int!): SuccessResponse
    """
    피드 unLike
    """
    unlike(id: Int!): SuccessResponse
}
`;
