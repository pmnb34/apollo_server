export const typeDefs = `

type Mutation {
    """
    νΌλ μμ 
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
