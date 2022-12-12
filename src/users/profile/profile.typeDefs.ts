export const typeDefs = `
type profileResponse {
    success: Boolean!
    message: String
    user: User
}
type Query {
    profile(id: Int!): profileResponse
}
`;
