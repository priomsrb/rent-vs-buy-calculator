export function parseLocalStorage(key: string): any {
  const rawValue = localStorage.getItem(key);
  try {
    if (rawValue != null) {
      return JSON.parse(rawValue);
    }
  } catch (e) {
    // Fall through
  }
  return null;
}

export function writeToLocalStorage(key: string, value: any): any {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Couldn't write to localStorage key ${key}`, e);
  }
}
