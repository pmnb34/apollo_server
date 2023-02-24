export const typeDefs = `
type Profile {
    name: String
    avatar: String
    introduction: String
}
type User {
    id: String!
    name: String
    email: String!
    username: String!
    profile: Profile
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
