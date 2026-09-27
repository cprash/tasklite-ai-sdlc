import { describe, expect, it } from "vitest";
import { updateTaskTitleSchema } from "./task.validators.js";

describe("updateTaskTitleSchema [EPMCDMETST-66640]", () => {
  it("accepts a non-empty title", () => {
    const result = updateTaskTitleSchema.safeParse({ title: "Buy milk" });
    expect(result.success).toBe(true);
  });

  it("trims surrounding whitespace", () => {
    const result = updateTaskTitleSchema.safeParse({ title: "  Buy milk  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Buy milk");
    }
  });

  it("rejects an empty title", () => {
    expect(updateTaskTitleSchema.safeParse({ title: "" }).success).toBe(false);
  });

  it("rejects a whitespace-only title", () => {
    expect(updateTaskTitleSchema.safeParse({ title: "   " }).success).toBe(false);
  });

  it("rejects a missing title", () => {
    expect(updateTaskTitleSchema.safeParse({}).success).toBe(false);
  });
});
