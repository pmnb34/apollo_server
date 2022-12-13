export const typeDefs = `
type searchResponse {
    success: Boolean!
    message: String
    feed:[Feed]
    feedByTag:[Feed]
    feedByMedia:[Feed]
    user:[User]
}
type Query {
    """
    검색
    #태그, 전체, 유저, 미디어
    """
    search(keyword: String!): searchResponse
}
`;
