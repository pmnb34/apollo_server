export const typeDefs = `

type Mutation {
    """
    프로필 수정
    """
    editProfile(
        name: String
        username: String
        password: String
        avatar: String
        introduction: String
    ): SuccessResponse
}
`;
