import jwt from "jsonwebtoken";

if (!process.env.WORKSPACE_KEY || !process.env.WORKSPACE_SECRET) {
  throw new Error(
    "WORKSPACE_KEY and WORKSPACE_SECRET must be set in environment variables",
  );
}

const WORKSPACE_KEY = process.env.WORKSPACE_KEY;
const WORKSPACE_SECRET = process.env.WORKSPACE_SECRET;

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
