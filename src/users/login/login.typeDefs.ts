export const typeDefs = `
type LoginResult {
    success: Boolean!
    id:String
    token: String
    tokenTime: String
    message: String
    method: String
}
type Mutation {
    """
    로그인
    """
    login(
        email: String!
        password: String!
    ): LoginResult
    kakao(
        token: String!
    ): LoginResult

    
}
type Query {
    refreshToken(
        id: String!
        token: String!
        method: String!
    ): LoginResult
}
`;
