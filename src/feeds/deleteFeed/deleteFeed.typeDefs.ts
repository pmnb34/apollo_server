export const typeDefs = `

type Mutation {
    """
    피드 삭제
    """
    deleteFeed(id:Int!): SuccessResponse
}
`;
