// import { ExtraInfo } from "./extraInfo.js";
// import { status } from "./view.js";

// export type ElementFunctionMethods<P extends any[], R extends any> = {
//   id(id: string): ElementFunction<P, R>;
//   cls(cls: string | string[]): ElementFunction<P, R>;
//   style(styleString: string): ElementFunction<P, R>;
//   m(margin: string): ElementFunction<P, R>;
//   p(padding: string): ElementFunction<P, R>;
//   border(border: string): ElementFunction<P, R>;
//   color(color: string): ElementFunction<P, R>;
//   pos(position: string): ElementFunction<P, R>;
// } & ThisType<ElementFunction<P, R>>;

// export type ElementFunction<
//   P extends any[],
//   R extends any,
// > = ElementFunctionMethods<P, R> & {
//   <_ = any>(...args: P): ElementFunction<P, R>;
// } & {
//   rawFunc: (...args: P) => R;
//   extraInfo: ExtraInfo;
// };

// export function copyExtraInfo(extraInfo: ExtraInfo): ExtraInfo {
//   return {
//     ...extraInfo,
//     style: {
//       ...extraInfo.style,
//     },
//   };
// }

// export const elementFunctionProto: ElementFunctionMethods<any, any> &
//   ThisType<ElementFunction<any, any>> = {
//   id(id: string) {
//     this.extraInfo = copyExtraInfo(this.extraInfo);
//     this.extraInfo.id = id;
//     return createElementFunction(this.rawFunc, this.extraInfo);
//   },
//   cls(cls: string | string[]) {
//     this.extraInfo = copyExtraInfo(this.extraInfo);
//     this.extraInfo.classList = Array.isArray(cls) ? cls : [cls];
//     return createElementFunction(this.rawFunc, this.extraInfo);
//   },
//   style(styleString: string) {
//     this.extraInfo = copyExtraInfo(this.extraInfo);
//     this.extraInfo.styleString = styleString;
//     return createElementFunction(this.rawFunc, this.extraInfo);
//   },
//   m(margin: string) {
//     this.extraInfo = copyExtraInfo(this.extraInfo);
//     this.extraInfo.style.margin = margin;
//     return createElementFunction(this.rawFunc, this.extraInfo);
//   },
//   p(padding: string) {
//     this.extraInfo = copyExtraInfo(this.extraInfo);
//     this.extraInfo.style.padding = padding;
//     return createElementFunction(this.rawFunc, this.extraInfo);
//   },
//   border(border: string) {
//     this.extraInfo = copyExtraInfo(this.extraInfo);
//     this.extraInfo.style.border = border;
//     return createElementFunction(this.rawFunc, this.extraInfo);
//   },
//   color(color: string) {
//     this.extraInfo = copyExtraInfo(this.extraInfo);
//     this.extraInfo.style.color = color;
//     return createElementFunction(this.rawFunc, this.extraInfo);
//   },
//   pos(position: string) {
//     this.extraInfo = copyExtraInfo(this.extraInfo);
//     this.extraInfo.style.position = position;
//     return createElementFunction(this.rawFunc, this.extraInfo);
//   },
// };

// export function createElementFunction<P extends any[], R>(
//   rawFunc: (...args: P) => R,
//   extraInfo: ExtraInfo = { style: {} }
// ): ElementFunction<P, R> {
//   const func: any = (...args: P) => {
//     extraInfo = copyExtraInfo(extraInfo);
//     status.setExtraInfo(extraInfo);
//     return rawFunc(...args);
//   };

//   func.rawFunc = rawFunc;
//   func.extraInfo = extraInfo;

//   return Object.assign(func, elementFunctionProto);
// }
