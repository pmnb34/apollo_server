export const typeDefs = `

type Mutation {
    editProfile(
        name: String
        username: String
        password: String
        avatar: String
        introduction: String
    ): SuccessResponse
}
`;
