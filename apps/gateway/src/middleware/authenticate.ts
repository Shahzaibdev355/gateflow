import type { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";

const secretValue = process.env.JWT_SECRET;

if (!secretValue) {
  throw new Error("JWT_SECRET is required");
}

const secret = new TextEncoder().encode(secretValue);

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication token required",
      });

      return;
    }

    const token = authorization.slice(7);

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      issuer: "shopsphere-auth",
      audience: "shopsphere-api",
    });

    const userId = payload.sub;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });

      return; 
    }

    const role = typeof payload.role === "string" ? payload.role : undefined;

    req.user = { id: userId, role };

    // Never trust identity headers from the client.
    req.headers["x-user-id"] = userId;

    if (role) {
      req.headers["x-user-role"] = role;
    } else {
      delete req.headers["x-user-role"];
    }

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
