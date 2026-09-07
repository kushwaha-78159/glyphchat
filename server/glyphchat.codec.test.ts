import { describe, expect, it } from "vitest";
import { decodeSymbols, encodeText } from "../client/src/pages/Home";

describe("GlyphChat Glyph-26 codec", () => {
  it("encodes HELLO using the final geometric alphabet", () => {
    expect(encodeText("HELLO")).toBe("△■✧✧✖");
  });

  it("decodes the HELLO example back to plain text", () => {
    expect(decodeSymbols("△■✧✧✖")).toBe("HELLO");
  });

  it("preserves spaces, punctuation, numbers, and emoji", () => {
    expect(encodeText("Meet me at 7! ✨")).toBe("✚■■⬡ ✚■ ◆⬡ 7! ✨");
  });

  it("round-trips every letter in the final 26-symbol mapping", () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    expect(decodeSymbols(encodeText(alphabet))).toBe(alphabet);
  });
});
