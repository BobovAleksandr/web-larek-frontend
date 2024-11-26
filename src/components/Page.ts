import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";
import { IEvents } from "./base/events";

interface IPage {
  basketCounter: number;
}

export class Page extends Component implements IPage {
  protected _basketButton: HTMLButtonElement;
  protected _basketCounter: HTMLSpanElement;
  protected _cardsGallery: HTMLElement;
  protected _wrapper: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)
    
    this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container)
    this._basketCounter = ensureElement<HTMLSpanElement>('.header__basket-counter', this.container)
    this._cardsGallery = ensureElement<HTMLElement>('.gallery', this.container)
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper', this.container)

    this._basketButton.addEventListener('click', () => {
      this.events.emit('basket:changed')
      this.events.emit('basket:open')
    })
  }

  set basketCounter(value: number) {
    this._basketCounter.textContent = String(value)
  }

  setCatalog(items: HTMLElement[]) {
    this._cardsGallery.replaceChildren(...items)
  }   

  lockPage(value: boolean) {
    const method = value ? 'add' : 'remove'
    this._wrapper.classList[method]('page__wrapper_locked')
  }

}