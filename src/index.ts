import { getElement, resizeDetector, scrollDetector } from './methods';

interface Config {
  target: HTMLElement | string;
  onUpdated: (rect: ClientRect | DOMRect) => void;
}

export default class PositionObserver {
  private readonly element: HTMLElement;

  private _isSuspend: boolean = false;

  private onUpdated = () => {
    if (!this._isSuspend) {
      const rect = this.element.getBoundingClientRect();
      this.config.onUpdated(rect);
    }
  };

  constructor(private readonly config: Config) {
    this.element = getElement(config.target);
    resizeDetector().listenTo(this.element, this.onUpdated);
    scrollDetector().listenTo(this.element, this.onUpdated);
  }

  public get isSuspend() {
    return this._isSuspend;
  }

  public pause() {
    this._isSuspend = true;
  }

  public start() {
    this._isSuspend = false;
  }

  public destroy() {
    resizeDetector().removeListener(this.element, this.onUpdated);
    scrollDetector().removeListener(this.element, this.onUpdated);
  }
}