export const typeDefs = `
type Mutation {
    """
    회원가입
    """
    createAccount(
        username: String!
        email: String!
        password: String!
    ): SuccessResponse
}
`;
