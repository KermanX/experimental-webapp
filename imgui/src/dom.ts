import { D, getD, setD } from "./data.js";
import { currentView, status, ViewRender } from "./view.js";

// class MIdManager {
//   protected currentId: MId = Symbol();
//   generate(): MId {
//     const id = this.currentId;
//     this.currentId = Symbol();
//     return id;
//   }
// }
// const mIdManager = new MIdManager();

export abstract class MElement<E extends HTMLElement = HTMLElement> {
  constructor(public id: string) {}
  abstract create(): E;
  abstract update(el: E): void;
}

export abstract class MElementWithChildren<
  E extends HTMLElement = HTMLElement,
> extends MElement<E> {
  children: MElement[] = [];
  childrenEls: HTMLElement[] = [];
  abstract create(): E;
  abstract update(el: E): void;

  createChildren(el: E) {
    this.children.forEach((child) => {
      const childEl = child.create();
      el.appendChild(childEl);
      this.childrenEls.push(childEl);
    });
  }
  updateChildren() {
    this.children.forEach((child, i) => {
      child.update(this.childrenEls[i]);
    });
  }
}

export class RootElement extends MElementWithChildren {
  create() {
    const el = document.getElementById("root");
    this.createChildren(el);
    return el;
  }
  update(el: HTMLElement) {
    this.updateChildren();
  }
}

export class DivElement extends MElementWithChildren<HTMLDivElement> {
  create() {
    const el = document.createElement("div");
    this.createChildren(el);
    return el;
  }
  update(el: HTMLDivElement) {
    this.updateChildren();
  }
}

export class ButtonElement extends MElement<HTMLButtonElement> {
  text: string;
  create() {
    const el = document.createElement("button");
    el.addEventListener("click", (e) => {
      currentView.fire(this.id, e);
    });
    return el;
  }
  update(el: HTMLButtonElement) {
    el.textContent = this.text;
  }
}

export class ParagraphElement extends MElement<HTMLParagraphElement> {
  text: string;
  create() {
    const el = document.createElement("p");
    return el;
  }
  update(el: HTMLParagraphElement) {
    el.textContent = this.text;
  }
}

export class NumberInputElement extends MElement<HTMLInputElement> {
  value: D<number>;
  create() {
    const el = document.createElement("input");
    el.type = "number";
    el.addEventListener("input", (e) => {
      setD(this.value, +e.target["value"]);
      currentView.update();
    });
    return el;
  }
  update(el: HTMLInputElement) {
    //@ts-ignore
    el.value = getD(this.value);
  }
}

export function div(inner: ViewRender): void {
  status.parent(DivElement, inner, {});
}

export function button(text: string): boolean {
  status.child(ButtonElement, { text });
  return status.isReceiver;
}

export function p(text: string): void {
  status.child(ParagraphElement, {
    text,
  });
}

export function numberInput(value: D<number>): void {
  status.child(NumberInputElement, { value });
}
