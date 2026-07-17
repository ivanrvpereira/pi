import assert from "node:assert";
import { describe, it } from "node:test";
import { visibleWidth } from "../src/utils.ts";

describe("Devanagari conjunct width regression", () => {
	it("counts each spacing consonant in conjunct graphemes", () => {
		const samples = [
			["र्व", 2],
			["सर्व", 3],
			// क्लिक = क(1) ्(0) ल(1) ि(1) क(1). Cluster-capping terminals
			// (Ghostty) render 3; per-codepoint terminals (xterm.js) render 4.
			// We take the max — overestimating is safe, underestimating drifts.
			["क्लिक", 4],
			["ऑर्डर", 4],
		] as const;

		for (const [text, expectedWidth] of samples) {
			assert.strictEqual(visibleWidth(text), expectedWidth, `Expected ${text} to be width ${expectedWidth}`);
		}
	});

	it("counts spacing vowel signs (Mc) as one cell", () => {
		// Devanagari matras are Spacing_Mark: Kuhn-derived terminals give them a cell.
		assert.strictEqual(visibleWidth("का"), 2);
		assert.strictEqual(visibleWidth("धि"), 2);
		assert.strictEqual(visibleWidth("\u093E"), 1);
		assert.strictEqual(visibleWidth("सर्वाधिकार"), 9);
	});

	it("keeps nonspacing marks zero-width and composed Hangul at two cells", () => {
		assert.strictEqual(visibleWidth("कैंट"), 2);
		assert.strictEqual(visibleWidth("가"), 2);
		assert.strictEqual(visibleWidth("각"), 2);
	});

	it("keeps format characters zero-width", () => {
		// U+0600 ARABIC NUMBER SIGN is Format but not Default_Ignorable.
		assert.strictEqual(visibleWidth("\u0600"), 0);
		assert.strictEqual(visibleWidth("\u0600١٢"), 2);
	});
});
