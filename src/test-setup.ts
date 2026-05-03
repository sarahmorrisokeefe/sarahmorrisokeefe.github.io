/**
 * Vitest global setup: replace Node 25's stub localStorage with a proper
 * in-memory implementation so that jsdom tests can call .clear(), .setItem(),
 * .getItem() etc. without errors.
 *
 * Node 25 exposes a built-in `localStorage` (backed by --localstorage-file)
 * that only partially implements the Web Storage API — .clear() is missing.
 * This setup file runs before every test file and ensures the global is a
 * fully-functional in-memory Storage object.
 */

class InMemoryStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key)
      ? this.store[key]
      : null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}

// Only replace if the native implementation is broken (missing .clear).
if (typeof localStorage === 'undefined' || typeof localStorage.clear !== 'function') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: new InMemoryStorage(),
    writable: true,
    configurable: true,
  });
}
