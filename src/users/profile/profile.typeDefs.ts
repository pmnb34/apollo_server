export const typeDefs = `
type profileResponse {
    success: Boolean!
    message: String
    user: User
}
type Query {
    """
    프로필 정보
    """
    profile(id: String! ): profileResponse
}
`;
