import { describe, expect, it } from "vitest";

const apiKey = process.env.REVENUECAT_IOS_PUBLIC_SDK_KEY;

// Ağ ve gizli anahtar gerektirir: anahtar tanımlı değilse (ör. CI fork build) atlanır.
describe.skipIf(!apiKey)("RevenueCat public SDK credentials", () => {
  it("accepts the configured Test Store key for a read-only subscriber lookup", async () => {
    const key = apiKey;
    const response = await fetch("https://api.revenuecat.com/v1/subscribers/ironpulse-credential-check", {
      headers: { Authorization: `Bearer ${key}` },
    });

    expect([200, 201, 404]).toContain(response.status);
  }, 15_000);
});
