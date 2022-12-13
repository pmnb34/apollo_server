export const typeDefs = `

type Mutation {
    """
    팔로잉
    """
    following(id: Int!): SuccessResponse
    """
    언팔로잉
    """
    unfollowing(id: Int!): SuccessResponse
}
`;
