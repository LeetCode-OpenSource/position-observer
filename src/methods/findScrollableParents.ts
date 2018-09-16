interface ScrollableProperties {
  [key: string]: boolean | undefined;
}

const scrollableProperties: ScrollableProperties = {
  auto: true,
  scroll: true,
};

function isScrollable(element: HTMLElement) {
  const { overflowY, overflowX } = window.getComputedStyle(element);
  const canScrollY = overflowY && scrollableProperties[overflowY];
  const canScrollX = overflowX && scrollableProperties[overflowX];
  return !!(canScrollY || canScrollX);
}

export function findScrollableParents(
  element: HTMLElement,
  scrollableParents: HTMLElement[] = [],
): HTMLElement[] {
  const parent = element.parentElement;
  if (parent && parent !== window.document.body) {
    if (isScrollable(parent)) {
      scrollableParents.push(parent);
    }
    return findScrollableParents(parent, scrollableParents);
  } else {
    return scrollableParents;
  }
}