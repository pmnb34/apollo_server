export const typeDefs = `

type feedResponse {
    success: Boolean!
    message: String
    feed: Feed
}

type Query {
    """
    피드 정보
    """
    feed(id: String!): feedResponse
}
`;
