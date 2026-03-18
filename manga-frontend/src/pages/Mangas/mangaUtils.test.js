import test from "node:test";
import assert from "node:assert/strict";
import { buildGroupedMangas, validateMangaForm } from "./mangaUtils.js";

test("validateMangaForm: Titel ist Pflicht", () => {
  const msg = validateMangaForm({ title: " ", volume: 1, categoryId: "1", publisherId: "1" });
  assert.equal(msg, "Titel ist Pflicht");
});

test("validateMangaForm: Bandnummer muss >= 1 sein", () => {
  const msg = validateMangaForm({ title: "Naruto", volume: 0, categoryId: "1", publisherId: "1" });
  assert.equal(msg, "Bandnummer muss >= 1 sein");
});

test("validateMangaForm: Kategorie ist Pflicht", () => {
  const msg = validateMangaForm({ title: "Naruto", volume: 1, categoryId: "", publisherId: "1" });
  assert.equal(msg, "Kategorie ist Pflicht");
});

test("validateMangaForm: gueltige Daten geben leeren String zurueck", () => {
  const msg = validateMangaForm({ title: "Naruto", volume: 2, categoryId: "3", publisherId: "5" });
  assert.equal(msg, "");
});

test("buildGroupedMangas: gruppiert Titel und nimmt maxVolume", () => {
  const items = [
    { id: 1, title: "Naruto", volume: 1 },
    { id: 2, title: "Naruto", volume: 4 },
    { id: 3, title: "Bleach", volume: 2 },
  ];

  const result = buildGroupedMangas(items);
  const naruto = result.find((x) => x.key === "naruto");

  assert.equal(result.length, 2);
  assert.equal(naruto.maxVolume, 4);
  assert.equal(naruto.representative.id, 2);
});
