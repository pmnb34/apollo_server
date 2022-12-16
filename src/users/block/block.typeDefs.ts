export const typeDefs = `

type Mutation {
    """
    차단
    """
    blocking(id: Int!): SuccessResponse
    """
    차단 풀기
    """
    unblocking(id: Int!): SuccessResponse
}
`;
