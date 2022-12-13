export const typeDefs = `
type Mutation {
    """
    회원가입
    """
    createAccount(
        name: String!
        username: String!
        email: String!
        password: String!
    ): SuccessResponse
}
`;
