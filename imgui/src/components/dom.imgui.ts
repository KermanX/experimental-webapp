import { D, setD, getD } from "../data.js";
import {
  MElementWithChildren,
  MElement,
  ___,
  registerElement,
  Metadata,
} from "../element.js";
import { ViewRender, View } from "../view.js";

export class RootElement extends MElementWithChildren {
  createDOM() {
    this.el = document.getElementById("root");
  }
  updateDOM() {
    this.updateChildrenDOM();
  }
}

export class DivElement extends MElementWithChildren<HTMLDivElement> {
  createDOM() {
    this.el = document.createElement("div");
    this.createChildrenDOM();
  }
  updateDOM() {
    this.updateChildrenDOM();
  }
}
declare module "../element" {
  interface ElementFuncs {
    div: [DivElement, [inner: ViewRender]];
  }
}
registerElement(function div(
  id: string,
  metadata: Metadata,
  inner: ViewRender
) {
  return this.parent(id, metadata, DivElement, inner, {});
});

export class ButtonElement extends MElement<HTMLButtonElement> {
  text: D<string>;
  disabled: boolean;
  createDOM() {
    this.el = document.createElement("button");
    this.el.type = "button";
    this.el.addEventListener("click", (e) => {
      this.view.fire(this.id, e);
    });
  }
  updateDOM() {
    this.el.textContent = getD(this.text);
    this.el.disabled = this.disabled;
  }
}
declare module "../element" {
  interface ElementFuncs {
    button: [ButtonElement, [text: D<string>]];
  }
}
registerElement(function button(
  id: string,
  metadata: Metadata,
  text: D<string>
) {
  return this.child(id, metadata, ButtonElement, { text });
});

export class ParagraphElement extends MElement<HTMLParagraphElement> {
  text: D<string>;
  createDOM() {
    this.el = document.createElement("p");
  }
  updateDOM() {
    this.el.textContent = getD(this.text);
  }
}
declare module "../element" {
  interface ElementFuncs {
    p: [ParagraphElement, [text: D<string>]];
  }
}
registerElement(function p(id: string, metadata: Metadata, text: D<string>) {
  return this.child(id, metadata, ParagraphElement, { text });
});

export class SpanElement extends MElement<HTMLSpanElement> {
  text: D<string>;
  createDOM() {
    this.el = document.createElement("span");
  }
  updateDOM() {
    this.el.textContent = getD(this.text);
  }
}
declare module "../element" {
  interface ElementFuncs {
    t: [SpanElement, [text: D<string>]];
    span: [SpanElement, [text: D<string>]];
  }
}
registerElement(function t(id: string, metadata: Metadata, text: D<string>) {
  return this.child(id, metadata, SpanElement, { text });
});
registerElement(function span(id: string, metadata: Metadata, text: D<string>) {
  return this.child(id, metadata, SpanElement, { text });
});

export class NumberInputElement extends MElement<HTMLLabelElement> {
  label: D<string>;
  value: D<number>;
  inputEl: HTMLInputElement;
  textNode: Text;
  createDOM() {
    this.el = document.createElement("label");
    this.inputEl = document.createElement("input");
    this.textNode = document.createTextNode(___);
    this.el.style.display = "block";
    this.inputEl.type = "number";
    this.el.addEventListener("input", (e) => {
      setD(this.value, +e.target["value"]);
      this.view.update();
    });
    this.el.appendChild(this.textNode);
    this.el.appendChild(this.inputEl);
  }
  updateDOM() {
    this.textNode.data = getD(this.label);
    this.inputEl.value = getD(this.value).toString();
  }
}
declare module "../element" {
  interface ElementFuncs {
    numberInput: [NumberInputElement, [label: D<string>, value: D<number>]];
  }
}
registerElement(function numberInput(
  id: string,
  metadata: Metadata,
  label: D<string>,
  value: D<number>
) {
  return this.child(id, metadata, NumberInputElement, { label, value });
});

export class TextInputElement extends MElement<HTMLLabelElement> {
  label: D<string>;
  value: D<string>;
  inputEl: HTMLInputElement;
  textNode: Text;
  createDOM() {
    this.el = document.createElement("label");
    this.inputEl = document.createElement("input");
    this.textNode = document.createTextNode(___);
    this.el.style.display = "block";
    this.inputEl.type = "text";
    this.inputEl.addEventListener("input", (e) => {
      setD(this.value, e.target["value"]);
      this.view.update();
    });
    this.el.appendChild(this.textNode);
    this.el.appendChild(this.inputEl);
  }
  updateDOM() {
    this.textNode.data = getD(this.label);
    this.inputEl.value = getD(this.value);
  }
}
declare module "../element" {
  interface ElementFuncs {
    textInput: [TextInputElement, [label: D<string>, value: D<string>]];
  }
}
registerElement(function textInput(
  id: string,
  metadata: Metadata,
  label: D<string>,
  value: D<string>
) {
  return this.child(id, metadata, TextInputElement, { label, value });
});

export class StyleElement extends MElement<HTMLStyleElement> {
  source: D<string>;
  createDOM() {
    this.el = document.createElement("style");
  }
  updateDOM() {
    this.el.innerHTML = getD(this.source);
  }
}
declare module "../element" {
  interface ElementFuncs {
    style: [NumberInputElement, [source: D<string>]];
  }
}
registerElement(function style(
  id: string,
  metadata: Metadata,
  source: D<string>
) {
  return this.child(id, metadata, StyleElement, { source });
});

export class TableElement extends MElementWithChildren<HTMLTableElement> {
  createDOM() {
    this.el = document.createElement("table");
    this.createChildrenDOM();
  }
  updateDOM() {
    this.updateChildrenDOM();
  }
}
declare module "../element" {
  interface ElementGenericFuncs {
    table<Metadata extends string = "", Item = unknown>(
      data: D<Item[]>,
      key: string | ((item: Item) => D<string>),
      rowProc: (item: Item) => void
    ): RetValue<boolean, TableElement>;
  }
}
registerElement(function table<Item>(
  this: View,
  id: string,
  metadata: Metadata,
  data: D<Item[]>,
  key: string | ((item: Item) => D<string>),
  rowProc: (item: Item) => D<string>
) {
  return this.parent(
    id,
    metadata,
    TableElement,
    () => {
      let k: (item: Item) => any;
      if (typeof key === "string") {
        k = (item: Item) => getD(item[key as string]);
      } else {
        k = key;
      }
      getD(data).forEach((item) => {
        let r = () => rowProc(item);
        let i = `${id}[${getD(k(item))}]`;
        this.status.idPrefix.push(i);
        this._.tr(r);
        this.status.idPrefix.pop();
      });
    },
    {}
  );
});

export class TableRowElement extends MElementWithChildren<HTMLTableRowElement> {
  createDOM() {
    this.el = document.createElement("tr");
    this.createChildrenDOM();
  }
  updateDOM() {
    this.updateChildrenDOM();
  }
}
declare module "../element" {
  interface ElementFuncs {
    tr: [TableRowElement, [inner: ViewRender]];
  }
}
registerElement(function tr(id: string, metadata: Metadata, inner: ViewRender) {
  return this.parent(id, metadata, TableRowElement, inner, {});
});

export class TableCellElement extends MElementWithChildren<HTMLTableCellElement> {
  createDOM() {
    this.el = document.createElement("td");
    this.createChildrenDOM();
  }
  updateDOM() {
    this.updateChildrenDOM();
  }
}
declare module "../element" {
  interface ElementFuncs {
    td: [TableCellElement, [inner: ViewRender]];
  }
}
registerElement(function td(id: string, metadata: Metadata, inner: ViewRender) {
  return this.parent(id, metadata, TableCellElement, inner, {});
});
