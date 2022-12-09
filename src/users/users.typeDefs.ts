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
    allUsers: [User]
}
`;
