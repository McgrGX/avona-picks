import { describe, expect, it } from "vitest";
import { getLinkNote, getOutboundRel, getOutboundUrl } from "./outbound";

const disclosure = "As an Amazon Associate I earn from qualifying purchases.";

describe("getOutboundUrl", () => {
  it("accepts market-matched retailer hosts", () => {
    expect(getOutboundUrl({ kind: "sample", url: "https://www.amazon.ca/" }, "amazon", "ca")).toBe("https://www.amazon.ca/");
    expect(getOutboundUrl({ kind: "direct", url: "https://www.costco.com/" }, "costco", "us")).toBe("https://www.costco.com/");
  });

  it("rejects the wrong market's host", () => {
    expect(() => getOutboundUrl({ kind: "sample", url: "https://www.amazon.com/" }, "amazon", "ca")).toThrow("Untrusted");
    expect(() => getOutboundUrl({ kind: "sample", url: "https://www.costco.ca/" }, "costco", "us")).toThrow("Untrusted");
  });

  it.each([
    "http://www.amazon.com/",
    "https://www.amazon.com.evil.example/",
    "https://user@www.amazon.com/",
    "https://www.amazon.com:8443/",
    "https://www.amazon.com/#frag",
    "javascript:alert(1)",
    "not a url",
  ])("rejects unsafe URL %s", (url) => {
    expect(() => getOutboundUrl({ kind: "sample", url }, "amazon", "us")).toThrow();
  });

  it("forbids tracking parameters on non-affiliate links", () => {
    expect(() => getOutboundUrl({ kind: "sample", url: "https://www.amazon.com/?tag=x" }, "amazon", "us")).toThrow("tracking");
    expect(() => getOutboundUrl({ kind: "direct", url: "https://www.costco.com/?ref=x" }, "costco", "us")).toThrow("tracking");
  });

  it("requires a disclosure on affiliate links", () => {
    expect(() => getOutboundUrl({ kind: "affiliate", url: "https://www.amazon.com/dp/X?tag=a-20", disclosure: " " }, "amazon", "us")).toThrow("disclosure");
    expect(getOutboundUrl({ kind: "affiliate", url: "https://www.amazon.com/dp/X?tag=a-20", disclosure }, "amazon", "us")).toContain("tag=a-20");
  });

  it("never allows affiliate links to Costco", () => {
    expect(() => getOutboundUrl({ kind: "affiliate", url: "https://www.costco.com/?x=1", disclosure }, "costco", "us")).toThrow("Only approved Amazon");
  });
});

describe("rel and notes", () => {
  it("marks only affiliate links sponsored", () => {
    expect(getOutboundRel({ kind: "affiliate", url: "", disclosure })).toBe("sponsored noopener noreferrer");
    expect(getOutboundRel({ kind: "sample", url: "" })).toBe("noopener noreferrer");
  });

  it("states that sample and direct links earn nothing", () => {
    expect(getLinkNote({ kind: "sample", url: "" }, "amazon")).toMatch(/earns nothing/);
    expect(getLinkNote({ kind: "direct", url: "" }, "costco")).toMatch(/earns nothing/);
  });
});
