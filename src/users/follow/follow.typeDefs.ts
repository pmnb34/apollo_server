export const typeDefs = `

type Mutation {
    """
    팔로잉
    """
    following(id: String!): SuccessResponse
    """
    언팔로잉
    """
    unfollowing(id: String!): SuccessResponse
}
`;
