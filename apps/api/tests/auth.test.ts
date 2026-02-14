import { describe, expect, it } from "vitest";
import { signToken, verifyToken } from "../src/lib/auth.js";

describe("auth token", () => {
  it("round-trips token", () => {
    const token = signToken({ userId: "u1", role: "CUSTOMER", email: "x@y.com" });
    const parsed = verifyToken(token);
    expect(parsed.userId).toBe("u1");
    expect(parsed.role).toBe("CUSTOMER");
  });
});
