export const typeDefs = `
input Location {
    latitude: String!
    longitude: String!
}
type Mutation {
    """
    νΌλ μμ±
    """
    createFeed(
        body: String!
        images: [String]
        tags: [String]
        location: Location
    ): SuccessResponse
}
`;
