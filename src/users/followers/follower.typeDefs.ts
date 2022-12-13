export const typeDefs = `
type followerPayload {
    success: Boolean!
    message: String
    user: [User]
}
type Query {
    """
    팔로워 리스트 
    """
    follower(id: Int!): followerPayload

    """
    팔로잉 리스트 
    """
    following(id: Int!): followerPayload
}
`;
