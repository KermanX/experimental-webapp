import { MElement, MElementWithChildren, RootElement } from "./dom.js";

export type ViewRender = () => void;

export class View {
  constructor(public main: ViewRender) {}
  root = new RootElement("root");
  rootEl: HTMLElement;
  viewsSymbolMap = new Map<object, symbol>();
  mount() {
    if (!this.viewsSymbolMap.has(this.main)) {
      this.viewsSymbolMap.set(this.main, Symbol(this.main.toString()));
    }
    status.resetAs(State.create);
    this.main();

    this.rootEl = this.root.create(); // Create element in DOM.
    this.update(); // Write data to DOM.

    //setInterval(() => this.updateView(this.render), 300);
  }
  update() {
    status.resetAs(State.update);
    this.main();
    this.root.update(this.rootEl);
  }
  fire(receiver: string, data: any) {
    console.log("FIRE!", receiver, data)
    status.resetAs(State.recv, receiver);
    this.main();

    this.update();
  }
}

export let currentView: View;

export function view(render: ViewRender) {
  currentView = new View(render);
  currentView.mount();
}

export enum State {
  create, // 创建
  update, // 更新Element的props
  recv, // 接收消息，不得改变DOM
}

export class RenderingStatus {
  currrentParent: MElementWithChildren;
  currentState: State;
  currentLevel: number;
  currentNum: number;
  receiver: string | null;
  get currentId() {
    return `${this.currentLevel}-${this.currentNum}`;
  }
  get isReceiver() {
    return this.receiver === this.currentId;
  }

  map: Map<string, MElement> = new Map();

  resetAs(state: State, receiver: string | null = null) {
    status.currentState = state;
    this.currrentParent = currentView.root;
    this.currentLevel = 0;
    this.currentNum = 0;
    this.receiver = receiver;
  }

  protected createChild(el: MElement) {
    this.currrentParent?.children.push(el);
    this.map.set(this.currentId, el);
    return el;
  }

  protected createParent(el: MElementWithChildren, inner: ViewRender) {
    this.createChild(el);
    const parent = this.currrentParent;
    this.currrentParent = el;
    inner();
    this.currrentParent = parent;
  }

  protected updateChild<E extends MElement>(el: E, props: Partial<E>) {
    for (const key in props) {
      el[key] = props[key];
    }
  }

  protected updateParent<E extends MElementWithChildren>(
    el: E,
    inner: ViewRender,
    props: Partial<E>
  ) {
    this.updateChild(el, props);
    const parent = this.currrentParent;
    this.currrentParent = el;
    inner();
    this.currrentParent = parent;
  }

  child<E extends MElement>(elc: { new (id: string): E }, props: Partial<E>) {
    this.currentNum++;
    switch (this.currentState) {
      case State.create:
        this.createChild(new elc(this.currentId));
        break;
      case State.update:
        this.updateChild(this.map.get(this.currentId), props);
        break;
      case State.recv:
        break;
    }
  }

  parent<E extends MElementWithChildren>(
    elc: { new (id: string): E },
    inner: ViewRender,
    props: Partial<E>
  ) {
    const num = this.currentNum;
    this.currentNum = 0;
    this.currentLevel++;
    switch (this.currentState) {
      case State.create:
        this.createParent(new elc(this.currentId), inner);
        break;
      case State.update:
        this.updateParent(
          this.map.get(this.currentId) as MElementWithChildren,
          inner,
          props
        );
        break;
      case State.recv:
        const parent = this.currrentParent;
        this.currrentParent = this.map.get(this.currentId) as MElementWithChildren;
        inner();
        this.currrentParent = parent;
        break;
    }
    this.currentLevel--;
    this.currentNum = num;
  }
}

export const status = new RenderingStatus();
