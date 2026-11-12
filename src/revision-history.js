// Preserve separately submitted attempts, even when their text is identical.
export function sameVersion(first, second) {
  if (first.id && second.id) return first.id === second.id;
  if (first.date && second.date) return first.date === second.date && first.text === second.text;
  return first === second;
}

export function appendVersions(previous, incoming) {
  return incoming.reduce((history, version) =>
    history.some(existing => sameVersion(existing, version)) ? history : [...history, version],
  [...previous]);
}
