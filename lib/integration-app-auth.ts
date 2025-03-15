import jwt from "jsonwebtoken";

// Your workspace key and secret.
// You can find them on the Settings page.
const WORKSPACE_KEY = "7923c287-7f37-4a91-b616-4e67f02a1f0c";
const WORKSPACE_SECRET =
  "f6054716505374e2d25a5f0783854af1c1c410cb2c265bc9c48135c4a4c1291e";

interface TokenData {
  /**
   * Identifier of your customer (user, team, or organization).
   */
  id: string;
  /**
   * Human-readable customer name.
   */
  name: string;
  /**
   * (optional) Any user fields you want to attach to your customer.
   */
  fields?: Record<string, string>;
}

export function getIntegrationToken(tokenData: TokenData) {
  return jwt.sign(tokenData, WORKSPACE_SECRET, {
    issuer: WORKSPACE_KEY,
    // To prevent token from being used for too long
    expiresIn: 7200, // 2 days, in seconds
    // HS256 signing algorithm is used by default,
    // but we recommend to go with more secure option like HS512.
    algorithm: "HS512",
  });
}
