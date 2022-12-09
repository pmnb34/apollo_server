export const typeDefs = `
type SuccessResponse {
    success: Boolean!
    message: String
}
type LoginResult {
    success: Boolean!
    token: String
    error: String
}
`;
