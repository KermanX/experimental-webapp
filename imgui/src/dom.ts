import { D, PD, Ref, getD, setD } from "./data.js";
// import { ElementFunction, createElementFunction } from "./elementFunction.js";
import { ExtraInfo, writeExtraInfoToDOM } from "./extraInfo.js";
import { View, ViewRender } from "./view.js";

// class MIdManager {
//   protected currentId: MId = Symbol();
//   generate(): MId {
//     const id = this.currentId;
//     this.currentId = Symbol();
//     return id;
//   }
// }
// const mIdManager = new MIdManager();

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

export class ButtonElement extends MElement<HTMLButtonElement> {
  text: string;
  disabled: boolean;
  createDOM() {
    this.el = document.createElement("button");
    this.el.addEventListener("click", (e) => {
      this.view.fire(this.id, e);
    });
  }
  updateDOM() {
    this.el.textContent = this.text;
    this.el.disabled = this.disabled;
  }
}

export class ParagraphElement extends MElement<HTMLParagraphElement> {
  text: string;
  createDOM() {
    this.el = document.createElement("p");
  }
  updateDOM() {
    this.el.textContent = this.text;
  }
}

export class SpanElement extends MElement<HTMLSpanElement> {
  text: string;
  createDOM() {
    this.el = document.createElement("span");
  }
  updateDOM() {
    this.el.textContent = this.text;
  }
}

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
    this.inputEl.value =  getD(this.value).toString();
  }
}

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

export class StyleElement extends MElement<HTMLStyleElement> {
  source: D<string>;
  createDOM() {
    this.el = document.createElement("style");
  }
  updateDOM() {
    this.el.innerHTML = getD(this.source);
  }
}

export class TableElement extends MElementWithChildren<HTMLTableElement> {
  createDOM() {
    this.el = document.createElement("table");
    this.createChildrenDOM();
  }
  updateDOM() {
    this.updateChildrenDOM();
  }
}

export class TableRowElement extends MElementWithChildren<HTMLTableRowElement> {
  createDOM() {
    this.el = document.createElement("tr");
    this.createChildrenDOM();
  }
  updateDOM() {
    this.updateChildrenDOM();
  }
}

export class TableCellElement extends MElementWithChildren<HTMLTableCellElement> {
  createDOM() {
    this.el = document.createElement("td");
    this.createChildrenDOM();
  }
  updateDOM() {
    this.updateChildrenDOM();
  }
}

export type Metadata = {
  id: string | null;
  classes: string[];
  style: string | null;
  ref?: Ref | null;
} | null;

// export const $:any = new Proxy(
//   {},
//   {
//     get:
//       (_, key: string) =>
//       (id:string, metadata: Metadata, ...args: any[]) => {
//         let el = elements[key];
//         if (metadata) {
//           if (metadata.id) el = el.id(metadata.id);
//           if (metadata.classes) el = el.cls(metadata.classes);
//           if (metadata.style) el = el.style(metadata.style);
//         }
//         return el(...args);
//       },
//   }
// );

export type RetValue<R, E extends MElement> = R & {
  as(ref: Ref<E>): R;
};

export const elementFuncs = {
  div(id: string, metadata: Metadata, inner: ViewRender) {
    this.parent(id, metadata, DivElement, inner, {});
  },
  button(id: string, metadata: Metadata, text: string) {
    const e = this.child(id, metadata, ButtonElement, { text });
    return this.status.receiver === e.id;
  },
  p(id: string, metadata: Metadata, text: string) {
    this.child(id, metadata, ParagraphElement, { text });
  },
  t(id: string, metadata: Metadata, text: string) {
    this.child(id, metadata, SpanElement, { text });
  },
  numberInput(
    id: string,
    metadata: Metadata,
    label: D<string>,
    value: D<number>
  ) {
    this.child(id, metadata, NumberInputElement, { label, value });
  },
  textInput(
    id: string,
    metadata: Metadata,
    label: D<string>,
    value: D<string>
  ) {
    this.child(id, metadata, TextInputElement, { label, value });
  },
  style(id: string, metadata: Metadata, source: D<string>) {
    this.child(id, metadata, StyleElement, { source });
  },
  table<Item>(
    id: string,
    metadata: Metadata,
    data: D<Item[]>,
    rowProc: (item: Item) => [D<string>, () => void]
  ) {
    this.parent(
      id,
      metadata,
      TableElement,
      () => {
        getD(data).forEach((item) => {
          let [i, r] = rowProc(item);
          i = `${id}[${getD(i)}]`;
          this.status.idPrefix.push(i);
          //@ts-ignore
          this.context.$.tr("row", {}, r);
          this.status.idPrefix.pop();
        });
      },
      {}
    );
  },
  tr(id: string, metadata: Metadata, render: ViewRender) {
    this.parent(id, metadata, TableRowElement, render, {});
  },
  td(id: string, metadata: Metadata, render: ViewRender) {
    this.parent(id, metadata, TableCellElement, render, {});
  },
} as ThisType<View>;

export type Elements = {
  div: [DivElement, [inner: ViewRender], void];
  button: [ButtonElement, [text: string], boolean];
  p: [ParagraphElement, [text: string], void];
  t: [SpanElement, [text: string], void];
  numberInput: [NumberInputElement, [label: D<string>, value: D<number>], void];
  textInput: [TextInputElement, [label: D<string>, value: D<string>], void];
  style: [StyleElement, [source: D<string>], void];
  table: [
    TableElement,
    [data: D<any[]>, render: (item: any) => [D<string>, () => void]],
    void,
  ];
  tr: [TableRowElement, [render: ViewRender], void];
  td: [TableCellElement, [render: ViewRender], void];
};
