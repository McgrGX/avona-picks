import { describe, expect, it } from "vitest";
import { compare, decideVerdict, totalCost } from "./compare";

describe("totalCost", () => {
  it("adds delivery and rounds to cents", () => {
    expect(totalCost({ price: 99.99, delivery: 0.015 })).toBe(100.01);
    expect(totalCost({ price: 50 })).toBe(50);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])("rejects invalid price %s", (price) => {
    expect(() => totalCost({ price })).toThrow();
  });

  it("rejects negative delivery", () => {
    expect(() => totalCost({ price: 10, delivery: -2 })).toThrow();
  });
});

describe("decideVerdict", () => {
  it("is pending without an Amazon price", () => {
    expect(decideVerdict(undefined, 100)).toBe("pending");
  });

  it("calls differences within the tie band a tie", () => {
    expect(decideVerdict(105, 100)).toBe("tie");
    expect(decideVerdict(100, 105)).toBe("tie");
  });

  it("picks the cheaper side outside the band", () => {
    expect(decideVerdict(106, 100)).toBe("costco");
    expect(decideVerdict(80, 100)).toBe("amazon");
  });

  it("handles zero prices", () => {
    expect(decideVerdict(0, 0)).toBe("tie");
    expect(decideVerdict(0, 10)).toBe("amazon");
  });
});

describe("compare", () => {
  it("separates member and joiner verdicts", () => {
    const result = compare({ price: 140 }, { price: 110 }, 65);
    expect(result.member).toBe("costco");
    expect(result.joiner).toBe("amazon");
    expect(result.savings).toEqual({ winner: "costco", amount: 30 });
  });

  it("reports no savings for ties or pending", () => {
    expect(compare({ price: 101 }, { price: 100 }, 65).savings).toBeUndefined();
    expect(compare(undefined, { price: 100 }, 65)).toMatchObject({ member: "pending", joiner: "pending", savings: undefined });
  });
});
