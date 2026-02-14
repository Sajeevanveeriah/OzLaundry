import { describe, expect, it } from "vitest";
import { signQrPayload, verifyQrPayload } from "../src/lib/qr.js";

describe("qr signature", () => {
  it("validates signed payload", () => {
    const payload = signQrPayload("order123");
    const result = verifyQrPayload(payload);
    expect(result.valid).toBe(true);
    expect(result.orderId).toBe("order123");
  });

  it("rejects tampered payload", () => {
    const result = verifyQrPayload("order123.invalid");
    expect(result.valid).toBe(false);
  });
});
