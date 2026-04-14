import test from "node:test";
import assert from "node:assert/strict";
import { formatAverageRating } from "./leaderboardUtils.js";

test("formatAverageRating returns dash for empty values", () => {
  assert.equal(formatAverageRating(null), "-");
  assert.equal(formatAverageRating(undefined), "-");
});

test("formatAverageRating rounds to one decimal place", () => {
  assert.equal(formatAverageRating(8), "8.0");
  assert.equal(formatAverageRating(7.26), "7.3");
});
