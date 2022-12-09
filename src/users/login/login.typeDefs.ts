export const typeDefs = `

type Mutation {
    login(
        email: String!
        password: String!
    ): LoginResult
}
`;
