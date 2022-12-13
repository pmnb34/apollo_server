export const typeDefs = `
type User {
    id: Int!
    name: String
    email: String!
    username: String!
    avatar: String
    createdAt: String!
    updatedAt: String!
}
type Query {
    """
    모든 유저 리스트
    """
    allUsers: [User]
}
`;
