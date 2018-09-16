import { findScrollableParents } from './findScrollableParents';

type Callback = (element: HTMLElement) => void;

interface Cache {
  element: HTMLElement;
  scrollableParents: Set<HTMLElement>;
  onScroll: (event: UIEvent) => void;
  callbacks: Set<Callback>;
}

function OnScroll(map: Map<HTMLElement, Cache>) {
  return function onScroll({ target }: UIEvent) {
    const isRootContainer =
      target === window.document.body ||
      target === window.document;

    map.forEach((cache) => {
      const {
        element,
        callbacks,
        scrollableParents,
      } = cache;

      if (
        isRootContainer ||
        (target instanceof HTMLElement && scrollableParents.has(target))
      ) {
        callbacks.forEach((callback) => {
          callback(element);
        });
      }
    });
  }
}

class ScrollDetector {
  map = new Map<HTMLElement, Cache>();

  onBodyScroll = OnScroll(this.map);

  private updateScrollListenerFromParents(element: HTMLElement, isRemoveListener?: boolean) {
    const cache = this.map.get(element);

    if (cache) {
      cache.scrollableParents.forEach((parent) => {
        if (isRemoveListener) {
          parent.removeEventListener('scroll', cache.onScroll);
        } else {
          parent.addEventListener('scroll', cache.onScroll);
        }
      });

      if (isRemoveListener) {
        this.map.delete(element);
      }
    }
  }

  constructor() {
    window.addEventListener('scroll', this.onBodyScroll);
  }

  public listenTo(element: HTMLElement, callback: Callback) {
    const cache = this.map.get(element);

    if (cache) {
      cache.callbacks.add(callback);
    } else {
      this.map.set(element, {
        element,
        onScroll: OnScroll(this.map),
        callbacks: new Set([callback]),
        scrollableParents: new Set(findScrollableParents(element)),
      });
    }

    this.updateScrollListenerFromParents(element);
  }

  public removeListener(element: HTMLElement, callback: Callback) {
    const cache = this.map.get(element);
    if (cache) {
      cache.callbacks.delete(callback);

      if (cache.callbacks.size < 1) {
        this.updateScrollListenerFromParents(element, true);
      }
    }
  }
}

let detector: ScrollDetector | null = null;

export function scrollDetector() {
  if (!detector) {
    detector = new ScrollDetector();
  }
  return detector;
}