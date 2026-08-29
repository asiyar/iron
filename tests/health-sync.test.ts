import { describe, expect, it } from "vitest";

import { requestHealthPermissionAndSync, syncHealthData } from "../lib/health-sync";

describe("health sync fallback", () => {
  it("returns a safe unsupported state outside iOS and Android native builds", async () => {
    await expect(syncHealthData()).resolves.toMatchObject({ provider: "none", status: "unsupported", enabled: false });
    await expect(requestHealthPermissionAndSync()).resolves.toMatchObject({ provider: "none", status: "unsupported", enabled: false });
  });
});
