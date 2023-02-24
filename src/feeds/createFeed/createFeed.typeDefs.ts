export const typeDefs = `
input Location {
    latitude: String!
    longitude: String!
}
input Images {
    index: Int!
    location: String!
}
type Mutation {
    """
    피드 작성
    """
    createFeed(
        body: String!
        images: [Images]
        tags: [String]
        location: Location
    ): SuccessResponse
}
`;
