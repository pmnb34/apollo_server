export const typeDefs = `
type Image {
    id: Int!
    index:Int
    location: String!
}
type Feed {
    id: Int!
    user: User
    userId: Int
    body: String
    images: [Image]
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
