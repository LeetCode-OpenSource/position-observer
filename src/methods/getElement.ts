export function getElement(target: HTMLElement | string): HTMLElement {
  const element = target instanceof HTMLElement
    ? target
    : window.document.querySelector(target);

  if (element) {
    return element as HTMLElement;
  } else {
    throw new Error(`element require a HTMLElement but current is ${element}`);
  }
}