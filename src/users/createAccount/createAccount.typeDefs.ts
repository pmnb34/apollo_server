export const typeDefs = `
type Mutation {
    createAccount(
        name: String
        username: String
        email: String
        password: String
    ): SuccessResponse
}
`;