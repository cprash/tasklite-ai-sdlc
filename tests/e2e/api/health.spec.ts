import { expect, test } from "@playwright/test";

test.describe("Health API", () => {
  test("GET /health returns UP status", async ({ request }) => {
    const response = await request.get("health");

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ status: "UP" });
  });
});
