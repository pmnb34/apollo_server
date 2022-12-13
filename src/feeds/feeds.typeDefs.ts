export const typeDefs = `
type Feed {
    id: Int!
    user: User
    userId: Int
    body: String
    viewCount: Int
    createdAt: String
    updatedAt: String
}
type Query {
    """
    모든 피드 리스트
    """
    allFeeds: [Feed]
}
`;
