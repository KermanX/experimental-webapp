import { D, Metadata, byIndex, getD, registerElement } from "../lib";

export type BreadCrumbItem = string;

export class BreadCrumbComponent {
  constructor() {}
}

declare module "../element" {
  interface ElementFuncs {
    breadcrumb: [BreadCrumbComponent, [items: D<BreadCrumbItem[]>], never];
  }
}
registerElement(function breadcrumb(
  id: string,
  metadata: Metadata,
  items: D<BreadCrumbItem[]>
) {
  let itemsValue = getD(items);
  this.status.beginChild(id);
  this._.ul<typeof metadata>(() => {
    this._.for(itemsValue.slice(0, -1), byIndex, (item) => {
      this._.li<"{display:inline;list-style:none;}">(() => {
        this._.span(item);
        this._.span<"{color:grey}">(" / ");
      });
    });
    this._.li<"{display:inline;list-style:none;}">(() => {
      this._.span(itemsValue.at(-1)!);
    });
  });
  this.status.endChild();
  return false;
});
