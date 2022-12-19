export const typeDefs = `
type Mutation {
    """
    피드 작성
    """
    createFeed(
        body: String!
        tags: [String]
        images: [String]
        isPrivate: Boolean!
    ): SuccessResponse
}
`;
