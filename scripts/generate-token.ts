import "dotenv/config";
import { SignJWT } from "jose";

async function generateToken(): Promise<void> {
  const secretValue = process.env.JWT_SECRET;

  if (!secretValue) {
    throw new Error("JWT_SECRET is required");
  }

  const secret = new TextEncoder().encode(secretValue);

  const token = await new SignJWT({
    role: "user",
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setSubject("user-123")
    .setIssuer("shopsphere-auth")
    .setAudience("shopsphere-api")
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);

  console.log("JWT Token:");
  console.log(token);
}

generateToken().catch((error: unknown) => {
  console.error("Token generation failed:", error);
  process.exitCode = 1;
});
