export const typeDefs = `
input Location {
    latitude: String!
    longitude: String!
}
type Mutation {
    """
    피드 작성
    """
    createFeed(
        body: String!
        images: [String]
        tags: [String]
        location: Location
    ): SuccessResponse
}
`;
