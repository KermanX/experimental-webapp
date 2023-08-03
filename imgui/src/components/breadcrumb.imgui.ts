import { D, MElement, Metadata, getD, registerElement } from "../lib";
import { byIndex, bySelf } from "../loop";

export type BreadCrumbItem = string;

export class BreadCrumbComponent {
  constructor() {}
}

declare module "../element" {
  interface ElementFuncs {
    breadcrumb: [BreadCrumbComponent, [items: D<BreadCrumbItem[]>]];
  }
}
registerElement(function breadcrumb(
  id: string,
  metadata: Metadata,
  items: D<BreadCrumbItem[]>
) {
  let itemsValue = getD(items);
  return this._.ul(() => {
    this._.for(itemsValue.slice(0, -1), byIndex, (item) => {
      this._.li<"{display:inline;list-style:none;}">(() => {
        this._.span(item);
        this._.span<"{color:grey}">(" / ");
      });
    });
    this._.li<"{display:inline;list-style:none;}">(() => {
      this._.span(itemsValue.at(-1));
    });
  });
});
