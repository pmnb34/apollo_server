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
    allFeeds: [Feed]
}
`;
