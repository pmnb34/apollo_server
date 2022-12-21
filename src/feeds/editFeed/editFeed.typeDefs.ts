export const typeDefs = `

type Mutation {
    """
    피드 수정
    """
    editFeed(
        id: String! 
        body: String!
        tags: [String]
        images: [String]
        isPrivate: Boolean!
    ): SuccessResponse
}
`;
