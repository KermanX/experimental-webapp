import { Ref } from "./data.js";
import { ExtraInfo, writeExtraInfoToDOM } from "./extraInfo.js";
import { View } from "./view.js";

export const ___ = "[LOADING]";

export abstract class MElement<E extends HTMLElement = HTMLElement> {
  extraInfo: ExtraInfo;
  el: E;
  constructor(
    public view: View,
    public id: string
  ) {
    console.log("Ctor", id, this.constructor.name);
  }
  abstract createDOM(): void;
  abstract updateDOM(): void;

  writeExtraInfoToDOM() {
    writeExtraInfoToDOM(this.el, this.extraInfo);
  }
}

export type MElementCtor<E extends MElement = MElement> = new (
  view: View,
  id: string
) => E;

export abstract class MElementWithChildren<
  E extends HTMLElement = HTMLElement,
> extends MElement<E> {
  children: MElement[] = [];
  protected createdChildren: Record<string, Element> = {};

  createChildrenDOM() {
    for (const child of this.children) {
      child.createDOM();
      child.writeExtraInfoToDOM();
      this.el.appendChild(child.el);
      this.createdChildren[child.id] = child.el;
    }
  }

  updateChildrenDOM() {
    let createdUnused = {};
    for (const id in this.createdChildren) {
      createdUnused[id] = true;
    }
    let lastChildEl: null | HTMLElement = null;
    for (const child of this.children) {
      if (child.id in this.createdChildren) {
        child.updateDOM();
        delete createdUnused[child.id];
      } else {
        child.createDOM();
        child.writeExtraInfoToDOM();
        if (lastChildEl) {
          lastChildEl.after(child.el);
        } else {
          if (this.el.lastChild) {
            this.el.lastChild.before(child.el);
          } else {
            this.el.appendChild(child.el);
          }
        }
        child.updateDOM();
        this.createdChildren[child.id] = child.el;
      }
      lastChildEl = child.el;
    }
    for (const id in createdUnused) {
      this.el.removeChild(this.createdChildren[id]);
      delete this.createdChildren[id];
    }
  }
}

export type Metadata = {
  id: string | null;
  classes: string[];
  style: string | null;
  ref?: Ref | null;
} | null;

export type RetValue<R, E extends MElement> = R & {
  as(ref: Ref<E>): R;
};

export interface ElementFuncs extends Record<string, [MElement, any[]]> {}

export interface ElementGenericFuncs {}

export type Elements = ElementGenericFuncs & {
  [K in keyof ElementFuncs]: <Metadata extends string = "">(
    ...args: ElementFuncs[K][1]
  ) => RetValue<boolean, ElementFuncs[K][0]>;
};

export const elements: Elements = {} as any;

export function registerElement(
  func: (this: View, id: string, metadata: Metadata, ...args: any[]) => any
) {
  elements[func.name] = func;
}
