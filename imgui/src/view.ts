import { RootElement } from "./components/dom.imgui.js";
import { D, dangerously_setD } from "./data.js";
import {
  MElement,
  MElementWithChildren,
  Metadata,
  Elements,
  elements,
  MElementCtor,
} from "./element.js";
// import { ExtraInfo } from "./extraInfo.js";

export type Context = Elements;

export type ViewRender = (_: Context) => void;

export const viewsSymbolMap = new Map<object, symbol>();

export class View {
  constructor(
    public main: ViewRender,
    public rootElementId: string
  ) {
    (this._ as any).$ = {};
    Object.entries(elements).forEach(([name, func]) => {
      (this._ as any).$[name] = func.bind(this);
    });
    this.root = new RootElement(this, rootElementId, {});
  }

  status = new RenderingStatus(this);
  _ = {} as Context;
  map: Map<string, MElement> = new Map();
  root: RootElement;

  mount() {
    if (!viewsSymbolMap.has(this.main)) {
      viewsSymbolMap.set(this.main, Symbol(this.main.toString()));
    }
    this.root.createDOM();
    this.update();
  }
  recv(receiver: string, data: any) {
    this.status.resetAs(State.recv, receiver);
    this.main(this._);
  }
  update() {
    this.status.resetAs(State.update);
    this.main(this._);
    this.root.updateDOM();
  }
  fire(receiver: string, data: any) {
    console.log("FIRE!", receiver, data);
    this.recv(receiver, data);
    this.update();
  }
  setD<T>(d: D<T>, v: T): boolean {
    const ret = dangerously_setD(d, v);
    this.update();
    return ret;
  }


  protected getOrCreate<E extends MElement>(
    id: string,
    metadata: Metadata,
    elc: MElementCtor<E>
  ) {
    id = this.status.getFullId(id);
    let e = this.map.get(id) as E;
    if (!e) {
      e = new elc(this, id, metadata);
      this.map.set(e.id, e);
    }
    if (metadata.ref) {
      metadata.ref.current = e;
    }
    return e;
  }

  protected writeProps<E extends MElement>(el: E, props: Partial<E>) {
    // el.extraInfo = this.extraInfo;
    for (const key in props) {
      el[key] = props[key];
    }
  }

  child<E extends MElement>(
    id: string,
    metadata: Metadata,
    elc: MElementCtor<E>,
    props: Partial<E>
  ): boolean {
    const e = this.getOrCreate(id, metadata, elc);
    switch (this.status.currentState) {
      case State.update:
        this.writeProps(e, props);
        this.status.currrentParent.children.push(e);
        break;
      case State.recv:
        break;
    }
    return this.status.receiver === e.id;
  }

  parent<E extends MElementWithChildren>(
    id: string,
    metadata: Metadata,
    elc: MElementCtor<E>,
    inner: ViewRender,
    props: Partial<E>
  ): boolean {
    const e = this.getOrCreate(id, metadata, elc);
    const oldParent = this.status.currrentParent;
    switch (this.status.currentState) {
      case State.update:
        this.writeProps(e, props);
        this.status.currrentParent.children.push(e);
        e.children = [];
        this.status.currrentParent = e;
        this.status.beginChild(id);
        inner(this._);
        this.status.endChild();
        break;
      case State.recv:
        this.status.currrentParent = this.map.get(id) as MElementWithChildren;
        this.status.beginChild(id);
        inner(this._);
        this.status.endChild();
        break;
    }
    this.status.currrentParent = oldParent;
    return this.status.receiver === e.id;
  }
}

export enum State {
  update, // 更新Element的props，若元素不存在则创建
  recv, // 接收消息，不得改变DOM
}

export class RenderingStatus {
  constructor(public view: View) {}

  currrentParent: MElementWithChildren;
  currentState: State;
  receiver: string | null;
  // receiverElementFunc: (keyof Elements) | null = null; // Always null. Just a type hint.
  protected idPrefix: string[];
  // extraInfo: ExtraInfo;

  resetAs(state: State, receiver: string | null = null) {
    this.currentState = state;
    this.currrentParent = this.view.root;
    this.receiver = receiver;
    this.idPrefix = ["root"];
    // this.extraInfo = { style: {} };
  }

  beginChild(parentId: string, index: string | number | null = null) {
    this.idPrefix.push(parentId + (index === null ? "" : `[${index}]`));
  }
  endChild() {
    this.idPrefix.pop();
  }

  getFullId(id: string) {
    return this.idPrefix.join(".") + "." + id;
  }
}

export function view(render: ViewRender, rootElementId: string = "root"): View {
  let currentView = new View(render, rootElementId);
  currentView.mount();
  return currentView;
}
