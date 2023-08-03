import { MElement } from "./element";

export const PDSymbol = Symbol("PD");

type DWarppable = string | number | bigint | boolean | null | undefined;

export class PD<T> {
  constructor(public value: T) {}
  [PDSymbol] = true;
  [Symbol.toPrimitive]() {
    return this.value;
  }
}

export function d<T extends DWarppable>(v: T): Readonly<T> & PD<T> {
  return new PD(v) as any as Readonly<T> & PD<T>;
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

export function toRaw<T extends object>(d: T): T {
  for (const key in d) {
    d[key] = getD(d[key]);
  }
  return d as T;
}

export interface Ref<E extends MElement = MElement> {
  current: E | null;
}

export function ref<E extends MElement>(current: E | null = null): Ref<E> {
  return { current };
}
