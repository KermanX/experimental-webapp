import { D, Ref } from "./data.js";
import { View } from "./view.js";

export const ___ = "[LOADING]";

export abstract class MElement<E extends HTMLElement = HTMLElement> {
  el: E;
  constructor(
    public view: View,
    public id: string,
    public metadata: Metadata
  ) {
    console.log("Ctor", id, this.constructor.name);
  }
  abstract createDOM(): void;
  abstract updateDOM(): void;

  protected setD<T>(d: D<T>, v: T): boolean {
    return this.view.setD(d, v);
  }

  writeMetadataToDOM() {
    if (!this.metadata) return;
    if (this.metadata.id) this.el.id = this.metadata.id;
    if (this.metadata.classes && this.metadata.classes!.length > 0)
      this.el.classList.add(...this.metadata.classes);
    if (this.metadata.style) this.el.style.cssText = this.metadata.style;
  }
}

export type MElementCtor<E extends MElement = MElement> = new (
  view: View,
  id: string,
  metadata: Metadata
) => E;

export abstract class MElementWithChildren<
  E extends HTMLElement = HTMLElement,
> extends MElement<E> {
  children: MElement[] = [];
  protected createdChildren: Record<string, Element> = {};

  createChildrenDOM() {
    for (const child of this.children) {
      child.createDOM();
      child.writeMetadataToDOM();
      this.el.appendChild(child.el);
      this.createdChildren[child.id] = child.el;
    }
  }

  updateChildrenDOM() {
    let createdUnused: Record<string, boolean> = {};
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
        child.writeMetadataToDOM();
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

export interface Metadata {
  id?: string | null;
  classes?: string[] | null;
  style?: string | null;
  ref?: Ref<any> | null;
}

// export type RetValue<R, T extends object> = R & {
//   as(ref: Ref<T>): R;
// };

export interface ElementFuncs extends Record<string, [object, any[], any]> {}

export interface ElementCustomFuncs {}

export type Elements<
  E extends keyof ElementCustomFuncs | keyof ElementFuncs =
    | keyof ElementCustomFuncs
    | keyof ElementFuncs,
> = ElementCustomFuncs & {
  [K in keyof ElementFuncs]: <M extends string | Metadata = "">(
    ...args: ElementFuncs[K][1]
    //@ts-ignore
  ) => this is Elements<K>;
} & {
  event: ElementFuncs[E][2];
  // @ts-ignore
  as(ref: Ref<ElementFuncs[E][0]>): this is Elements<E>;
};

export const elements: Elements = {} as any;

export function registerElement(
  func: (this: View, id: string, metadata: Metadata, ...args: any[]) => boolean,
  name = func.name
) {
  elements[name] = func as any;
}
