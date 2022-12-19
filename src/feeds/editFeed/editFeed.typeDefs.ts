export const typeDefs = `

type Mutation {
    """
    피드 수정
    """
    editFeed(
        id: Int! 
        body: String!
        tags: [String]
        images: [String]
        isPrivate: Boolean!
    ): SuccessResponse
}
`;
