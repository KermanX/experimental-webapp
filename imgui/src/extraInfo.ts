import { Metadata } from "./dom";

export interface ExtraInfo {
  id?: string;
  classList?: string[];
  styleString?: string;
}

export function generateExtraInfoFromSelector(metadata: Metadata): ExtraInfo {
  if (!metadata) return {};
  return {
    id: metadata.id,
    classList: metadata.classes,
    styleString: metadata.style,
  };
}

export function writeExtraInfoToDOM(el: HTMLElement, extraInfo: ExtraInfo) {
  if (extraInfo.id) el.id = extraInfo.id;
  if (extraInfo.classList && extraInfo.classList!.length > 0)
    el.classList.add(...extraInfo.classList);
  if (extraInfo.styleString) el.style.cssText = extraInfo.styleString;
}
