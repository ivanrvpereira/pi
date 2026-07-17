import assert from "node:assert";
import { describe, it } from "node:test";
import { visibleWidth } from "../src/utils.ts";

describe("Devanagari conjunct width regression", () => {
	it("counts each spacing consonant in conjunct graphemes", () => {
		const samples = [
			["र्व", 2],
			["सर्व", 3],
			["क्लिक", 3],
			["ऑर्डर", 4],
		] as const;

		for (const [text, expectedWidth] of samples) {
			assert.strictEqual(visibleWidth(text), expectedWidth, `Expected ${text} to be width ${expectedWidth}`);
		}
	});

	it("keeps combining marks zero-width and composed Hangul at two cells", () => {
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
