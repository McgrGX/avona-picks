import { describe, expect, it } from "vitest";
import { resolveSiteConfig } from "./site-config";

describe("resolveSiteConfig", () => {
  it("defaults to a non-indexable local origin", () => {
    expect(resolveSiteConfig({})).toEqual({ origin: "http://localhost:3200", indexable: false });
  });

  it("accepts the production origin with indexing", () => {
    expect(resolveSiteConfig({ AVONA_SITE_URL: "https://avonapicks.com/", SITE_INDEXABLE: "true" })).toEqual({ origin: "https://avonapicks.com", indexable: true });
  });

  it.each(["", "TRUE", "1", "yes"])("rejects invalid boolean %j", (value) => {
    expect(() => resolveSiteConfig({ SITE_INDEXABLE: value })).toThrow("SITE_INDEXABLE must be true or false");
  });

  it.each(["", "avonapicks.com", "https://avonapicks.com/path", "https://user:pw@avonapicks.com", "https://avonapicks.com/?a=1", "https://avonapicks.com/#x"])("rejects malformed origin %j", (value) => {
    expect(() => resolveSiteConfig({ AVONA_SITE_URL: value })).toThrow();
  });

  it("requires HTTPS off localhost", () => {
    expect(() => resolveSiteConfig({ AVONA_SITE_URL: "http://avonapicks.com" })).toThrow("requires HTTPS");
  });

  it("refuses indexing for local or missing origins", () => {
    expect(() => resolveSiteConfig({ SITE_INDEXABLE: "true" })).toThrow("non-local HTTPS");
    expect(() => resolveSiteConfig({ AVONA_SITE_URL: "http://localhost:3200", SITE_INDEXABLE: "true" })).toThrow("non-local HTTPS");
  });
});
