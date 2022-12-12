export const typeDefs = `
type LoginResult {
    success: Boolean!
    token: String
    message: String
}
type Mutation {
    login(
        email: String!
        password: String!
    ): LoginResult
}
`;
