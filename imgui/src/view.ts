import { RootElement } from "./components/dom.imgui.js";
import {
  MElement,
  MElementWithChildren,
  Metadata,
  Elements,
  elements,
  MElementCtor,
} from "./element.js";
import { generateExtraInfoFromSelector } from "./extraInfo.js";
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
    this.root = new RootElement(this, rootElementId);
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

  // setExtraInfo(info: ExtraInfo) {
  //   this.extraInfo = info;
  // }
  protected initChild(e: MElement, metadata: Metadata) {
    e.extraInfo = generateExtraInfoFromSelector(metadata);
    this.map.set(e.id, e);
  }

  protected getOrCreate<E extends MElement>(
    id: string,
    metadata: Metadata,
    elc: MElementCtor<E>
  ) {
    id = this.status.idPrefix.join(".") + "." + id;
    let e = this.map.get(id) as E;
    if (!e) {
      e = new elc(this, id);
      this.initChild(e, metadata);
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
  ): void {
    const e = this.getOrCreate(id, metadata, elc);
    switch (this.status.currentState) {
      case State.update:
        this.writeProps(e, props);
        this.status.currrentParent.children.push(e);
        break;
      case State.recv:
        break;
    }
  }

  parent<E extends MElementWithChildren>(
    id: string,
    metadata: Metadata,
    elc: MElementCtor<E>,
    inner: ViewRender,
    props: Partial<E>
  ): void {
    const e = this.getOrCreate(id, metadata, elc);
    const oldParent = this.status.currrentParent;
    switch (this.status.currentState) {
      case State.update:
        this.writeProps(e, props);
        this.status.currrentParent.children.push(e);

        // const oldChildren = e.children.map((c) => c.id);

        e.children = [];
        this.status.currrentParent = e;
        inner(this._);
        // for(const child of e.children){
        //   if(!oldChildren.includes(child.id)){

        //   }
        // }

        // inner();
        break;
      case State.recv:
        this.status.currrentParent = this.map.get(id) as MElementWithChildren;
        inner(this._);
        break;
    }
    this.status.currrentParent = oldParent;
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
  idPrefix: string[];
  // extraInfo: ExtraInfo;

  resetAs(state: State, receiver: string | null = null) {
    this.currentState = state;
    this.currrentParent = this.view.root;
    this.receiver = receiver;
    this.idPrefix = ["root"];
    // this.extraInfo = { style: {} };
  }
}

export function view(render: ViewRender, rootElementId: string = "root"): View {
  let currentView = new View(render, rootElementId);
  currentView.mount();
  return currentView;
}
