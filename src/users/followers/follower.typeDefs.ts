export const typeDefs = `
type followerPayload {
    success: Boolean!
    message: String
    user: [User]
}
type Query {
    follower(id: Int!): followerPayload
    following(id: Int!): followerPayload
}
`;
