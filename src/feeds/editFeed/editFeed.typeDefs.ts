export const typeDefs = `

type Mutation {
    """
    피드 수정
    """
    editFeed(id: Int! body: String!): SuccessResponse
}
`;
