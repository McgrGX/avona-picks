import { describe, expect, it } from "vitest";
import { categories, compareItem, entryStatus, getItem, getVideo, items, itemsFor, scoreboard, videos, videosFor, videoStatus } from "./catalog";
import { markets } from "./markets";
import { getOutboundUrl } from "./outbound";

describe("catalog integrity", () => {
  it("has unique slugs and valid categories", () => {
    expect(new Set(items.map((item) => item.slug)).size).toBe(items.length);
    const slugs = categories.map((category) => category.slug);
    for (const item of items) expect(slugs).toContain(item.category);
  });

  it("covers every launch category in every market", () => {
    for (const market of markets) for (const category of categories) expect(itemsFor(market, category.slug).length).toBeGreaterThan(0);
  });

  it("stores Amazon prices only as labeled sample data", () => {
    for (const item of items) for (const listing of Object.values(item.markets)) {
      if (listing.amazon.price !== undefined) expect(listing.amazon.source.kind).toBe("sample");
      else expect(listing.amazon.source.kind).toBe("amazon-api");
    }
  });

  it("records no Quebec warehouse observations while Quebec is paused", () => {
    for (const item of items) for (const listing of Object.values(item.markets)) {
      if (listing.costco.source.kind === "in-warehouse") expect(listing.costco.source.region).not.toMatch(/quebec|québec|\bQC\b/i);
    }
  });

  it("has outbound links that pass validation", () => {
    for (const item of items) for (const market of markets) {
      const listing = item.markets[market];
      if (!listing) continue;
      expect(() => getOutboundUrl(listing.amazon.offer, "amazon", market)).not.toThrow();
      expect(() => getOutboundUrl(listing.costco.offer, "costco", market)).not.toThrow();
    }
  });

  it("only links videos to items listed in the video's market", () => {
    for (const video of videos) {
      expect(video.entries.length).toBeGreaterThan(0);
      for (const entry of video.entries) expect(getItem(entry.itemSlug)?.markets[video.market]).toBeDefined();
    }
  });

  it("has unique, URL-safe video ids", () => {
    expect(new Set(videos.map((video) => video.id)).size).toBe(videos.length);
    for (const video of videos) expect(video.id).toMatch(/^[a-z0-9-]+$/);
  });
});

describe("verdicts", () => {
  it("is pending when the Amazon price comes from the API", () => {
    expect(compareItem(getItem("slow-masticating-juicer")!, "us").member).toBe("pending");
  });

  it("tallies every listed item once", () => {
    for (const market of markets) {
      const score = scoreboard(market);
      expect(score.amazon + score.costco + score.tie + score.pending).toBe(itemsFor(market).length);
    }
  });

  it("flags videos whose verdict or price date is outdated", () => {
    expect(videoStatus(getVideo("yt-001")!)).toBe("current");
    expect(videoStatus(getVideo("tt-002")!)).toBe("updated");
  });

  it("marks a long-form video updated when any one item changes", () => {
    const video = getVideo("yt-004")!;
    const statuses = video.entries.map((entry) => entryStatus(video, entry));
    expect(statuses.filter((status) => status === "updated")).toHaveLength(1);
    expect(videoStatus(video)).toBe("updated");
  });

  it("finds videos by item across long-form entries", () => {
    expect(videosFor("pod-coffee-maker-bundle", "us").map((video) => video.id)).toEqual(["yt-004"]);
    expect(videosFor("pod-coffee-maker-bundle", "ca")).toEqual([]);
    expect(getVideo("nope")).toBeUndefined();
  });
});
