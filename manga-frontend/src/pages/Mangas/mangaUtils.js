export function buildGroupedMangas(items = []) {
  const groups = {};

  for (const m of items) {
    const key = (m.title || "").trim().toLowerCase() || `id-${m.id}`;
    const volume = Number(m.volume) || 0;

    if (!groups[key]) {
      groups[key] = {
        key,
        title: m.title,
        maxVolume: volume,
        representative: m,
      };
      continue;
    }

    if (volume > groups[key].maxVolume) {
      groups[key].maxVolume = volume;
      groups[key].representative = m;
    }
  }

  return Object.values(groups).sort((a, b) => (a.title || "").localeCompare(b.title || ""));
}

export function validateMangaForm({ title, volume, categoryId, publisherId }) {
  if (!title?.trim()) return "Titel ist Pflicht";
  if (!volume || Number(volume) < 1) return "Bandnummer muss >= 1 sein";
  if (!categoryId) return "Kategorie ist Pflicht";
  if (!publisherId) return "Verlag ist Pflicht";
  return "";
}
