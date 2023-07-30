export const PDSymbol = Symbol("PD");

export class PD<T> {
  constructor(public value: T) {}
  [PDSymbol] = true;
  [Symbol.toPrimitive]() {
    return this.value;
  }
}

export function d<T>(v: T): PD<T> {
  return new PD(v);
}

export type D<T> = T | PD<T>;

export function getD<T>(d: D<T>): T {
  return d[PDSymbol] ? (d as PD<T>).value : (d as T);
}

export function setD<T>(d: D<T>, v: T): boolean {
  if (d[PDSymbol]) {
    (d as PD<T>).value = v;
    return true;
  }
  return false;
}
