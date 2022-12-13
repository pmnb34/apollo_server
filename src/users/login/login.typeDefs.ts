export const typeDefs = `
type LoginResult {
    success: Boolean!
    token: String
    message: String
}
type Mutation {
    """
    로그인
    """
    login(
        email: String!
        password: String!
    ): LoginResult
}
`;
