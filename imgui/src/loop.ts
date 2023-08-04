import { D, getD } from "./data";
import { Metadata, registerElement } from "./element";
import { View } from "./view";

declare module "./element" {
  interface ElementCustomFuncs {
    for<Metadata extends string = "", T = unknown>(
      arr: D<Iterable<T>>,
      key: keyof T | ((item: T, index: number) => D<string>),
      body: (item: T, index: number) => void
    ): void;
    forRange<Metadata extends string = "">(
      times: D<number>,
      body: (index: number) => void
    ): void;
    // for<Metadata extends string = "">(
    //   times: number,
    //   body: (index: number) => void
    // ): void;
    // forEach<Metadata extends string = "", T = unknown>(
    //   arr: Iterable<T>,
    //   body: (item: T, index: number) => void
    // ): void;
  }
}
registerElement(function <T>(
  this: View,
  id: string,
  metadata: Metadata,
  arr: Iterable<T>,
  key: keyof T | ((item: T, index: number) => D<string>),
  body: (item: T, index: number) => void
) {
  let k: any;
  if (typeof key === "string") {
    k = (item: T) => item[key];
  } else {
    k = key;
  }
  let i = 0;
  for (const item of getD(arr)) {
    this.status.beginChild(id, k(item, i));
    body(item, i);
    this.status.endChild();
    i++;
  }
  return false;
}, "for");
registerElement(function forRange(
  this: View,
  id: string,
  metadata: Metadata,
  times: number,
  body: (index: number) => void
) {
  times = getD(times);
  for (let i = 0; i < times; i++) {
    this.status.beginChild(id, i);
    body(i);
    this.status.endChild();
  }
  return false;
});

// registerElement(function <T>(
//   this: View,
//   id: string,
//   metadata: Metadata,
//   arr_or_times,
//   key_or_body,
//   body_or_none
// ) {
//   if (typeof arr_or_times === "number") {
//     let times = arr_or_times;
//     let body = key_or_body;
//     for (let i = 0; i < times; i++) {
//       this.status.idPrefix.push(`${id}[${i}]`);
//       body(i);
//       this.status.idPrefix.pop();
//     }
//   } else {
//     let arr = arr_or_times;
//     let key = key_or_body;
//     let body = body_or_none;
//     let k;
//     if (typeof key === "string") {
//       k = (item: T) => item[key];
//     } else {
//       k = key;
//     }
//     let i = 0;
//     for (const item of arr) {
//       this.status.idPrefix.push(`${id}[${k(item, i)}]`);
//       body(item, i);
//       this.status.idPrefix.pop();
//       i++;
//     }
//   }
// }, "for");
// registerElement(function <T>(
//   this: View,
//   id: string,
//   metadata: Metadata,
//   arr,
//   body
// ) {
//   let i = 0;
//   for (const item of arr) {
//     this.status.idPrefix.push(`${id}[${i}]`);
//     body(item, i);
//     this.status.idPrefix.pop();
//     i++;
//   }
// }, "forEach");

export const byIndex = (_: any, index: number) => index.toString();
export const bySelf = (item: any) => `${item}`;
