export function readRecords(key) {
  const raw = localStorage.getItem(key);
  if (raw === null) return [];
  const value = JSON.parse(raw);
  if (!Array.isArray(value)) throw new Error('Saved data could not be read. Existing records have been preserved.');
  return value;
}

// The lock covers read + merge + write across tabs on the same origin.
export async function updateRecords(key, update) {
  const commit = () => {
    const next = update(readRecords(key));
    localStorage.setItem(key, JSON.stringify(next));
    return next;
  };
  try {
    if (globalThis.navigator?.locks) return await navigator.locks.request('translatebetter:' + key, commit);
    return commit();
  } catch (error) {
    throw new Error('Could not save progress in this browser. Check available storage and try again. ' + error.message);
  }
}

export function appendRecord(key, record) {
  return updateRecords(key, previous => previous.some(item => item.id === record.id) ? previous : [...previous, record]);
}
