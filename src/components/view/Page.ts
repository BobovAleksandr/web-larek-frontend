import { ensureElement } from "../../utils/utils";
import { Component } from "./common/Component";
import { IEvents } from "../base/events";

export class Page extends Component {
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
      this.events.emit('basketIcon:pressed')
    })
  }

  set basketCounter(value: string) {
    this._basketCounter.textContent = value
  }

  setCatalog(items: HTMLElement[]): void {
    this._cardsGallery.replaceChildren(...items)
  }   

  lockPage(value: boolean): void {
    const method = value ? 'add' : 'remove'
    this._wrapper.classList[method]('page__wrapper_locked')
  }

}